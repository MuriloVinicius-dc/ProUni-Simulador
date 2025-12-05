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

    
class CandidatoBase(BaseModel):
    """Campos base do Candidato, agora aceitando input textual para codificação."""
    nome: str = Field(..., max_length=100)
    email: EmailStr 
    idade: Optional[int] = Field(None, ge=15, le=100)
    
    sexo: Optional[str] = Field(None, max_length=9) # Ex: "Masculino", "Feminino"
    
    status_deficiencia_text: Optional[str] = Field("Não", description="Status de Deficiência: 'Sim' ou 'Não'")
    
    raca_beneficiario_bolsa: Optional[str] = Field(None, max_length=50) 
    regiao_beneficiario_bolsa: Optional[str] = Field(None, max_length=50)


class CandidatoCreate(CandidatoBase):
    """Schema para o POST/criação, inclui a senha."""
    senha: str = Field(..., min_length=6) 

class CandidatoCompleto(CandidatoCreate):
    """Estrutura de dados completa para inserção em lote. NÃO INCLUI MAIS NOTA."""
    modalidade_concorrencia: str = Field(..., description="Modalidade (Ampla Concorrência, Cotas, etc.) - FEATURE DA IA")
    
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
    """
    Schema usado no POST /formulario/{candidato_id}.
    Contém as features de curso/inscrição necessárias para a IA.
    """
    modalidade_concorrencia: str = Field(..., description="Modalidade (Ampla Concorrência, Cotas, etc.) - FEATURE DA IA")
    
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
    classificacao_bolsa: str = Field(..., description="Resultado da classificação da IA: 'Bolsa Parcial' ou 'Bolsa Integral'.")
    mensagem: str
    curso: str
    
    class Config:
        from_attributes = True

class AprovadoResponse(BaseModel):
    ID: int
    nome: str
    email: str
    classificacao_bolsa: str = Field(..., description="Resultado da Classificação de Bolsa")
    
    class Config:
        from_attributes = True