from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import crud, models, schemas
from db.database import get_db

DbDependency = Depends(get_db)

class NotAuthenticatedException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="É necessário estar logado para acessar este recurso.",
            headers={"WWW-Authenticate": "Bearer"},
        )

class AuthPayload(schemas.LoginRequest):
    # Apenas um alias para deixar claro que é o payload de auth
    pass

def get_current_active_candidato(
    auth_data: AuthPayload, 
    db: Session = DbDependency
) -> models.Candidato:
    """
    Função de dependência que verifica o usuário autenticado.
    """
    
    candidato = crud.authenticate_candidato(db, email=auth_data.email, senha=auth_data.senha)
    
    if not candidato:
        raise NotAuthenticatedException()
        
    return candidato

CandidatoDependency = Depends(get_current_active_candidato)