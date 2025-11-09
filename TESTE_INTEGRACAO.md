# 🧪 Guia de Testes - Integração Frontend ↔️ Backend

Este guia contém os passos para testar a integração completa entre o frontend React e o backend FastAPI.

---

## ✅ Pré-requisitos

- [ ] Node.js instalado (v16+)
- [ ] Python instalado (v3.9+)
- [ ] Git Bash ou PowerShell (Windows)
- [ ] Portas 5173 (frontend) e 8000 (backend) disponíveis

---

## 🚀 Passo 1: Configurar Variáveis de Ambiente

### 1.1 Criar arquivo `.env`

Na raiz do projeto, crie o arquivo `.env`:

```bash
cp .env.example .env
```

### 1.2 Editar `.env`

```env
# Habilitar modo API
VITE_USE_REAL_API=true

# URL do backend (local)
VITE_API_URL=http://localhost:8000

# Deixar vazio para usar API ao invés de Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 🔧 Passo 2: Iniciar o Backend

### Windows (PowerShell)

```powershell
# Certifique-se de estar na raiz do projeto
cd C:\ProUni_Front

# Execute o script de inicialização
./start-api.ps1
```

### Linux/Mac

```bash
# Certifique-se de estar na raiz do projeto
cd /caminho/para/ProUni_Front

# Execute o script de inicialização
./start-api.sh
```

### Verificar se o backend está rodando

Abra o navegador e acesse:
```
http://localhost:8000/docs
```

Você deverá ver a documentação interativa do FastAPI (Swagger UI).

---

## 🎨 Passo 3: Iniciar o Frontend

### Em um novo terminal

```bash
# Instalar dependências (se necessário)
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em:
```
http://localhost:5173
```

---

## 🧪 Passo 4: Testar Fluxo Completo

### 4.1 Teste de Cadastro

1. Acesse: `http://localhost:5173/#/Cadastro`

2. Preencha o formulário:
   ```
   Nome: João da Silva
   Email: joao.teste@email.com
   Senha: senha123
   Confirmar Senha: senha123
   ```

3. Clique em **"Cadastrar"**

4. **Verificações:**
   - ✅ Mensagem de sucesso deve aparecer
   - ✅ Redirecionamento para tela de Login
   - ✅ No terminal do backend, deve aparecer:
     ```
     INFO: POST /cadastro HTTP/1.1 200 OK
     ```

### 4.2 Teste de Login

1. Acesse: `http://localhost:5173/#/Login`

2. Use as credenciais do cadastro:
   ```
   Email: joao.teste@email.com
   Senha: senha123
   ```

3. Clique em **"Entrar"**

4. **Verificações:**
   - ✅ Redirecionamento para Dashboard
   - ✅ Nome do usuário aparece no header
   - ✅ No terminal do backend:
     ```
     INFO: POST /login HTTP/1.1 200 OK
     ```

### 4.3 Teste de Simulação (PRINCIPAL)

1. **No Dashboard**, clique em **"Nova Simulação"**

2. **Preencha os dados das notas ENEM:**
   ```
   Linguagens e Códigos: 750
   Matemática: 800
   Ciências Humanas: 680
   Ciências da Natureza: 720
   Redação: 850
   Modalidade: Ampla Concorrência
   ```

3. **Selecione a Instituição:**
   ```
   Instituição: UFPE (ou qualquer outra)
   Campus: Campus Recife
   Modalidade: Presencial
   ```

4. **Preencha dados do Curso:**
   ```
   Curso: Ciência da Computação (ou qualquer outro)
   Grau: Bacharelado
   Turno: Noturno
   ```

5. Clique em **"Analisar Perfil"**

6. **Aguarde o processamento** (~3 segundos com animação)

7. **Verificações:**
   - ✅ Tela de processamento aparece
   - ✅ Resultado é exibido após 3 segundos
   - ✅ No terminal do backend, você deve ver:
     ```
     INFO: POST /formulario/1 HTTP/1.1 200 OK
     INFO: GET /resultados/1 HTTP/1.1 200 OK
     ```
   - ✅ Resultado mostra:
     - Aprovado/Não aprovado
     - Nota calculada
     - Nota de corte
     - Diferença
     - Mensagem

---

## 🔍 Passo 5: Verificar Logs

### Backend (Terminal Python)

Você deve ver algo como:

```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://localhost:8000
INFO:     127.0.0.1:xxxxx - "POST /cadastro HTTP/1.1" 200 OK
INFO:     127.0.0.1:xxxxx - "POST /login HTTP/1.1" 200 OK
INFO:     127.0.0.1:xxxxx - "POST /formulario/1 HTTP/1.1" 200 OK
INFO:     127.0.0.1:xxxxx - "GET /resultados/1 HTTP/1.1" 200 OK
```

### Frontend (Terminal Node/Vite)

Você deve ver:

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### DevTools (Navegador)

Pressione **F12** → aba **Network**:

1. **Após Cadastro:**
   - Requisição: `POST http://localhost:8000/cadastro`
   - Status: `200 OK`
   - Response: `{ "ID": 1, "nome": "João da Silva", ... }`

2. **Após Login:**
   - Requisição: `POST http://localhost:8000/login`
   - Status: `200 OK`
   - Response: `{ "access_status": "success", "candidato": {...} }`

3. **Após Preencher Formulário:**
   - Requisição: `POST http://localhost:8000/formulario/1`
   - Status: `200 OK`

4. **Buscar Resultado:**
   - Requisição: `GET http://localhost:8000/resultados/1`
   - Status: `200 OK`
   - Response:
     ```json
     {
       "aprovado": true,
       "mensagem": "Parabéns! Você foi aprovado.",
       "nota_candidato": 760.0,
       "nota_minima_corte": 650.0,
       "curso": "Ciência da Computação",
       "diferenca": 110.0
     }
     ```

---

## ❌ Troubleshooting

### Erro: "Failed to fetch"

**Problema:** Frontend não consegue se conectar ao backend

**Soluções:**
1. Verifique se o backend está rodando: `http://localhost:8000/docs`
2. Confirme `VITE_API_URL=http://localhost:8000` no `.env`
3. Reinicie o frontend: `Ctrl+C` → `npm run dev`

### Erro: CORS

**Problema:** Backend bloqueia requisições do frontend

**Solução:** Verifique se o `main.py` do backend tem:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Erro: "Usuário não autenticado"

**Problema:** Tentou fazer simulação sem login

**Solução:**
1. Faça logout
2. Faça login novamente
3. Verifique se `localStorage` tem a chave `user`

### Backend retorna 404

**Problema:** Rota não encontrada

**Solução:**
1. Verifique se a rota existe em `http://localhost:8000/docs`
2. Confira se o endpoint no frontend está correto
3. Exemplo: `/formulario/{candidato_id}` precisa do `{candidato_id}` substituído

### Backend retorna 500

**Problema:** Erro interno no servidor

**Solução:**
1. Verifique logs do terminal do backend
2. Confirme que o banco de dados está configurado
3. Verifique se todos os campos obrigatórios foram enviados

---

## 📊 Verificar Banco de Dados

### Acessar o SQLite (se estiver usando)

```bash
# No terminal, dentro da pasta Backend
sqlite3 database.db

# Verificar candidatos cadastrados
SELECT * FROM candidatos;

# Verificar notas enviadas
SELECT * FROM notas;

# Verificar cursos
SELECT * FROM cursos;

# Sair
.exit
```

---

## 🎯 Checklist Final

- [ ] Backend rodando em `http://localhost:8000`
- [ ] Frontend rodando em `http://localhost:5173`
- [ ] Arquivo `.env` configurado com `VITE_USE_REAL_API=true`
- [ ] Cadastro funciona e salva no banco
- [ ] Login funciona e retorna `access_status: "success"`
- [ ] Simulação envia dados ao backend via `POST /formulario/{id}`
- [ ] Resultado é buscado via `GET /resultados/{id}`
- [ ] Resultado exibe aprovação/reprovação corretamente
- [ ] Notas são calculadas corretamente pelo backend
- [ ] Não há erros no console do navegador
- [ ] Não há erros no terminal do backend

---

## 📞 Suporte

### Se algo não funcionar:

1. **Verifique os logs** (backend e DevTools)
2. **Consulte `INTEGRACAO_BACKEND.md`** para detalhes das rotas
3. **Consulte `ROTAS_API.md`** para exemplos de uso
4. **Tire screenshots** dos erros e compare com os exemplos deste guia

---

## 🎉 Próximos Passos

Após tudo funcionando:

1. **Deploy do Backend:**
   - Heroku, Railway, Render, ou DigitalOcean
   - Atualizar `VITE_API_URL` para URL de produção

2. **Deploy do Frontend:**
   - Já configurado para GitHub Pages via `docs/`
   - Apenas faça push para `main`

3. **Melhorias:**
   - Adicionar mais campos ao formulário
   - Implementar histórico de simulações
   - Adicionar filtros de cursos
   - Implementar paginação

---

**Boa sorte nos testes! 🚀**
