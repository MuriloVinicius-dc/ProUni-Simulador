from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from backend.db import crud, models, schemas
from backend.db.database import get_db

router = APIRouter(tags=["Candidatos e Simulação"])
DbDependency = Depends(get_db)

@router.post(
    "/cadastro", 
    response_model=schemas.Candidato, 
    status_code=status.HTTP_201_CREATED, 
    summary="Cria novo candidato (Cadastro inicial)"
)
def cadastro_endpoint(candidato: schemas.CandidatoCreate, db: Session = DbDependency):
    """
    Cria um novo registro de candidato (nome, email, senha, etc.).
    """
    try:
        return crud.create_candidato(db=db, candidato=candidato)
    except Exception as e:
        if "Email já cadastrado" in str(e):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email já cadastrado.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get(
        "/candidatos/",
        response_model=List[schemas.Candidato],
        summary="Lista de todos os candidatos cadastrados",
        tags=["Administração e teste"]
)

def list_candidatos_endpoint(
    db:Session = DbDependency,
    skip:int = Query(0, ge=0, description="Números de registros"),
    limit: int = Query(100, le=100, description="Número máximo de registro por página")
):
    """Retorna lista de todos os candidatos no sistema"""
    candidatos = crud.get_candidatos(db,skip=skip, limit=limit)
    return candidatos

@router.put(
        "/candidatos/{candidato_id}",
        response_model=schemas.Candidato,
        summary="Atualiza dados de um candidato"
)

def update_candidato_endpoint(
    candidato_id:int,
    candidato_data : schemas.CandidatoBase,
    db:Session = DbDependency
):
    """Atualiza dados de um candidato"""
    try:
        updated_candidato = crud.update_candidato(db,candidato_id, candidato_data)

        if updated_candidato is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidato não encontrado"
            )
        return updated_candidato
    
    except Exception as e:
        detail_msg = str(e)
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

        if "Candidato não encontrado" in detail_msg:
            status_code = status.HTTP_404_NOT_FOUND
        elif "O novo e-mail fornecido já está em uso" in detail_msg:
            status_code = status.HTTP_409_CONFLICT
        raise HTTPException(status_code=status_code, detail=detail_msg)

@router.post(
    "/login", 
    status_code=status.HTTP_200_OK, 
    summary="Autentica o candidato e retorna sucesso"
)
def login_endpoint(login_data: schemas.LoginRequest, db: Session = DbDependency):
    """
    Autentica o candidato com email e senha.
    Retorna o ID do candidato se for bem-sucedido.
    """
    candidato = crud.authenticate_candidato(db, email=login_data.email, senha=login_data.senha)
    
    if not candidato:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas."
        )
    
    return {"message": "Login bem-sucedido", "candidato_id": candidato.ID}


@router.post(
    "/formulario/{candidato_id}", 
    status_code=status.HTTP_200_OK, 
    summary="Preenche notas, instituição e curso de interesse"
)
def formulario_dados_complementares_endpoint(
    candidato_id: int, 
    data: schemas.DadosComplementaresRequest, 
    db: Session = DbDependency
):
    """
    Insere ou atualiza os dados complementares do candidato.
    Necessário estar logado (ID do candidato na URL).
    """
    try:
        updated_candidato = crud.update_candidato_complementary_data(db, candidato_id, data)
        return {"message": "Dados complementares salvos com sucesso", "candidato_id": updated_candidato.ID}
        
    except Exception as e:
        detail_msg = str(e)
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        
        if "Candidato não encontrado" in detail_msg:
            status_code = status.HTTP_404_NOT_FOUND
        elif "não está cadastrado" in detail_msg:
            status_code = status.HTTP_400_BAD_REQUEST
            
        raise HTTPException(status_code=status_code, detail=detail_msg)

@router.get(
    "/resultados/{candidato_id}", 
    response_model=schemas.ResultadoSimulacao,
    summary="Calcula e exibe o resultado da aprovação (Média Ponderada)"
)
def resultados_simulacao_endpoint(
    candidato_id: int, 
    db: Session = DbDependency
):
    """
    Executa o cálculo da Média Ponderada para o curso de interesse do candidato,
    buscando o curso na Inscrição simulada.
    """
    candidato = crud.get_candidato(db, candidato_id)
    if not candidato:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidato não encontrado.")

    db_inscricao = db.query(models.Inscricao).filter(models.Inscricao.ID_Candidato == candidato_id).order_by(models.Inscricao.ID_inscricao.desc()).first()

    if not db_inscricao:
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="O candidato não preencheu o formulário de interesse.")
    
    curso_id_interesse = db_inscricao.ID_curso

    resultado = crud.calcular_aprovacao(
        db=db, 
        candidato_id=candidato_id, 
        curso_id=curso_id_interesse
    )
    
    return resultado

@router.post(
    "/cursos/",
    response_model=schemas.CursoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Cadastra um novo curso individualmente"
)
def create_curso_individual_endpoint(
    data: schemas.CursoIndividualCreateRequest, 
    db: Session = DbDependency
):
    """
    Cadastra um novo curso com seus pesos e notas de corte, e o associa a uma 
    instituição (buscada/criada com sigla e modalidade).
    """
    try:
        db_curso = crud.create_curso_individual(
            db=db, 
            curso_data=data.curso, 
            instituicao_data=data.instituicao
        )
        return db_curso
    
    except Exception as e:
        detail_msg = str(e)
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        
        if "já está cadastrado" in detail_msg:
            status_code = status.HTTP_409_CONFLICT
            
        raise HTTPException(status_code=status_code, detail=detail_msg)

@router.get(
    "/cursos/",
    response_model=List[schemas.CursoResponse],
    summary="Lista todos os cursos cadastrados para seleção no formulário",
)
def list_cursos_endpoint(
    db: Session = DbDependency, 
    skip: int = Query(0, ge=0), 
    limit: int = Query(100, le=100)
):
    """
    Retorna uma lista paginada de cursos disponíveis para seleção no formulário de interesse.
    """
    cursos = crud.get_cursos(db, skip=skip, limit=limit)
    return cursos

@router.get(
    "/cursos/{curso_id}",
    response_model=schemas.CursoResponse,
    summary="Retorna detalhes de um curso específico",
)
def get_curso_detail_endpoint(
    curso_id: int, 
    db: Session = DbDependency
):
    """
    Retorna os detalhes completos de um curso pelo ID, incluindo pesos e notas de corte.
    """
    db_curso = crud.get_curso_by_id(db, curso_id)
    if db_curso is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Curso com ID {curso_id} não encontrado."
        )
    return db_curso

@router.post("/dados/lote/", status_code=status.HTTP_201_CREATED, summary="Insere dados de teste em lote")
def create_candidatos_lote_endpoint(lote: schemas.LoteCandidatos, db: Session = DbDependency):
    try:
        return crud.create_candidatos_lote(db=db, candidatos_lote=lote)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        
