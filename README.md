# ProUni-Simulador — Frontend + API

Este repositório contém a interface do simulador ProUni construída com React + Vite + Tailwind + API FastAPI.

## 🎯 Objetivo

Publicar o site no GitHub Pages automaticamente ao enviar para a branch `main`. O projeto está configurado para gerar os arquivos estáticos em `docs/` (via `vite.config.js`).

## 🏗️ Arquitetura

- **Frontend**: React 18 + Vite + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Autenticação**: Sistema híbrido (Supabase ou API FastAPI)
- **Deploy**: GitHub Pages (frontend) + Railway/Heroku (API)

## 🚀 Como funciona o deploy automático

- Um workflow GitHub Actions (`.github/workflows/deploy.yml`) roda em pushes para `main`.
- O workflow executa `npm ci`, `npm run build` e publica a pasta `docs/` usando `peaceiris/actions-gh-pages`.

Observação: o `base` em `vite.config.js` já está definido como `/ProUni-Simulador/`. Se o repositório tiver outro nome, atualize-o ou remova a opção `base`.

## 💻 Rodando localmente

### Frontend

1. Instale dependências:

```powershell
npm ci
```

2. Configure as variáveis de ambiente:

```powershell
# Copie o arquivo de exemplo
Copy-Item .env.example .env.local

# Edite .env.local conforme necessário
# VITE_USE_REAL_API=false (modo demo) ou true (usa API)
```

3. Rodar em modo de desenvolvimento:

```powershell
npm run dev
```

4. Build para produção (gera `docs/`):

```powershell
npm run build
```

5. Testar preview local (opcional):

```powershell
npm run preview
```

### Backend (API FastAPI)

**Opção 1: Script automático (Windows)**

```powershell
.\start-api.ps1
```

**Opção 2: Script automático (Linux/Mac)**

```bash
chmod +x start-api.sh
./start-api.sh
```

**Opção 3: Manual**

```powershell
cd "Banco + API"
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate    # Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

A API estará em: `http://localhost:8000`  
Documentação interativa: `http://localhost:8000/docs`

## 📖 Documentação

- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Guia completo de integração com a API
- **[AUTH_README.md](./AUTH_README.md)** - Sistema de autenticação
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Estrutura do projeto
- **[DARK_MODE_FIX.md](./DARK_MODE_FIX.md)** - Correção do modo dark

## 🔧 Configuração

### Variáveis de Ambiente (.env.local)

```env
# URL da API FastAPI
VITE_API_URL=http://localhost:8000

# Modo de operação
# false = Modo demo (localStorage + Supabase)
# true = Produção (API FastAPI real)
VITE_USE_REAL_API=false
```

## 🗂️ Estrutura do Projeto

```
ProUni_Front/
├── Banco + API/          # Backend FastAPI
│   ├── main.py
│   ├── requirements.txt
│   └── db/
│       ├── models.py
│       ├── schemas.py
│       ├── crud.py
│       └── routers/
├── src/
│   ├── components/       # Componentes React
│   ├── pages/           # Páginas da aplicação
│   ├── contexts/        # Context API (Auth)
│   ├── services/        # Serviços de API
│   ├── lib/             # Utilitários
│   └── entities/        # Modelos de dados
├── docs/                # Build para GitHub Pages
└── .env.local          # Configurações locais
```

## 🚀 Deploy

### Frontend (GitHub Pages)
Automático via GitHub Actions ao fazer push para `main`.

### Backend (Produção)
Recomendações:
- **Railway**: Deploy fácil com PostgreSQL grátis
- **Heroku**: Opção tradicional
- **Render**: Alternativa moderna
- **AWS EC2**: Controle total

## 🐛 Troubleshooting

### Frontend não conecta na API
1. Verifique se a API está rodando em `http://localhost:8000`
2. Confirme `VITE_USE_REAL_API=true` no `.env.local`
3. Reinicie o servidor dev (`npm run dev`)

### Erro de CORS
A API já está configurada com CORS aberto. Se persistir, verifique `main.py`.

### Dark mode bugado
Execute `npm run build` para recompilar os CSS Modules corrigidos.

## 📝 Publicar manualmente

Se preferir publicar manualmente sem Actions, gere o build (`npm run build`) e comite a pasta `docs/` na branch `main`. Depois, nas configurações do repositório no GitHub, vá em Settings → Pages e escolha a pasta `docs/` na branch `main` como fonte.

## ⚠️ Observações finais

- Certifique-se de que o repositório remoto no GitHub se chama `ProUni-Simulador` se mantiver o `base` configurado. Caso contrário, ajuste `base` no `vite.config.js` ou remova-o para deploy em raiz.
- A API usa SQLite por padrão. Para produção, considere PostgreSQL.
- Lembre-se de configurar as credenciais do Supabase se usar `VITE_USE_REAL_API=false`.

