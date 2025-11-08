from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from db import crud, models, schemas
from db.database import get_db

router = APIRouter(tags=["Candidatos e Simulação"])
DbDependency = Depends(get_db)

@router.get(
    "/aprovados/{curso_id}",
    response_model=List[schemas.AprovadoResponse],
    status_code=status.HTTP_200_OK,
    summary="Lista candidatos aprovados por curso"
)
def get_aprovados_endpoint(
    curso_id: int,
    db: Session = DbDependency
):
    # 1. Verifica se o curso existe
    if not db.query(models.Curso).filter(models.Curso.ID == curso_id).first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Curso com ID {curso_id} não encontrado." # <--- CORREÇÃO: Detail Adicionado
        )
    
    # 2. Busca a lista (se o curso existe, retorna lista vazia ou preenchida)
    lista_aprovados = crud.get_aprovados_by_curso(db=db, curso_id=curso_id)

    return lista_aprovados

@router.post("/candidatos/", response_model=schemas.Candidato, status_code=status.HTTP_201_CREATED)
def create_candidato_endpoint(candidato: schemas.CandidatoCreate, db: Session = DbDependency):
    """Cria um novo candidato (sem as dependências aninhadas, apenas Candidato/Auth)."""
    try:
        return crud.create_candidato(db=db, candidato=candidato)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/candidatos/", response_model=List[schemas.Candidato])
def read_candidatos_endpoint(skip: int = 0, limit: int = 100, db: Session = DbDependency):
    """Lista todos os candidatos."""
    candidatos = crud.get_candidatos(db, skip=skip, limit=limit)
    return candidatos

@router.get("/candidatos/{candidato_id}", response_model=schemas.Candidato)
def read_candidato_endpoint(candidato_id: int, db: Session = DbDependency):
    """Retorna um candidato específico pelo ID."""
    db_candidato = crud.get_candidato(db, candidato_id=candidato_id)
    if db_candidato is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidato não encontrado")
    return db_candidato

@router.put("/candidatos/{candidato_id}", response_model=schemas.Candidato)
def update_candidato_endpoint(candidato_id: int, candidato_data: schemas.CandidatoBase, db: Session = DbDependency):
    """Atualiza um candidato existente pelo ID."""
    updated_candidato = crud.update_candidato(db, candidato_id, candidato_data)
    if updated_candidato is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidato não encontrado para atualização")
    return updated_candidato

@router.delete("/candidatos/{candidato_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_candidato_endpoint(candidato_id: int, db: Session = DbDependency):
    """Deleta um candidato pelo ID."""
    result = crud.delete_candidato(db, candidato_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidato não encontrado para deleção")
    return

@router.post("/candidatos/lote/", status_code=status.HTTP_201_CREATED)
def create_candidatos_lote_endpoint(lote: schemas.LoteCandidatos, db: Session = DbDependency):
    """
    Insere uma lista de múltiplos candidatos e todas as suas dependências em uma única transação.
    """
    try:
        return crud.create_candidatos_lote(db=db, candidatos_lote=lote)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
