from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 

from db import models
from db.database import engine
from db.auth.router import router as auth_router 
from db.routers.candidato_router import router as candidato_router 

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Simulador SISU API - Refatorado")

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)


app.include_router(auth_router)

app.include_router(candidato_router)