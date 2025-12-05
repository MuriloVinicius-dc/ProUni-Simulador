from sqlalchemy import Column, Integer, Text, ForeignKey, REAL, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base

class Instituicao(Base):
    __tablename__ = "instituicao"
    ID = Column(Integer, primary_key=True, index=True)
    nome = Column(Text, nullable=False)
    sigla = Column(Text, unique=True, nullable=False)
    localizacao_campus= Column(Text)
    modalidade = Column(Text) 

    cursos = relationship("Curso", back_populates="instituicao")

class Candidato(Base):
    __tablename__ = "candidato"
    ID = Column(Integer, primary_key=True, index=True)
    nome = Column(Text, nullable=False)
    email = Column(Text, unique=True, nullable=False, index=True) 
    senha = Column(Text, nullable=False) 
    idade = Column(Integer)
    sexo = Column(Text) 

    status_deficiencia_text = Column(Text, default="Não")
    raca_beneficiario_bolsa = Column(Text) 
    regiao_beneficiario_bolsa = Column(Text)
    sexo_binario = Column(Integer, default=0) 
    deficiencia_binaria = Column(Integer, default=0) 

    inscricoes = relationship("Inscricao", back_populates="candidato") 


class Curso(Base):
    __tablename__ = "curso"
    ID = Column(Integer, primary_key=True, index=True)
    ID_instituicao = Column(Integer, ForeignKey("instituicao.ID"), nullable=False)
    nome_curso = Column(Text, nullable=False)
    grau = Column(Text)
    turno = Column(Text) 
    
    instituicao = relationship("Instituicao", back_populates="cursos")
    inscricoes = relationship("Inscricao", back_populates="curso")

class Inscricao(Base):
    __tablename__ = "inscricao"
    ID_inscricao = Column(Integer, primary_key=True, index=True)
    ano_sisu = Column(Integer, nullable=False)
    modalidade = Column(Text, nullable=False) 
    ID_Candidato = Column(Integer, ForeignKey("candidato.ID"), nullable=False)
    ID_curso = Column(Integer, ForeignKey("curso.ID"), nullable=False)
    
    candidato = relationship("Candidato", back_populates="inscricoes")
    curso = relationship("Curso", back_populates="inscricoes")


class Simulacao(Base):
    """Tabela para armazenar histórico de simulações realizadas"""
    __tablename__ = "simulacao"
    
    ID = Column(Integer, primary_key=True, index=True)
    data_simulacao = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Dados do candidato (10 features)
    idade = Column(Integer, nullable=False)
    sexo = Column(Text, nullable=False)
    raca_beneficiario = Column(Text, nullable=False)
    pcd = Column(Boolean, nullable=False)
    regiao_beneficiario = Column(Text, nullable=False)
    
    # Dados do curso
    modalidade_ensino = Column(Text, nullable=False)
    nome_turno = Column(Text, nullable=False)
    modalidade_concorrencia = Column(Text, nullable=False)
    nome_curso = Column(Text, nullable=False)
    nome_instituicao = Column(Text, nullable=False)
    
    # Resultado da IA
    classificacao = Column(Text, nullable=False)  # "Bolsa Integral" ou "Bolsa Parcial"