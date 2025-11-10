# 🔗 Guia de Integração Frontend ↔️ Backend

Este documento explica como o frontend ProUni-Simulador se conecta ao backend FastAPI desenvolvido pelo seu amigo.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configuração](#configuração)
3. [Fluxo de Autenticação](#fluxo-de-autenticação)
4. [Fluxo de Simulação](#fluxo-de-simulação)
5. [Estrutura de Dados](#estrutura-de-dados)
6. [Testes](#testes)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O sistema suporta **dois modos de operação**:

### Modo 1: FastAPI (Backend Python)
- ✅ Cálculos de simulação no backend
- ✅ Persistência em banco de dados SQL
- ✅ API RESTful completa
- ✅ Autenticação via API

### Modo 2: Supabase/Demo
- ✅ Cálculos no frontend
- ✅ Persistência no Supabase ou localStorage
- ✅ Ideal para desenvolvimento sem backend

---

## ⚙️ Configuração

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

### 2. Habilitar Modo API

Edite o arquivo `.env`:

```env
VITE_USE_REAL_API=true
VITE_API_URL=http://localhost:8000
```

### 3. Iniciar o Backend

**Windows (PowerShell):**
```powershell
./start-api.ps1
```

**Linux/Mac:**
```bash
./start-api.sh
```

O backend estará disponível em: `http://localhost:8000`

### 4. Iniciar o Frontend

```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

---

## 🔐 Fluxo de Autenticação

### Cadastro

**Frontend → Backend:**

```javascript
// src/contexts/AuthContext.jsx
const signUp = async (email, password, metadata) => {
  const candidatoData = {
    email,
    senha: password,
    nome: metadata.nome || email.split('@')[0],
    idade: metadata.idade,
    sexo: metadata.sexo,
  }
  const candidato = await authService.cadastrar(candidatoData)
  // candidato retornado com ID
}
```

**Rota da API:**
- `POST /cadastro`
- Body: `{ nome, email, senha, idade?, sexo? }`
- Response: `{ ID, nome, email, idade, sexo }`

### Login

**Frontend → Backend:**

```javascript
// src/contexts/AuthContext.jsx
const signIn = async (email, password) => {
  const response = await authService.login(email, password)
  // response.access_status === "success"
  // response.candidato contém os dados do usuário
}
```

**Rota da API:**
- `POST /login`
- Body: `{ email, senha }`
- Response: `{ access_status: "success", candidato: {...} }`

### Armazenamento do Usuário

Quando `VITE_USE_REAL_API=true`:
- Usuário é salvo em `localStorage` com `candidato_id`
- `AuthContext` mantém estado do usuário na sessão

---

## 🎓 Fluxo de Simulação

### Passo 1: Usuário Preenche o Formulário

O componente `FormularioSimulacao` coleta:

```javascript
{
  nota: {
    nota_ct: 750,
    nota_ch: 680,
    nota_lc: 720,
    nota_mt: 800,
    nota_redacao: 850,
    modalidade_concorrencia: "Ampla Concorrência"
  },
  instituicao: {
    nome: "Universidade Federal de Exemplo",
    sigla: "UFE",
    localizacao_campus: "Campus Central",
    modalidade: "Presencial"
  },
  curso: {
    nome_curso: "Engenharia de Software",
    grau: "Bacharelado",
    turno: "Noturno"
  }
}
```

### Passo 2: Envio ao Backend

**Frontend → Backend:**

```javascript
// src/pages/Simulacao/index.jsx
const processarSimulacaoComAPI = async (dados) => {
  // 1. Envia dados ao backend
  await simulacaoService.preencherFormulario(user.candidato_id, {
    nota: dados.nota,
    instituicao: dados.instituicao,
    curso: dados.curso
  });

  // 2. Busca resultado calculado
  const resultado = await simulacaoService.getResultado(user.candidato_id);
}
```

**Rotas da API:**

1. `POST /formulario/{candidato_id}`
   - Body: `{ nota, instituicao, curso }`
   - Response: `{ message: "Dados salvos", candidato_id }`

2. `GET /resultados/{candidato_id}`
   - Response:
   ```json
   {
     "aprovado": true,
     "mensagem": "Parabéns! Você foi aprovado.",
     "nota_candidato": 760.5,
     "nota_minima_corte": 650.0,
     "curso": "Engenharia de Software",
     "diferenca": 110.5
   }
   ```

### Passo 3: Exibição do Resultado

O componente `ResultadoSimulacao` recebe:

```javascript
{
  // Dados do curso
  nome_curso: "Engenharia de Software",
  grau: "Bacharelado",
  turno: "Noturno",
  
  // Dados da instituição
  instituicao: "UFE",
  instituicao_nome: "Universidade Federal de Exemplo",
  localizacao_campus: "Campus Central",
  
  // Dados da nota
  modalidade: "Ampla Concorrência",
  nota_lc: 720,
  nota_mt: 800,
  nota_ch: 680,
  nota_ct: 750,
  nota_redacao: 850,
  
  // Resultado do backend
  mediaEnem: 760.5,
  selecionado: true,
  nota_minima: 650.0,
  diferenca: 110.5,
  mensagem: "Parabéns! Você foi aprovado.",
  
  // Mock (frontend)
  posicao: 5,
  vagas: 10,
  ingresso: "1º Semestre",
  link_instituicao: "#"
}
```

---

## 📊 Estrutura de Dados

### Candidato (após login)

```javascript
{
  ID: 1,
  nome: "João Silva",
  email: "joao@email.com",
  idade: 25,
  sexo: "Masculino",
  // Campos adicionados pelo frontend:
  id: 1,              // alias de ID
  candidato_id: 1     // para uso nas APIs
}
```

### Dados da Simulação (enviados ao backend)

```javascript
{
  nota: {
    nota_ct: number,      // 0-1000
    nota_ch: number,      // 0-1000
    nota_lc: number,      // 0-1000
    nota_mt: number,      // 0-1000
    nota_redacao: number, // 0-1000
    modalidade_concorrencia: string
  },
  instituicao: {
    nome: string,
    sigla: string,
    localizacao_campus: string,
    modalidade: string
  },
  curso: {
    nome_curso: string,
    grau: string,
    turno: string
  }
}
```

### Resultado da Simulação (retornado pelo backend)

```javascript
{
  aprovado: boolean,
  mensagem: string,
  nota_candidato: float,        // Média ponderada calculada
  nota_minima_corte: float,     // Nota de corte do curso
  curso: string,
  diferenca: float              // Positivo: acima | Negativo: abaixo
}
```

---

## 🧪 Testes

### Testar Cadastro

1. Acesse `http://localhost:5173/#/Cadastro`
2. Preencha:
   - Nome: "Teste Usuario"
   - Email: "teste@email.com"
   - Senha: "senha123"
3. Clique em "Cadastrar"
4. Verifique no backend se o candidato foi criado

### Testar Login

1. Acesse `http://localhost:5173/#/Login`
2. Use credenciais cadastradas
3. Após login bem-sucedido, deve redirecionar para Dashboard

### Testar Simulação Completa

1. Faça login
2. Acesse "Nova Simulação"
3. Preencha todos os campos:
   - Notas ENEM (ex: 700 em cada área)
   - Instituição (ex: UFE)
   - Curso (ex: Engenharia de Software)
4. Clique em "Analisar Perfil"
5. Aguarde processamento (~3s)
6. Verifique resultado exibido

### Verificar Backend

Abra o terminal do backend e observe os logs:
```
INFO:     127.0.0.1:xxxxx - "POST /cadastro HTTP/1.1" 200 OK
INFO:     127.0.0.1:xxxxx - "POST /login HTTP/1.1" 200 OK
INFO:     127.0.0.1:xxxxx - "POST /formulario/1 HTTP/1.1" 200 OK
INFO:     127.0.0.1:xxxxx - "GET /resultados/1 HTTP/1.1" 200 OK
```

---

## 🔧 Troubleshooting

### Erro: "Erro na API: Failed to fetch"

**Causa:** Backend não está rodando ou URL incorreta

**Solução:**
1. Verifique se o backend está rodando: `http://localhost:8000/docs`
2. Confirme `VITE_API_URL=http://localhost:8000` no `.env`
3. Reinicie o frontend: `npm run dev`

### Erro: "Usuário não autenticado"

**Causa:** Candidato não está logado

**Solução:**
1. Faça login antes de acessar a simulação
2. Verifique se `localStorage` tem a chave `user`

### Resultado não aparece

**Causa:** Backend pode estar retornando formato diferente

**Solução:**
1. Abra DevTools → Network
2. Verifique resposta de `GET /resultados/{id}`
3. Compare com formato esperado (ver seção Estrutura de Dados)

### Backend retorna erro 500

**Causa:** Dados incompletos ou formato incorreto

**Solução:**
1. Verifique logs do backend
2. Confirme que todos os campos obrigatórios estão sendo enviados
3. Valide tipos de dados (strings vs números)

### CORS Error

**Causa:** Backend não está permitindo requisições do frontend

**Solução:**
Adicione no backend (se necessário):
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📁 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `src/pages/Simulacao/index.jsx` | Lógica de integração com API |
| `src/contexts/AuthContext.jsx` | Autenticação dual (API/Supabase) |
| `src/services/simulacaoService.js` | Chamadas à API de simulação |
| `src/services/authService.js` | Chamadas à API de autenticação |
| `src/lib/api.js` | Cliente HTTP genérico |
| `.env` | Configuração de variáveis de ambiente |

---

## 🚀 Próximos Passos

- [ ] Implementar listagem de cursos da API
- [ ] Adicionar histórico de simulações do candidato
- [ ] Implementar refresh token para sessões longas
- [ ] Adicionar loading states mais detalhados
- [ ] Criar testes automatizados E2E

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do backend
2. Abra DevTools → Console e Network
3. Consulte `ROTAS_API.md` para detalhes das rotas
4. Verifique se as versões de Node/Python estão corretas

---

**Desenvolvido com ❤️ para facilitar o acesso ao ProUni**
