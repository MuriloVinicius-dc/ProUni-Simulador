# Script para iniciar a API FastAPI
# Execute este script na raiz do projeto

Write-Host "Iniciando API FastAPI..." -ForegroundColor Green

# Verifica se está na pasta correta
if (!(Test-Path "Banco + API")) {
    Write-Host "ERRO: Pasta 'Banco + API' não encontrada!" -ForegroundColor Red
    Write-Host "Execute este script na raiz do projeto ProUni_Front" -ForegroundColor Yellow
    exit 1
}

# Entra na pasta da API
Set-Location "Banco + API"

# Verifica se Python está instalado
try {
    $pythonVersion = python --version
    Write-Host "Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Python não encontrado! Instale Python 3.8+" -ForegroundColor Red
    exit 1
}

# Verifica/Instala dependências
Write-Host "`nVerificando dependências..." -ForegroundColor Cyan
if (!(Test-Path "venv")) {
    Write-Host "Criando ambiente virtual..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host "Ativando ambiente virtual..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

Write-Host "Instalando dependências..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet

# Inicia o servidor
Write-Host "`nIniciando servidor na porta 8000..." -ForegroundColor Green
Write-Host "Documentação: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Pressione Ctrl+C para parar o servidor`n" -ForegroundColor Yellow

uvicorn main:app --reload --port 8000
