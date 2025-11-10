# ProUni-Simulador — Frontend + API

Este repositório contém a interface do simulador ProUni construída com React + Vite + Tailwind + API FastAPI.

## 🎯 Objetivo

Publicar o site no GitHub Pages automaticamente ao enviar para a branch `main`. O projeto está configurado para gerar os arquivos estáticos em `docs/` (via `vite.config.js`).

## 🏗️ Arquitetura

- **Frontend**: React 18 + Vite + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Autenticação**: Sistema híbrido (Supabase ou API FastAPI)
- **Deploy**: GitHub Pages (frontend) + Railway/Heroku (API)

## ⚡ Início Rápido

### Desenvolvimento Local Completo

```powershell
# 1. Clone o repositório
git clone https://github.com/MuriloVinicius-dc/ProUni-Simulador.git
cd ProUni-Simulador

# 2. Instale as dependências do frontend
npm ci

# 3. Configure as variáveis de ambiente
Copy-Item .env.example .env.local
# Edite .env.local:
# VITE_USE_REAL_API=true
# VITE_API_URL=http://localhost:8000

# 4. Inicie o backend (em um terminal)
.\start-api.ps1

# 5. Inicie o frontend (em outro terminal)
npm run dev
```

Pronto! Acesse:
- Frontend: `http://localhost:5173`
- API Docs: `http://localhost:8000/docs`

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

**Opção 2: Manual (se o script não funcionar)**

```powershell
cd Backend
python -m uvicorn main:app --reload --port 8000
```

A API estará em: `http://localhost:8000`  
Documentação interativa: `http://localhost:8000/docs`

> **Nota:** Se você encontrar erros de módulo, certifique-se de que está executando o comando a partir da raiz do projeto (`ProUni_Front/`) e não de dentro da pasta `Backend/`.

## 📖 Documentação

### Guias Principais
- **[MAPA_CONEXOES.md](./MAPA_CONEXOES.md)** - 🗺️ Visão geral de todas as conexões Frontend ↔ Backend
- **[ROTAS_API.md](./ROTAS_API.md)** - 📚 Documentação completa de todas as rotas da API
- **[EXEMPLOS_INTEGRACAO.md](./EXEMPLOS_INTEGRACAO.md)** - 💡 Exemplos práticos de código para cada página
- **[DIAGRAMA_ARQUITETURA.md](./DIAGRAMA_ARQUITETURA.md)** - 🏗️ Diagramas e fluxos de dados

### Referências Técnicas
- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Guia de integração com a API
- **[AUTH_README.md](./AUTH_README.md)** - Sistema de autenticação
- **[PROJECT_STRUCTURE.md](./src/PROJECT_STRUCTURE.md)** - Estrutura do projeto
- **[CHECKLIST_IMPLEMENTACAO.md](./CHECKLIST_IMPLEMENTACAO.md)** - ✅ Checklist de tarefas

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
├── Backend/              # 🔧 Backend FastAPI (principal)
│   ├── main.py
│   └── db/
│       ├── models.py     # Modelos ORM
│       ├── schemas.py    # Schemas Pydantic
│       ├── crud.py       # Operações banco de dados
│       ├── auth/         # Autenticação
│       └── routers/      # Routers API
│
├── src/
│   ├── components/       # Componentes React
│   │   ├── auth/        # Autenticação
│   │   ├── simulacao/   # Fluxo de simulação
│   │   └── ui/          # Componentes UI (shadcn)
│   │
│   ├── pages/           # Páginas da aplicação
│   │   ├── Login/
│   │   ├── Cadastro/
│   │   ├── Dashboard/
│   │   └── Simulacao/
│   │
│   ├── services/        # 🆕 Serviços de API
│   │   ├── authService.js
│   │   ├── cursoService.js
│   │   └── simulacaoService.js
│   │
│   ├── hooks/           # 🆕 Hooks customizados
│   │   └── useSimulacao.js
│   │
│   ├── contexts/        # Context API
│   │   └── AuthContext.jsx
│   │
│   ├── lib/             # Bibliotecas e config
│   │   ├── api.js       # Cliente HTTP
│   │   ├── supabase.js  # Config Supabase
│   │   └── utils.jsx    # Utilitários
│   │
│   └── entities/        # Modelos de domínio
│       └── Simulacao.jsx
│
├── docs/                # Build para GitHub Pages
├── .env.local           # Configurações locais
└── start-api.ps1        # Script para iniciar API
```

## 🚀 Deploy

### Frontend (GitHub Pages)
Automático via GitHub Actions ao fazer push para `main`.

**Configuração manual (se necessário):**
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / Folder: `/docs`

### Backend (Produção)
Recomendações de plataformas:
- **Railway**: Deploy fácil com PostgreSQL grátis ([railway.app](https://railway.app))
- **Render**: Alternativa moderna ([render.com](https://render.com))
- **Heroku**: Opção tradicional ([heroku.com](https://heroku.com))
- **AWS EC2**: Controle total (requer mais configuração)

**Após deploy do backend:**
1. Atualize `VITE_API_URL` no `.env` com a URL de produção
2. Configure CORS no backend para aceitar o domínio do GitHub Pages
3. Rebuild e redeploy do frontend

## 🔌 API Endpoints

Todas as rotas estão documentadas em [ROTAS_API.md](./ROTAS_API.md). Principais endpoints:

### Autenticação
- `POST /cadastro` - Criar nova conta
- `POST /login` - Autenticar usuário

### Cursos
- `GET /cursos/` - Listar cursos disponíveis
- `GET /cursos/{id}` - Detalhes de um curso
- `POST /cursos/` - Cadastrar novo curso

### Simulação
- `POST /formulario/{candidato_id}` - Preencher dados da simulação
- `GET /resultados/{candidato_id}` - Obter resultado da aprovação

Documentação interativa: `http://localhost:8000/docs` (Swagger)

## 🎓 Fluxo do Usuário

1. **Cadastro** → Criar conta com nome, email e senha
2. **Login** → Autenticar no sistema
3. **Dashboard** → Visualizar perfil e histórico
4. **Simulação** → 
   - Preencher notas do ENEM
   - Selecionar curso e instituição
   - Ver resultado (aprovado/não aprovado)
5. **Nova Simulação** → Testar outros cursos

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

