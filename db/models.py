from sqlalchemy import Column, Integer, Text, ForeignKey, REAL
from sqlalchemy.orm import relationship

from .database import Base

class Instituicao(Base):
    __tablename__ = "instituicao"
    ID = Column(Integer, primary_key=True, index=True)
    nome = Column(Text, nullable=False)
    sigla = Column(Text, unique=True, nullable=False)
    localizacao_campus= Column(Text)

    cursos = relationship("Curso", back_populates="instituicao")

class Candidato(Base):
    __tablename__ = "candidato"
    ID = Column(Integer, primary_key=True, index=True)
    nome = Column(Text, nullable=False)
    email = Column(Text, unique=True, nullable=False, index=True) 
    senha = Column(Text, nullable=False) 
    idade = Column(Integer)
    sexo = Column(Text)
    raca = Column(Text)

    nota = relationship("Nota", back_populates="candidato", uselist=False)

class Nota(Base):
    __tablename__ = "nota"
    ID_Nota = Column(Integer, primary_key=True, index=True) 
    ID_Candidato = Column(Integer, ForeignKey("candidato.ID"), unique=True, nullable=False) 
    nota_ct = Column(REAL, nullable=False)
    nota_ch = Column(REAL, nullable=False)
    nota_lc = Column(REAL, nullable=False)  
    nota_mt = Column(REAL, nullable=False) 
    nota_redacao = Column(REAL, nullable=False)
    modalidade = Column(Text, nullable=False)

    candidato = relationship("Candidato", back_populates="nota", uselist=False)
    inscricoes = relationship("Inscricao", back_populates="nota")

class Curso(Base):
    __tablename__ = "curso"
    ID = Column(Integer, primary_key=True, index=True)
    ID_instituicao = Column(Integer, ForeignKey("instituicao.ID"), nullable=False)
    nome_curso = Column(Text, nullable=False)
    grau = Column(Text)
    modalidade = Column(Text)
    nota_maxima = Column(REAL, nullable=False)
    nota_minima = Column(REAL, nullable=False)
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
    ID_nota = Column(Integer, ForeignKey("nota.ID_Nota"), nullable=False) 

    candidato = relationship("Candidato", back_populates="inscricoes")
    curso = relationship("Curso", back_populates="inscricoes")
    nota = relationship("Nota", back_populates="inscricoes")