from sqlalchemy.orm import Session
from backend.db import models, schemas
from typing import List, Optional, Any
from sqlalchemy import func, case 


def get_curso_by_name(db: Session, nome_curso: str) -> Optional[models.Curso]:
    """Busca um curso no banco de dados pelo nome."""
    return db.query(models.Curso).filter(
        func.lower(models.Curso.nome_curso) == func.lower(nome_curso)
    ).first()

def get_cursos(db: Session, skip: int = 0, limit: int = 100) -> List[models.Curso]:
    """Retorna uma lista paginada de todos os cursos cadastrados."""
    return db.query(models.Curso).offset(skip).limit(limit).all()

def get_curso_by_id(db: Session, curso_id: int) -> Optional[models.Curso]:
    """Busca um curso no banco de dados pelo ID."""
    return db.query(models.Curso).filter(models.Curso.ID == curso_id).first()

def create_curso_individual(
    db: Session, 
    curso_data: schemas.CursoCreate, 
    instituicao_data: schemas.InstituicaoCreate
) -> models.Curso:
    """
    Cria ou busca uma Instituição e, em seguida, cria um Curso individualmente.
    Garante que o curso (nome, grau, turno, instituição) seja único.
    """
    try:
        
        db_instituicao = get_or_create_instituicao(db, instituicao_data)
        
        instituicao_id = db_instituicao.ID
        
        db_curso = db.query(models.Curso).filter(
            models.Curso.nome_curso == curso_data.nome_curso,
            models.Curso.ID_instituicao == instituicao_id,
            models.Curso.grau == curso_data.grau,
            models.Curso.turno == curso_data.turno 
        ).first()

        if db_curso:
            raise Exception("Este curso já está cadastrado nesta instituição, grau e turno.")
            
        curso_dict = curso_data.model_dump()
        
        # Remove 'modalidade' se ainda estiver no CursoCreate
        if 'modalidade' in curso_dict:
            del curso_dict['modalidade']
            
        db_curso = models.Curso(
            **curso_dict,
            ID_instituicao=instituicao_id
        )
        db.add(db_curso)
        db.commit()
        db.refresh(db_curso)
        return db_curso

    except Exception as e:
        db.rollback()
        raise e

def calcular_aprovacao(db:Session, candidato_id: int, curso_id: int):
    """
    Calcula se a nota Média Ponderada do candidato é suficiente para a nota mínima do curso.
    """
    
    db_nota = db.query(models.Nota).filter(
        models.Nota.ID_Candidato == candidato_id
    ).first()

    db_curso = db.query(models.Curso).filter(
        models.Curso.ID == curso_id
    ).first()

    if not db_nota or not db_curso:
        return {"aprovado": False, "mensagem": "Dados insuficientes para calcular a aprovação (Candidato/Notas/Curso não encontrados)."}

    
    numerador = (
        (db_nota.nota_ct * db_curso.peso_ct) +
        (db_nota.nota_ch * db_curso.peso_ch) +
        (db_nota.nota_lc * db_curso.peso_lc) +
        (db_nota.nota_mt * db_curso.peso_mt) +
        (db_nota.nota_redacao * db_curso.peso_redacao)
    )

    denominador = (
        db_curso.peso_ct + 
        db_curso.peso_ch + 
        db_curso.peso_lc + 
        db_curso.peso_mt + 
        db_curso.peso_redacao
    )
    
    if denominador == 0:
        return {"aprovado": False, "mensagem": "Erro de configuração: A soma dos pesos do curso é zero."}

    nota_candidato = numerador / denominador
    
    nota_minima_corte = db_curso.nota_minima
    curso_nome = db_curso.nome_curso

    aprovado = nota_candidato >= nota_minima_corte
    diferenca = nota_candidato - nota_minima_corte
    
    resultado = {
        "aprovado": aprovado,
        "nota_candidato": round(nota_candidato, 2),
        "nota_minima_corte": round(nota_minima_corte, 2),
        "curso": curso_nome,
        "diferenca": round(diferenca, 2)
    }

    if aprovado:
        resultado["mensagem"] = f"Parabéns! Sua Média Ponderada ({resultado['nota_candidato']}) é suficiente para o curso de {resultado['curso']}."
    else:
        resultado["mensagem"] = f" Sua Média Ponderada ({resultado['nota_candidato']}) está abaixo da nota de corte ({resultado['nota_minima_corte']}) por {abs(resultado['diferenca'])} pontos."

    return resultado


def get_candidato_by_email(db:Session, email:str) -> Optional[models.Candidato]:
    return db.query(models.Candidato).filter(models.Candidato.email == email).first()

def authenticate_candidato(db:Session, email:str, senha:str) -> Optional[models.Candidato]:
    
    db_candidato = get_candidato_by_email(db, email)

    if not db_candidato:
        return None
    
    if db_candidato.senha == senha:
        return db_candidato
    
    return None

def get_or_create_instituicao(db: Session, instituicao_data: schemas.InstituicaoCreate) -> models.Instituicao:
    """
    Busca uma Instituição existente pela sigla e modalidade ou a cria se não existir.
    """
    
    db_instituicao = db.query(models.Instituicao).filter(
        (models.Instituicao.sigla == instituicao_data.sigla),
        (models.Instituicao.modalidade == instituicao_data.modalidade)
    ).first()
    
    if db_instituicao:
        return db_instituicao
    
    db_instituicao = models.Instituicao(**instituicao_data.model_dump())
    db.add(db_instituicao)
    db.flush() 
    return db_instituicao


def get_or_create_curso(db: Session, curso: schemas.CursoCreate, instituicao_id: int) -> models.Curso:
    """Busca um Curso existente ou o cria. Remove modalidade da busca/criação e inclui pesos."""
    
    db_curso = db.query(models.Curso).filter(
        models.Curso.nome_curso == curso.nome_curso,
        models.Curso.ID_instituicao == instituicao_id,
        models.Curso.grau == curso.grau,
        models.Curso.turno == curso.turno 
    ).first()

    if db_curso:
        return db_curso

    curso_dict = curso.model_dump()
    if 'modalidade' in curso_dict: 
        del curso_dict['modalidade']
        
    db_curso = models.Curso(
        **curso_dict,
        ID_instituicao=instituicao_id
    )
    db.add(db_curso)
    db.flush()
    db.refresh(db_curso)
    return db_curso


def create_candidato(db:Session, candidato:schemas.CandidatoCreate):
    """Cria um candidato para a Página de Cadastro."""
    db_candidato = models.Candidato(**candidato.model_dump())
    
    try:
        db.add(db_candidato)
        db.commit()
        db.refresh(db_candidato)
        return db_candidato
    except Exception as e:
        db.rollback()
        if "UNIQUE constraint failed: candidato.email" in str(e):
             raise Exception("Email já cadastrado.")
        raise 
        
def get_candidatos(db:Session, skip:int = 0, limit: int =100) -> List[models.Candidato]:
    return db.query(models.Candidato).offset(skip).limit(limit).all()

def get_candidato(db: Session, candidato_id: int) -> Optional[models.Candidato]:
    return db.query(models.Candidato).filter(models.Candidato.ID == candidato_id).first()

def update_candidato(db: Session, candidato_id: int, candidato_data: schemas.CandidatoBase):
    db_candidato = get_candidato(db, candidato_id)
    if db_candidato:

        for key, value in candidato_data.model_dump(exclude_unset=True).items():
            setattr(db_candidato, key, value)
        
        db.commit()
        db.refresh(db_candidato)
        return db_candidato
    return None

def delete_candidato(db: Session, candidato_id: int):
    db_candidato = get_candidato(db, candidato_id)
    if db_candidato:
        db.delete(db_candidato)
        db.commit()
        return {"detail": "Candidato deletado com sucesso"}
    return None

def update_candidato_complementary_data(
    db: Session, candidato_id: int, data: schemas.DadosComplementaresRequest
) -> models.Candidato:
    """
    Insere ou atualiza os dados de Nota, Instituição e Curso de interesse para um candidato existente.
    """
    db_candidato = get_candidato(db, candidato_id)
    if not db_candidato:
        raise Exception("Candidato não encontrado.")

    db_instituicao = get_or_create_instituicao(db, data.instituicao)

    db_curso = db.query(models.Curso).join(models.Instituicao).filter(
        models.Curso.nome_curso == data.curso.nome_curso,
        models.Curso.ID_instituicao == db_instituicao.ID,
        models.Curso.grau == data.curso.grau,
        models.Curso.turno == data.curso.turno
    ).first()

    if not db_curso:
        raise Exception(
            f"O curso '{data.curso.nome_curso}' na instituição '{db_instituicao.sigla}' não está cadastrado "
            "com esses parâmetros (Grau/Turno/Modalidade da Instituição)."
        )

    # 3. Nota 
    db_nota = db.query(models.Nota).filter(models.Nota.ID_Candidato == candidato_id).first()
    
    nota_dict = data.nota.model_dump(exclude={"modalidade_concorrencia"}) 

    if db_nota:
        for key, value in nota_dict.items():
            setattr(db_nota, key, value)
    else:
        db_nota = models.Nota(**nota_dict, ID_Candidato=candidato_id)
        db.add(db_nota)

    db_inscricao = db.query(models.Inscricao).filter(models.Inscricao.ID_Candidato == candidato_id).first()

    inscricao_data = {
        "ano_sisu": 2025, 
        "modalidade": data.nota.modalidade_concorrencia,
        "ID_Candidato": candidato_id,
        "ID_curso": db_curso.ID,
        "ID_nota": db_nota.ID_Nota
    }

    if db_inscricao:
        for key, value in inscricao_data.items():
            setattr(db_inscricao, key, value)
    else:
        db_inscricao = models.Inscricao(**inscricao_data)
        db.add(db_inscricao)


    try:
        db.commit()
        db.refresh(db_candidato)
        return db_candidato

    except Exception as e:
        db.rollback()
        raise Exception(f"Erro ao salvar dados complementares. Detalhe: {e}")


def create_candidatos_lote(db: Session, candidatos_lote: schemas.LoteCandidatos):
    """
    Insere múltiplos candidatos e TODAS as suas dependências em uma transação atômica.
    """
    
    for candidato_data in candidatos_lote.candidatos:
        
        candidato_dict = candidato_data.model_dump(exclude={'nota', 'instituicao', 'curso'}) 
        db_candidato = models.Candidato(**candidato_dict)
        db.add(db_candidato) 
        db.flush() 

        db_instituicao = get_or_create_instituicao(db, candidato_data.instituicao)

        db_curso = get_or_create_curso(db, candidato_data.curso, db_instituicao.ID)

        nota_dict = candidato_data.nota.model_dump(exclude={"modalidade_concorrencia"})
        db_nota = models.Nota(**nota_dict, ID_Candidato=db_candidato.ID)
        db.add(db_nota)
        db.flush()

        inscricao_data = {
            "ano_sisu": 2024,
            "modalidade": candidato_data.nota.modalidade_concorrencia,
            "ID_Candidato": db_candidato.ID,
            "ID_curso": db_curso.ID,
            "ID_nota": db_nota.ID_Nota
        }
        db_inscricao = models.Inscricao(**inscricao_data)
        db.add(db_inscricao)


    try:
        db.commit() 
        return {"status": "success", "message": f"{len(candidatos_lote.candidatos)} pacotes de dados inseridos com sucesso."}
    
    except Exception as e:
        db.rollback()
        raise Exception(f"Erro ao inserir dados em lote. A transação foi revertida (rollback). Detalhe: {e}")