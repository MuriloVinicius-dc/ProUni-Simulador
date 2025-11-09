#!/bin/bash
# Script para iniciar a API FastAPI no Linux/Mac

echo "🚀 Iniciando API FastAPI..."

# Verifica se está na pasta correta
if [ ! -d "Banco + API" ]; then
    echo "❌ Pasta 'Banco + API' não encontrada!"
    echo "Execute este script na raiz do projeto ProUni_Front"
    exit 1
fi

# Entra na pasta da API
cd "Banco + API"

# Verifica se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 não encontrado! Instale Python 3.8+"
    exit 1
fi

echo "✓ Python encontrado: $(python3 --version)"

# Cria ambiente virtual se não existir
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual..."
    python3 -m venv venv
fi

# Ativa ambiente virtual
echo "Ativando ambiente virtual..."
source venv/bin/activate

# Instala dependências
echo "📦 Instalando dependências..."
pip install -r requirements.txt --quiet

# Inicia o servidor
echo ""
echo "🎯 Iniciando servidor na porta 8000..."
echo "📖 Documentação: http://localhost:8000/docs"
echo "💡 Pressione Ctrl+C para parar o servidor"
echo ""

uvicorn main:app --reload --port 8000
