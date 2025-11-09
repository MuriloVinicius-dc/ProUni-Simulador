from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List


class InstituicaoCreate(BaseModel):
    """Dados mínimos para buscar ou criar uma Instituição."""
    nome: str = Field(..., max_length=100)
    sigla: str = Field(..., max_length=10)
    localizacao_campus: Optional[str] = Field(None, max_length=100)
    modalidade: Optional[str] = Field(None, max_length=50) 

    class Config:
        from_attributes = True

class CursoCreate(BaseModel):
    """Dados completos para buscar ou criar um Curso (usado em Lote)."""
    nome_curso: str = Field(..., max_length=100)
    grau: Optional[str] = Field(None, max_length=20)
    turno: Optional[str] = Field(None, max_length=20)
    
    peso_ct: float = Field(1.0, ge=1.0)
    peso_ch: float = Field(1.0, ge=1.0)
    peso_lc: float = Field(1.0, ge=1.0)
    peso_mt: float = Field(1.0, ge=1.0)
    peso_redacao: float = Field(1.0, ge=1.0)

    nota_maxima:float = Field(..., ge=0,le=1000)
    nota_minima:float = Field(..., ge=0,le=1000)

    class Config:
        from_attributes = True

class CursoDadosInteresse(BaseModel): 
    """Schema simplificado para o preenchimento do Formulário (Página 3)."""
    nome_curso: str = Field(..., max_length=100)
    grau: Optional[str] = Field(None, max_length=20)
    turno: Optional[str] = Field(None, max_length=20)
    
    class Config:
        from_attributes = True


class CursoResponse(BaseModel):

    ID:int
    ID_instituicao:int
    nome_curso:str
    grau:Optional[str] = None
    turno: Optional[str] = None
    peso_ct: float
    peso_ch: float
    peso_lc: float
    peso_mt: float
    peso_redacao: float
    nota_maxima: float
    nota_minima:float

    class Config:
        from_attributes = True

class NotaCreate(BaseModel):
    """Dados obrigatórios de todas as notas do ENEM."""
    nota_ct: float = Field(..., ge=0, le=1000)
    nota_ch: float = Field(..., ge=0, le=1000)
    nota_lc: float = Field(..., ge=0, le=1000)
    nota_mt: float = Field(..., ge=0, le=1000)
    nota_redacao: float = Field(..., ge=0, le=1000)
    
    modalidade_concorrencia: str = Field(..., max_length=50) 
    
    class Config:
        from_attributes = True

class CandidatoBase(BaseModel):
    """Campos base do Candidato."""
    nome: str = Field(..., max_length=100)
    email: EmailStr 
    idade: Optional[int] = Field(None, ge=15, le=100)
    sexo: Optional[str] = Field(None, max_length=9)

class CandidatoCreate(CandidatoBase):
    """Schema para o POST/criação, inclui a senha."""
    senha: str = Field(..., min_length=6) 

class CandidatoCompleto(CandidatoCreate):
    """Estrutura de dados completa para inserção em lote."""
    nota: NotaCreate
    instituicao: InstituicaoCreate
    curso: CursoCreate
    
    class Config:
        from_attributes = True

class LoteCandidatos(BaseModel):
    """Schema para receber uma lista de candidatos para inserção em lote."""
    candidatos: List[CandidatoCompleto]

class Candidato(CandidatoBase):
    """Schema de resposta para o Candidato."""
    ID: int
    
    class Config:
        from_attributes = True
        

class LoginRequest(BaseModel):
    """Schema para a requisição de login."""
    email: EmailStr
    senha: str
    
class DadosComplementaresRequest(BaseModel):
    """Schema usado no POST /formulario/{candidato_id}"""
    nota: NotaCreate
    instituicao: InstituicaoCreate
    curso: CursoDadosInteresse 
    
    class Config:
        from_attributes = True

class CursoIndividualCreateRequest(BaseModel):
    """Schema para cadastro de cursos e seus respectivos pesos"""
    curso: CursoCreate
    instituicao: InstituicaoCreate

    class Config:
        from_attributes = True

class ResultadoSimulacao(BaseModel): 
    aprovado: bool
    mensagem: str
    nota_candidato: float
    nota_minima_corte: float
    curso: str
    diferenca: float

class AprovadoResponse(BaseModel):
    ID: int
    nome: str
    email: str
    nota_final: float
    nota_de_corte: float
    
    class Config:
        from_attributes = True