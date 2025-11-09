from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List


class InstituicaoCreate(BaseModel):
    """Dados mínimos para buscar ou criar uma Instituição."""
    nome: str = Field(..., max_length=100)
    sigla: str = Field(..., max_length=10)
    localizacao_campus: Optional[str] = Field(None, max_length=100)
    
    class Config:
        from_attributes = True

class CursoCreate(BaseModel):
    """Dados mínimos para buscar ou criar um Curso."""
    nome_curso: str = Field(..., max_length=100)
    grau: Optional[str] = Field(None, max_length=20)
    modalidade: Optional[str] = Field(None, max_length=50)

    nota_maxima:float = Field(..., ge=0,le=1000)
    nota_minima:float = Field(..., ge=0,le=1000)

    class Config:
        from_attributes = True

class NotaCreate(BaseModel):
    """Dados obrigatórios de todas as notas do ENEM."""
    nota_ct: float = Field(..., ge=0, le=1000)
    nota_ch: float = Field(..., ge=0, le=1000)
    nota_lc: float = Field(..., ge=0, le=1000)
    nota_mt: float = Field(..., ge=0, le=1000)
    nota_redacao: float = Field(..., ge=0, le=1000)
    
    class Config:
        from_attributes = True

class InscricaoCreate(BaseModel):
    """Dados específicos da Inscrição (ocorrência do SISU)."""
    ano_sisu: int
    modalidade: str = Field(..., max_length=50) 
    
    class Config:
        from_attributes = True

class CandidatoBase(BaseModel):
    """Campos base do Candidato, incluindo dados de autenticação."""
    nome: str = Field(..., max_length=100)
    email: EmailStr # Validação de formato de e-mail
    idade: Optional[int] = Field(None, ge=15, le=100)
    sexo: Optional[str] = Field(None, max_length=1)

class CandidatoCreate(CandidatoBase):
    """Schema para o POST/criação, inclui a senha em texto simples."""
    senha: str = Field(..., min_length=6) 

class CandidatoCompleto(CandidatoCreate):
    """
    Representa a estrutura de dados completa, garantindo que o 
    candidato seja criado junto com todas as suas dependências.
    """
    nota: NotaCreate
    instituicao: InstituicaoCreate
    curso: CursoCreate
    inscricao: InscricaoCreate
    
    class Config:
        from_attributes = True

class AprovadoResponse(BaseModel):
    """Schema de resposta simplificado para a lista de aprovados."""
    ID: int
    nome: str = Field(..., max_length=100)
    email: EmailStr
    nota_final: float
    nota_de_corte: float

    class Config:
        from_attributes = True


class LoteCandidatos(BaseModel):
    """Schema para receber uma lista de candidatos para inserção em lote."""
    candidatos: List[CandidatoCompleto]

class Candidato(CandidatoBase):
    """Schema de resposta para o Candidato (exclui a senha_hash)."""
    ID: int
    
    class Config:
        from_attributes = True
        

class LoginRequest(BaseModel):
    """Schema para a requisição de login."""
    email: EmailStr
    senha: str



