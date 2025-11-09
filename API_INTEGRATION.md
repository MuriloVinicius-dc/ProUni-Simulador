# Integração com API FastAPI

Este documento explica como conectar o frontend ProUni-Simulador com a API FastAPI desenvolvida pelo seu colega.

## 📁 Arquivos da API

A pasta `Banco + API` contém:
- **main.py** - Aplicação FastAPI principal
- **requirements.txt** - Dependências Python
- **db/** - Modelos, schemas, CRUD e routers

## 🔧 Configuração

### 1. Instalar dependências da API

```bash
cd "Banco + API"
pip install -r requirements.txt
```

### 2. Iniciar o servidor FastAPI

```bash
# Na pasta "Banco + API"
uvicorn main:app --reload --port 8000
```

A API estará disponível em `http://localhost:8000`

Documentação interativa: `http://localhost:8000/docs`

### 3. Configurar o Frontend

Edite o arquivo `.env.local`:

```env
# URL da API FastAPI
VITE_API_URL=http://localhost:8000

# Ativar uso da API real (true) ou modo demo (false)
VITE_USE_REAL_API=true
```

### 4. Reiniciar o servidor de desenvolvimento

```bash
npm run dev
```

## 📡 Endpoints Disponíveis

### Autenticação

**POST** `/login`
```json
{
  "email": "usuario@email.com",
  "senha": "senha123"
}
```

**Resposta:**
```json
{
  "access_status": "success",
  "candidato": {
    "ID": 1,
    "nome": "João Silva",
    "email": "usuario@email.com",
    "idade": 20,
    "sexo": "M"
  }
}
```

### Candidatos

**POST** `/candidatos/` - Criar candidato
```json
{
  "nome": "Maria Santos",
  "email": "maria@email.com",
  "senha": "senha123",
  "idade": 22,
  "sexo": "F"
}
```

**GET** `/candidatos/` - Listar todos os candidatos

**GET** `/candidatos/{id}` - Buscar candidato por ID

**PUT** `/candidatos/{id}` - Atualizar candidato

**DELETE** `/candidatos/{id}` - Deletar candidato

### Simulação

**GET** `/aprovados/{curso_id}` - Lista candidatos aprovados em um curso
```json
[
  {
    "ID": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "nota_final": 750.5,
    "nota_de_corte": 700.0
  }
]
```

**POST** `/candidatos/lote/` - Criar simulação completa
```json
{
  "candidatos": [
    {
      "nome": "Teste User",
      "email": "teste@email.com",
      "senha": "senha123",
      "idade": 20,
      "sexo": "M",
      "nota": {
        "nota_ct": 700,
        "nota_ch": 680,
        "nota_lc": 720,
        "nota_mt": 690,
        "nota_redacao": 800
      },
      "instituicao": {
        "nome": "Universidade Federal",
        "sigla": "UFXX",
        "localizacao_campus": "São Paulo"
      },
      "curso": {
        "nome_curso": "Engenharia de Software",
        "grau": "Bacharelado",
        "modalidade": "Ampla Concorrência",
        "nota_maxima": 900,
        "nota_minima": 650
      },
      "inscricao": {
        "ano_sisu": 2024,
        "modalidade": "Ampla Concorrência"
      }
    }
  ]
}
```

## 🏗️ Arquitetura da Integração

```
Frontend (React + Vite)
    ↓
src/lib/api.js (Cliente HTTP)
    ↓
src/services/
  ├── authService.js (Login/Cadastro)
  └── simulacaoService.js (Simulações/Aprovados)
    ↓
API FastAPI (http://localhost:8000)
    ↓
SQLite Database (database.db)
```

## 📝 Modelos de Dados

### Candidato
- ID (Integer, PK)
- nome (Text)
- email (Text, único)
- senha (Text, hash)
- idade (Integer)
- sexo (Text)

### Nota
- ID_Nota (Integer, PK)
- ID_Candidato (FK)
- nota_ct, nota_ch, nota_lc, nota_mt, nota_redacao (Float)

### Instituição
- ID (Integer, PK)
- nome (Text)
- sigla (Text, único)
- localizacao_campus (Text)

### Curso
- ID (Integer, PK)
- ID_instituicao (FK)
- nome_curso (Text)
- grau (Text)
- modalidade (Text)
- nota_maxima, nota_minima (Float)

### Inscrição
- ID_inscricao (Integer, PK)
- ano_sisu (Integer)
- modalidade (Text)
- ID_Candidato, ID_curso, ID_nota (FKs)

## 🔄 Modo Híbrido

O projeto suporta dois modos:

### Modo Demo (VITE_USE_REAL_API=false)
- Usa Supabase para autenticação
- Dados salvos no localStorage
- Ideal para desenvolvimento sem backend

### Modo Produção (VITE_USE_REAL_API=true)
- Usa API FastAPI real
- Dados persistidos no SQLite
- Requer servidor FastAPI rodando

## 🧪 Testando a Integração

1. Inicie a API FastAPI
2. Configure `VITE_USE_REAL_API=true` no `.env.local`
3. Reinicie o servidor dev do frontend
4. Acesse `http://localhost:5173/#/Cadastro`
5. Crie uma conta
6. Faça login em `http://localhost:5173/#/Login`
7. Veja os dados persistidos no banco SQLite

## 📚 Serviços Criados

### `src/lib/api.js`
Cliente HTTP genérico com métodos GET, POST, PUT, DELETE.

### `src/services/authService.js`
- `login(email, senha)` - Autenticação
- `cadastrar(candidatoData)` - Criar candidato
- `getCandidato(id)` - Buscar candidato
- `atualizarCandidato(id, data)` - Atualizar
- `deletarCandidato(id)` - Deletar

### `src/services/simulacaoService.js`
- `getAprovados(cursoId)` - Listar aprovados
- `criarSimulacaoCompleta(data)` - Criar simulação
- `listarCandidatos(skip, limit)` - Listar todos

## 🚀 Próximos Passos

1. **Migrar página de simulação** para usar `simulacaoService`
2. **Adicionar validações** nos formulários
3. **Implementar feedback visual** de erros da API
4. **Criar dashboard** com estatísticas dos candidatos
5. **Deploy** da API em produção (Heroku, Railway, etc.)

## 🐛 Troubleshooting

### Erro de CORS
Certifique-se que a API FastAPI tem CORS configurado:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### API não conecta
- Verifique se `uvicorn` está rodando na porta 8000
- Confirme a URL em `.env.local`: `VITE_API_URL=http://localhost:8000`
- Reinicie o servidor dev após mudar `.env.local`

### Dados não aparecem
- Verifique se `VITE_USE_REAL_API=true`
- Abra o console do navegador (F12) para ver erros
- Teste os endpoints em `http://localhost:8000/docs`
