"""
Router para simulação direta (sem cadastro prévio)
Baseado no notebook ProUni - análise direta com 10 features
"""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import Literal
from sqlalchemy.orm import Session
from ..ml_model import classificar_bolsa
from ..database import get_db
from .. import models

router = APIRouter(tags=["Simulação Direta"])

class SimulacaoDiretaRequest(BaseModel):
    """Modelo para requisição de simulação direta (10 features essenciais)"""
    
    # Feature 1: Idade
    idade: int = Field(..., ge=14, le=100, description="Idade do candidato (14-100 anos)")
    
    # Feature 2: Modalidade de Concorrência
    modalidade_concorrencia: str = Field(..., description="Modalidade de concorrência ProUni")
    
    # Feature 3: PCD (Pessoa com Deficiência)
    pcd: bool = Field(..., description="Possui deficiência?")
    
    # Feature 4: Sexo
    sexo: Literal["Masculino", "Feminino"] = Field(..., description="Sexo do candidato")
    
    # Feature 5: Raça/Cor
    raca_beneficiario: Literal["Branca", "Preta", "Parda", "Amarela", "Indígena"] = Field(
        ..., description="Raça/cor do beneficiário"
    )
    
    # Feature 6: Região
    regiao_beneficiario: Literal["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"] = Field(
        ..., description="Região do beneficiário"
    )
    
    # Feature 7: Modalidade de Ensino
    modalidade_ensino: Literal["Presencial", "EAD"] = Field(
        ..., description="Modalidade de ensino"
    )
    
    # Feature 8: Turno
    nome_turno: str = Field(..., description="Nome do turno do curso")
    
    # Feature 9: Nome do Curso
    nome_curso: str = Field(..., description="Nome do curso pretendido")
    
    # Feature 10: Nome da Instituição
    nome_instituicao: str = Field(..., description="Nome da instituição de ensino")

    class Config:
        json_schema_extra = {
            "example": {
                "idade": 18,
                "modalidade_concorrencia": "Ampla concorrência",
                "pcd": False,
                "sexo": "Feminino",
                "raca_beneficiario": "Parda",
                "regiao_beneficiario": "Nordeste",
                "modalidade_ensino": "Presencial",
                "nome_turno": "Matutino",
                "nome_curso": "Engenharia Civil",
                "nome_instituicao": "Universidade Federal de Pernambuco"
            }
        }


class SimulacaoDiretaResponse(BaseModel):
    """Modelo para resposta da simulação"""
    classificacao: str = Field(..., description="Classificação da bolsa (Integral ou Parcial)")
    mensagem: str = Field(..., description="Mensagem explicativa do resultado")
    dados_entrada: dict = Field(..., description="Dados enviados para confirmação")


@router.post(
    "/simular-direto",
    response_model=SimulacaoDiretaResponse,
    status_code=status.HTTP_200_OK,
    summary="Simulação direta ProUni (sem cadastro)",
    description="Recebe os 10 dados essenciais e retorna a classificação de bolsa via modelo de IA"
)
def simular_bolsa_direta(dados: SimulacaoDiretaRequest, db: Session = Depends(get_db)):
    """
    Endpoint para simulação direta sem necessidade de cadastro.
    
    Recebe os 10 campos essenciais e retorna:
    - Classificação da bolsa (Integral ou Parcial)
    - Mensagem explicativa
    - Confirmação dos dados enviados
    
    **IMPORTANTE: Salva a simulação no banco de dados real (database_verdadeiro.db)**
    """
    try:
        # Converte o modelo Pydantic para dicionário
        dados_dict = {
            "IDADE": dados.idade,
            "SEXO_BENEFICIARIO_BOLSA": dados.sexo.upper()[0],  # M ou F
            "STATUS_DEFICIENCIA_TEXT": "Sim" if dados.pcd else "Não",
            "RACA_BENEFICIARIO_BOLSA": dados.raca_beneficiario,
            "REGIAO_BENEFICIARIO_BOLSA": dados.regiao_beneficiario,
            "MODALIDADE_ENSINO_BOLSA": dados.modalidade_ensino,
            "NOME_TURNO_CURSO_BOLSA": dados.nome_turno,
            "MODALIDADE_CONCORRENCIA": dados.modalidade_concorrencia,
            "NOME_IES_BOLSA": dados.nome_instituicao.upper(),
            "NOME_CURSO_BOLSA": dados.nome_curso,
        }
        
        # Chama o modelo de IA
        classificacao = classificar_bolsa(dados_dict)
        
        # Salva a simulação no banco de dados
        nova_simulacao = models.Simulacao(
            idade=dados.idade,
            sexo=dados.sexo,
            raca_beneficiario=dados.raca_beneficiario,
            pcd=dados.pcd,
            regiao_beneficiario=dados.regiao_beneficiario,
            modalidade_ensino=dados.modalidade_ensino,
            nome_turno=dados.nome_turno,
            modalidade_concorrencia=dados.modalidade_concorrencia,
            nome_curso=dados.nome_curso,
            nome_instituicao=dados.nome_instituicao,
            classificacao=classificacao
        )
        
        db.add(nova_simulacao)
        db.commit()
        db.refresh(nova_simulacao)
        
        # Monta a mensagem
        if classificacao == "Bolsa Integral":
            mensagem = (
                f"Parabéns! Com base no seu perfil, você tem grandes chances de conseguir uma "
                f"Bolsa Integral (100%) no curso de {dados.nome_curso} na {dados.nome_instituicao}."
            )
        else:
            mensagem = (
                f"Com base no seu perfil, você tem chances de conseguir uma Bolsa Parcial (50%) "
                f"no curso de {dados.nome_curso} na {dados.nome_instituicao}."
            )
        
        return SimulacaoDiretaResponse(
            classificacao=classificacao,
            mensagem=mensagem,
            dados_entrada=dados.dict()
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar simulação: {str(e)}"
        )
