from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import crud, schemas
from db.database import get_db

router = APIRouter(tags=["Autenticação"])
DbDependency = Depends(get_db)

@router.post("/login")
def login_for_access_token(
    form_data: schemas.LoginRequest, 
    db: Session = DbDependency
):
    """
    Autentica o candidato usando e-mail e senha.
    Retorna o objeto Candidato em caso de sucesso.
    """
    
    candidato = crud.authenticate_candidato(
        db, 
        email=form_data.email, 
        senha=form_data.senha
    )
    
    if not candidato:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais de acesso inválidas (e-mail ou senha incorretos)",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {
        "access_status": "success",
        "candidato": schemas.Candidato.model_validate(candidato)
    }