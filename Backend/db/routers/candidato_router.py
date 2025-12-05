from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(tags=["Candidatos e Simulação"])
DbDependency = Depends(get_db)

@router.post(
    "/cadastro", 
    response_model=schemas.Candidato, 
    status_code=status.HTTP_201_CREATED, 
    summary="Cria novo candidato (Cadastro inicial)"
)
def cadastro_endpoint(candidato: schemas.CandidatoCreate, db: Session = DbDependency):
    """Cria um novo registro de candidato (nome, email, senha, Features 1-4)."""
    try:
        # 1. Chama a função do crud.py, passando a sessão 'db' e os dados 'candidato'
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
    skip: int = Query(0, ge=0), 
    limit: int = Query(100, le=100)
):
    """Retorna uma lista paginada de todos os candidatos."""
    # 1. Chama a função do crud.py, passando a sessão 'db' e os parâmetros de paginação
    return crud.get_candidatos(db, skip=skip, limit=limit)

@router.post(
    "/formulario/{candidato_id}",
    response_model=schemas.Candidato, 
    status_code=status.HTTP_200_OK,
    summary="Completa os dados de inscrição e curso (Features 5-8)."
)
def update_candidato_complementary_data(
    candidato_id: int, 
    dados_complementares: schemas.DadosComplementaresRequest, 
    db: Session = DbDependency, 
):
    db_candidato = db.query(models.Candidato).filter(models.Candidato.ID == candidato_id).first()
    if not db_candidato:
        raise ValueError(f"Candidato com ID {candidato_id} não encontrado.")

    db_instituicao = crud.get_or_create_instituicao(db, dados_complementares.instituicao)
    db_curso = crud.get_or_create_curso(db, dados_complementares.curso, db_instituicao.ID)

    inscricao_data = {
        "ano_sisu": 2024,
        "modalidade": dados_complementares.modalidade_concorrencia, 
        "ID_Candidato": db_candidato.ID,
        "ID_curso": db_curso.ID,
    }
    db_inscricao = models.Inscricao(**inscricao_data)
    db.add(db_inscricao)

    try:
        db.commit()
        db.refresh(db_candidato)
        return db_candidato
    except Exception as e:
        db.rollback()
        raise Exception(f"Erro ao salvar dados complementares. Detalhe: {e}")

@router.get(
    "/resultados/{candidato_id}",
    response_model=schemas.ResultadoSimulacao, 
    summary="Obtém a classificação de bolsa ProUni via modelo de IA (Integral/Parcial)."
)
def get_resultados_ia_endpoint(candidato_id: int, db: Session = DbDependency):
    """
    Aciona o modelo de IA para classificar o tipo de bolsa (Integral ou Parcial)
    com base nos 8 dados completos do candidato.
    """
    try:
        return crud.classificar_bolsa_candidato(db=db, candidato_id=candidato_id)
        
    except Exception as e:
        if "Candidato ou dados de inscrição não encontrados" in str(e):
             raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/cursos/individual", response_model=schemas.CursoCreate, status_code=status.HTTP_201_CREATED)
def create_curso_individual_endpoint(
    request_data: schemas.CursoIndividualCreateRequest, 
    db: Session = DbDependency
):
    try:
        
        return crud.create_curso_individual(
            db=db, 
            curso_data=request_data.curso, 
            instituicao_data=request_data.instituicao
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get(
    "/cursos/", 
    response_model=List[schemas.CursoResponse], 
    summary="Lista todos os cursos com seus dados completos."
)
def list_cursos_endpoint(
    db: Session = DbDependency, 
    skip: int = Query(0, ge=0), 
    limit: int = Query(100, ge=1)
):
    """Retorna uma lista paginada de todos os cursos."""
    cursos = crud.get_cursos(db, skip=skip, limit=limit)
    return cursos

@router.get(
    "/cursos/{curso_id}", 
    response_model=schemas.CursoResponse, 
    summary="Busca um curso pelo ID."
)
def get_curso_by_id_endpoint(curso_id: int, db: Session = DbDependency):
    """Busca um curso específico pelo ID."""
    curso = crud.get_curso_by_id(db, curso_id)
    if curso is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso não encontrado.")
    return curso

@router.delete(
    "/cursos/{curso_id}", 
    status_code=status.HTTP_204_NO_CONTENT, 
    summary="Deleta um curso pelo ID."
)
def delete_curso_endpoint(curso_id: int, db: Session = DbDependency):
    """Deleta um curso específico pelo ID."""
    try:
        crud.delete_curso(db, curso_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Curso com ID {curso_id} não encontrado."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao deletar o curso: {e}"
        )

@router.put(
    "/cursos/{curso_id}", 
    response_model=schemas.CursoCreate, 
    status_code=status.HTTP_200_OK,
    summary="Atualiza todos os campos de um curso existente."
)
@router.put(
    "/cursos/{curso_id}", 
    response_model=schemas.CursoCreate, 
    status_code=status.HTTP_200_OK,
    summary="Atualiza todos os campos de um curso existente."
)
def update_curso_endpoint(
    curso_id: int, 
    curso_data: schemas.CursoCreate, 
    db: Session = DbDependency
):
    """Atualiza todos os campos de um curso existente (pesos, notas de corte, grau, turno, etc.) pelo ID."""
    updated_curso = crud.update_curso(db, curso_id, curso_data)
    
    if updated_curso is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Curso com ID {curso_id} não encontrado para atualização."
        )
    
    return updated_curso

@router.post(
    "/dados/lote/", 
    status_code=status.HTTP_201_CREATED, 
    summary="Insere dados de teste em lote",
    tags=["Administração e teste"]
)
def create_dados_lote_endpoint(candidatos_lote: schemas.LoteCandidatos, db: Session = DbDependency):
    """Insere múltiplos candidatos, instituições, cursos e inscrições em uma transação atômica."""
    try:
        crud.create_candidatos_lote(db, candidatos_lote)
        return {"message": "Dados em lote inseridos com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))