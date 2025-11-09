from sqlalchemy.orm import Session
from db import models, schemas
from typing import List, Optional, Any
from sqlalchemy import func, case 


def get_curso_by_name(db: Session, nome_curso: str) -> Optional[models.Curso]:
    """Busca um curso no banco de dados pelo nome."""
    return db.query(models.Curso).filter(
        func.lower(models.Curso.nome_curso) == func.lower(nome_curso)
    ).first()

def calcular_aprovacao(db:Session, candidato_id: int, curso_id: int):
    """
    Calcula se a nota média do candidato é suficiente para a nota mínima do curso,
    realizando o cálculo da média diretamente no banco de dados.
    """
    
    subquery_nota_candidato = db.query(
        models.Nota,
        ((models.Nota.nota_ct + models.Nota.nota_ch + models.Nota.nota_lc + models.Nota.nota_mt + models.Nota.nota_redacao) / 5.0).label('nota_candidato_media')
    ).filter(models.Nota.ID_Candidato == candidato_id).subquery()
    
    
    resultado_query = db.query(
        subquery_nota_candidato.c.nota_candidato_media,
        models.Curso.nome_curso,
        models.Curso.nota_minima
    ).join(
        models.Curso,
        models.Curso.ID == curso_id
    ).first()

    if not resultado_query:
        db_curso = db.query(models.Curso).filter(models.Curso.ID == curso_id).first()
        if not db_curso:
            return {"aprovado": False, "mensagem": "Curso de interesse não encontrado."}
        else:
            return {"aprovado": False, "mensagem": "Nota do candidato não encontrada para este curso."}
        
    
    nota_candidato = resultado_query.nota_candidato_media
    nota_minima_corte = resultado_query.nota_minima
    curso_nome = resultado_query.nome_curso

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
        resultado["mensagem"] = f"Parabéns! Sua nota ({resultado['nota_candidato']}) é suficiente para o curso de {resultado['curso']}."
    else:
        resultado["mensagem"] = f"Sua nota ({resultado['nota_candidato']}) está abaixo da nota de corte ({resultado['nota_minima_corte']}) por {abs(resultado['diferenca'])} pontos."

    return resultado

def get_aprovados_by_curso(db: Session, curso_id: int) -> List[schemas.AprovadoResponse]:
    
    # 1. Obter o curso e sua nota de corte
    db_curso = db.query(models.Curso).filter(models.Curso.ID == curso_id).first()
    if not db_curso:
        # Se o curso não existe, a rota vai lançar 404. Retorna lista vazia aqui.
        return []

    nota_minima_corte = db_curso.nota_minima
    
    # 2. Obter as inscrições para o curso específico
    # Percorrendo as Inscrições é mais simples do que fazer um join complexo
    inscricoes = db.query(models.Inscricao).filter(models.Inscricao.ID_curso == curso_id).all()
    
    aprovados = []
    
    for inscricao in inscricoes:
        # Pelo relacionamento, podemos acessar o candidato e a nota
        db_nota = inscricao.nota
        db_candidato = inscricao.candidato

        if db_nota:
            # Calcular a nota final do candidato (média simples)
            notas = [
                db_nota.nota_ct,
                db_nota.nota_ch,
                db_nota.nota_lc,
                db_nota.nota_mt,
                db_nota.nota_redacao
            ]
            nota_candidato = sum(notas) / len(notas)
            
            # 3. Verificar aprovação
            if nota_candidato >= nota_minima_corte:
                # Cria um dicionário para ser validado pelo Pydantic no retorno
                aprovados.append({
                    "ID": db_candidato.ID,
                    "nome": db_candidato.nome,
                    "email": db_candidato.email,
                    "nota_final": round(nota_candidato, 2),
                    "nota_de_corte": round(nota_minima_corte, 2)
                })

    return aprovados

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
    """Busca uma Instituição existente pela sigla ou a cria se não existir."""
    
    db_instituicao = db.query(models.Instituicao).filter(
        (models.Instituicao.sigla == instituicao_data.sigla)
    ).first()
    
    if db_instituicao:
        return db_instituicao
    
    db_instituicao = models.Instituicao(**instituicao_data.model_dump())
    db.add(db_instituicao)
    db.flush() 
    return db_instituicao


def get_or_create_curso(db: Session, curso: schemas.CursoCreate, instituicao_id: int) -> models.Curso:
    db_curso = db.query(models.Curso).filter(
        models.Curso.nome_curso == curso.nome_curso,
        models.Curso.ID_instituicao == instituicao_id,
        models.Curso.grau == curso.grau,
        models.Curso.modalidade == curso.modalidade,
        models.Curso.turno == curso.turno 
    ).first()

    if db_curso:
        return db_curso

    curso_dict = curso.model_dump()
    db_curso = models.Curso(
        **curso_dict,
        ID_instituicao=instituicao_id
    )
    db.add(db_curso)
    db.flush()
    db.refresh(db_curso)
    return db_curso


def create_candidato(db:Session, candidato:schemas.CandidatoCreate):
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


def create_candidatos_lote(db: Session, candidatos_lote: schemas.LoteCandidatos):
    """
    Insere múltiplos candidatos e TODAS as suas dependências em uma transação atômica.
    Removida a lógica de Inscrição.
    """
    
    for candidato_data in candidatos_lote.candidatos:
        
        # O dict do candidato agora inclui 'raca' e exclui as dependências
        candidato_dict = candidato_data.model_dump(exclude={'nota', 'instituicao', 'curso'}) 
        db_candidato = models.Candidato(**candidato_dict)
        db.add(db_candidato) 
        db.flush() 

        db_instituicao = get_or_create_instituicao(db, candidato_data.instituicao)

        # O curso_data agora inclui 'turno'
        db_curso = get_or_create_curso(db, candidato_data.curso, db_instituicao.ID)

        # O dict da nota agora inclui 'modalidade'
        nota_dict = candidato_data.nota.model_dump()
        db_nota = models.Nota(**nota_dict, ID_Candidato=db_candidato.ID)
        db.add(db_nota)
        db.flush()

        # REMOVIDA A CRIAÇÃO DE INSCRICAO

    try:
        db.commit() 
        return {"status": "success", "message": f"{len(candidatos_lote.candidatos)} pacotes de dados inseridos com sucesso."}
    
    except Exception as e:
        db.rollback()
        raise Exception(f"Erro ao inserir dados em lote. A transação foi revertida (rollback). Detalhe: {e}")