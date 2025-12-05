from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional, Any
from sqlalchemy import func, case, or_
from . import ml_model 
from pydantic import BaseModel 
from .auth import pass_utils


def _get_ai_prediction(features: dict) -> str:
    """Encapsula a chamada ao modelo de IA."""
    return ml_model.classificar_bolsa(features)


def classificar_bolsa_candidato(db: Session, candidato_id: int):
    """
    Coleta os 10 dados de entrada (features) e chama o modelo de IA, 
    retornando o resultado no formato do schema ResultadoSimulacao.
    """
    db_candidato = db.query(models.Candidato).filter(models.Candidato.ID == candidato_id).first()
    
    # Busca a inscrição mais recente
    db_inscricao = db.query(models.Inscricao).filter(
        models.Inscricao.ID_Candidato == candidato_id
    ).order_by(models.Inscricao.ID_inscricao.desc()).first()

    if not db_candidato or not db_inscricao:
        raise Exception("Candidato ou dados de inscrição não encontrados. Preencha o formulário.") 

    db_curso = db.query(models.Curso).filter(models.Curso.ID == db_inscricao.ID_curso).first()
    db_instituicao = db.query(models.Instituicao).filter(models.Instituicao.ID == db_curso.ID_instituicao).first()
        
    # Construção do dicionário com EXATAMENTE 10 features (limpeza crítica)
    dados_para_ia = {
        "IDADE": db_candidato.idade,
        "SEXO_BENEFICIARIO_BOLSA": db_candidato.sexo,
        "STATUS_DEFICIENCIA_TEXT": db_candidato.status_deficiencia_text,
        "RACA_BENEFICIARIO_BOLSA": db_candidato.raca_beneficiario_bolsa,
        "REGIAO_BENEFICIARIO_BOLSA": db_candidato.regiao_beneficiario_bolsa,
        "MODALIDADE_CONCORRENCIA": db_inscricao.modalidade,
        "MODALIDADE_ENSINO_BOLSA": db_instituicao.modalidade,
        "NOME_IES_BOLSA": db_instituicao.nome,
        "NOME_CURSO_BOLSA": db_curso.nome_curso,
        "NOME_TURNO_CURSO_BOLSA": db_curso.turno,
    }
    
    # Obtém a string de predição (ex: "Bolsa Parcial")
    resultado_bolsa_str = _get_ai_prediction(dados_para_ia) 
    
    # CRÍTICO: Retorna um objeto/dicionário que corresponde ao seu schema ResultadoSimulacao
    return {
        "classificacao_bolsa": resultado_bolsa_str,
        "mensagem": f"A IA previu que o candidato tem mais chances de obter {resultado_bolsa_str} no curso de {db_curso.nome_curso}.",
        "curso": db_curso.nome_curso 
    }

# --- Funções CRUD Genéricas (Permanecem Iguais) ---

def get_curso_by_name(db: Session, nome_curso: str) -> Optional[models.Curso]:
    """Busca um curso no banco de dados pelo nome."""
    return db.query(models.Curso).filter(
        func.lower(models.Curso.nome_curso) == func.lower(nome_curso)
    ).first()

def get_candidatos(db: Session, skip:int = 0, limit: int=100) -> List[models.Candidato]:
    """Retorna uma lista paginada de todos os candidatos."""
    return db.query(models.Candidato).offset(skip).limit(limit).all()

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
    """Cria uma instituição (ou a busca) e em seguida cria um curso relacionado."""
    
    db_instituicao = get_or_create_instituicao(db, instituicao_data)
    
    curso_dict = curso_data.model_dump()
    db_curso = models.Curso(**curso_dict, ID_instituicao=db_instituicao.ID)
    
    db.add(db_curso)
    db.commit()
    db.refresh(db_curso)
    return db_curso
    

def get_candidato_by_email(db:Session, email:str) -> Optional[models.Candidato]:
    return db.query(models.Candidato).filter(models.Candidato.email == email).first()

def authenticate_candidato(db:Session, email:str, senha:str) -> Optional[models.Candidato]:
    
    db_candidato = get_candidato_by_email(db, email)

    if not db_candidato:
        return None
    
    # Verifica a senha usando o utilitário de hash
    if not pass_utils.verify_password(senha, db_candidato.senha):
        return None
    
    return db_candidato

def get_or_create_instituicao(db: Session, instituicao_data: schemas.InstituicaoCreate) -> models.Instituicao:
    """Busca uma Instituição pela sigla ou a cria se não existir."""
    
    db_instituicao = db.query(models.Instituicao).filter(
        models.Instituicao.sigla == instituicao_data.sigla
    ).first()
    
    if not db_instituicao:
        instituicao_dict = instituicao_data.model_dump()
        db_instituicao = models.Instituicao(**instituicao_dict)
        db.add(db_instituicao)
        db.flush() 
    
    return db_instituicao

def get_or_create_curso(db: Session, curso_data: schemas.CursoDadosInteresse, instituicao_id: int) -> models.Curso:
    """Busca um Curso ou o cria. Não precisa mais de placeholders para notas/pesos."""
    
    db_curso = db.query(models.Curso).filter(
        models.Curso.nome_curso == curso_data.nome_curso,
        models.Curso.ID_instituicao == instituicao_id
    ).first()
    
    if not db_curso:
        curso_dict = curso_data.model_dump()
        curso_dict['ID_instituicao'] = instituicao_id
        
        db_curso = models.Curso(**curso_dict)
        
        db.add(db_curso)
        db.flush()
        
    return db_curso


def create_candidato(db: Session, candidato: schemas.CandidatoCreate) -> models.Candidato:
    
    db_candidato_existente = db.query(models.Candidato).filter(models.Candidato.email == candidato.email).first()
    if db_candidato_existente:
        raise Exception("Email já cadastrado.")

    
    sexo_text = candidato.sexo.lower() if candidato.sexo else ''
    sexo_binario_value = 1 if 'masculino' in sexo_text else 0 
    
    deficiencia_text = candidato.status_deficiencia_text.lower() if candidato.status_deficiencia_text else ''
    deficiencia_binaria_value = 1 if 'sim' in deficiencia_text else 0 

    
    candidato_dict = candidato.model_dump() 

    # Gera o hash da senha antes de salvar
    hashed_password = pass_utils.get_password_hash(candidato.senha)
    candidato_dict['senha'] = hashed_password
    
    candidato_dict['sexo_binario'] = sexo_binario_value
    candidato_dict['deficiencia_binaria'] = deficiencia_binaria_value
    
    
    db_candidato = models.Candidato(**candidato_dict)
    db.add(db_candidato)
    db.commit()
    db.refresh(db_candidato)
    
    return db_candidato
        
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

def update_curso(db: Session, curso_id: int, curso_data: schemas.CursoCreate) -> Optional[models.Curso]:
    """Atualiza um curso existente, usando o schema CursoCreate limpo."""
    db_curso = db.query(models.Curso).filter(models.Curso.ID == curso_id).first()
    
    if db_curso:
        # Pydantic model_dump agora contém apenas 'nome_curso', 'grau', 'turno'
        update_data = curso_data.model_dump(exclude_unset=True) 
        
        for key, value in update_data.items():
            setattr(db_curso, key, value)
            
        db.commit()
        db.refresh(db_curso)
        return db_curso
        
    return None

def delete_candidato(db: Session, candidato_id: int):
    db_candidato = get_candidato(db, candidato_id)
    if db_candidato:
        db.delete(db_candidato)
        db.commit()
        return {"detail": "Candidato deletado com sucesso"}
    return None

def delete_curso(db: Session, curso_id: int) -> Optional[dict]:
    """
    Deleta um curso pelo ID, retornando o resultado da operação.
    """
    inscricoes_vinculadas = db.query(models.Inscricao).filter(models.Inscricao.ID_curso == curso_id).all()
    
    if inscricoes_vinculadas:
        
        raise ValueError("Não é possível deletar o curso pois há inscrições de candidatos vinculadas a ele. Delete as inscrições primeiro.")

    db_curso = db.query(models.Curso).filter(models.Curso.ID == curso_id).first()
    
    if db_curso:
        db.delete(db_curso)
        db.commit()
        return {"detail": f"Curso com ID {curso_id} deletado com sucesso."}
        
    return None


def update_candidato_complementary_data(
    db: Session, 
    candidato_id: int, 
    dados_complementares: schemas.DadosComplementaresRequest # <--- Este nome é CRUCIAL
):
    """
    Busca/cria curso e instituição e cria o registro de Inscrição.
    """
    # 1. Tente encontrar o candidato
    db_candidato = db.query(models.Candidato).filter(models.Candidato.ID == candidato_id).first()
    if not db_candidato:
        raise ValueError(f"Candidato com ID {candidato_id} não encontrado.")

    # 2. Busca/Cria Instituição
    db_instituicao = get_or_create_instituicao(db, dados_complementares.instituicao)

    # 3. Busca/Cria Curso
    db_curso = get_or_create_curso(db, dados_complementares.curso, db_instituicao.ID)

    # 4. Cria Inscrição (Feature 5 da IA)
    inscricao_data = {
        "ano_sisu": 2024,
        "modalidade": dados_complementares.modalidade_concorrencia, # Feature 5
        "ID_Candidato": db_candidato.ID,
        "ID_curso": db_curso.ID,
    }
    db_inscricao = models.Inscricao(**inscricao_data)
    db.add(db_inscricao)

def create_candidatos_lote(db: Session, candidatos_lote: schemas.LoteCandidatos):
    """
    Insere múltiplos candidatos e TODAS as suas dependências em uma transação atômica.
    Removida a criação da Nota.
    """
    
    for candidato_data in candidatos_lote.candidatos:
        

        candidato_dict = candidato_data.model_dump(exclude={'instituicao', 'curso', 'modalidade_concorrencia'}) 
        
        
        
        db_candidato = models.Candidato(**candidato_dict)
        db.add(db_candidato) 
        db.flush() 

        db_instituicao = get_or_create_instituicao(db, candidato_data.instituicao)

        db_curso = get_or_create_curso(db, candidato_data.curso, db_instituicao.ID)


        inscricao_data = {
            "ano_sisu": 2024,
            "modalidade": candidato_data.modalidade_concorrencia, 
            "ID_Candidato": db_candidato.ID,
            "ID_curso": db_curso.ID,
        }
        db_inscricao = models.Inscricao(**inscricao_data)
        db.add(db_inscricao)


    try:
        db.commit() 
        return {"status": "success", "message": f"{len(candidatos_lote.candidatos)} pacotes de dados inseridos com sucesso."}
    
    except Exception as e:
        db.rollback()
        raise Exception(f"Erro ao inserir dados em lote. A transação foi revertida (rollback). Detalhe: {e}")