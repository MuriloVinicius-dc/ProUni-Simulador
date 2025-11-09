# 🔄 Fluxo de Dados - Simulação ProUni

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React)                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌───────────────┐    ┌──────────────┐    ┌────────────────────┐       │
│  │  FormularioSimulacao│ → │  SimulacaoPage│ → │  ResultadoSimulacao│   │
│  └───────────────┘    └──────────────┘    └────────────────────┘       │
│                             ↓                                             │
│                       [Modo API?]                                         │
│                      /          \                                         │
│                    SIM          NÃO                                       │
│                    ↓            ↓                                         │
│            API Backend    Cálculo Local                                   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Fluxo de Autenticação

### Cadastro

```
┌──────────┐                           ┌──────────┐
│ Frontend │                           │ Backend  │
└────┬─────┘                           └────┬─────┘
     │                                      │
     │  1. Preenche formulário              │
     │     (nome, email, senha)             │
     │                                      │
     │  2. POST /cadastro                   │
     ├─────────────────────────────────────>│
     │     {                                │
     │       nome: "João",                  │  3. Valida dados
     │       email: "joao@email.com",       │  4. Hash da senha
     │       senha: "senha123"              │  5. Salva no banco
     │     }                                │
     │                                      │
     │  6. Response 200 OK                  │
     │<─────────────────────────────────────┤
     │     {                                │
     │       ID: 1,                         │
     │       nome: "João",                  │
     │       email: "joao@email.com"        │
     │     }                                │
     │                                      │
     │  7. Redireciona para Login           │
     │                                      │
```

### Login

```
┌──────────┐                           ┌──────────┐
│ Frontend │                           │ Backend  │
└────┬─────┘                           └────┬─────┘
     │                                      │
     │  1. Preenche login                   │
     │     (email, senha)                   │
     │                                      │
     │  2. POST /login                      │
     ├─────────────────────────────────────>│
     │     {                                │
     │       email: "joao@email.com",       │  3. Busca no banco
     │       senha: "senha123"              │  4. Verifica senha
     │     }                                │
     │                                      │
     │  5. Response 200 OK                  │
     │<─────────────────────────────────────┤
     │     {                                │
     │       access_status: "success",      │
     │       candidato: {                   │
     │         ID: 1,                       │
     │         nome: "João",                │
     │         email: "joao@email.com"      │
     │       }                              │
     │     }                                │
     │                                      │
     │  6. Salva em localStorage            │
     │     user = { id: 1, candidato_id: 1 }│
     │                                      │
     │  7. Redireciona para Dashboard       │
     │                                      │
```

---

## 🎓 Fluxo de Simulação (MODO API)

### Parte 1: Preenchimento do Formulário

```
┌──────────────────┐                   ┌──────────┐
│ FormularioSimulacao│                 │ Backend  │
└────┬─────────────┘                   └────┬─────┘
     │                                       │
     │  1. Usuário preenche:                 │
     │     - Notas ENEM (5 áreas)            │
     │     - Instituição (UFPE, etc)         │
     │     - Curso (Computação, etc)         │
     │     - Grau, Turno, Modalidade         │
     │                                       │
     │  2. Clica "Analisar Perfil"           │
     │                                       │
     │  3. onSubmit(dados)                   │
     │     ↓                                 │
     ├─────────────────────────────────────> │
     │  SimulacaoPage                        │
     │  handleSubmitFormulario(dados)        │
     │                                       │
     │  4. setEtapa("processamento")         │
     │     → Mostra animação                 │
     │                                       │
```

### Parte 2: Envio ao Backend

```
┌──────────┐                           ┌──────────┐
│ Frontend │                           │ Backend  │
└────┬─────┘                           └────┬─────┘
     │                                      │
     │  5. POST /formulario/1               │
     ├─────────────────────────────────────>│
     │     {                                │
     │       nota: {                        │
     │         nota_ct: 750,                │  6. Salva Nota
     │         nota_ch: 680,                │     ↓
     │         nota_lc: 720,                │  INSERT INTO notas
     │         nota_mt: 800,                │     (candidato_id, ...)
     │         nota_redacao: 850,           │
     │         modalidade: "Ampla..."       │  7. Salva/Busca Instituição
     │       },                             │     ↓
     │       instituicao: {                 │  INSERT/SELECT instituicoes
     │         nome: "UFPE",                │
     │         sigla: "UFPE",               │  8. Salva/Busca Curso
     │         localizacao: "Recife",       │     ↓
     │         modalidade: "Presencial"     │  INSERT/SELECT cursos
     │       },                             │
     │       curso: {                       │  9. Associa tudo
     │         nome_curso: "Computação",    │     ↓
     │         grau: "Bacharelado",         │  UPDATE candidato
     │         turno: "Noturno"             │
     │       }                              │
     │     }                                │
     │                                      │
     │  10. Response 200 OK                 │
     │<─────────────────────────────────────┤
     │      {                               │
     │        message: "Dados salvos",      │
     │        candidato_id: 1               │
     │      }                               │
     │                                      │
```

### Parte 3: Buscar Resultado

```
┌──────────┐                           ┌──────────┐
│ Frontend │                           │ Backend  │
└────┬─────┘                           └────┬─────┘
     │                                      │
     │  11. Aguarda 1s (UX)                 │
     │                                      │
     │  12. GET /resultados/1               │
     ├─────────────────────────────────────>│
     │                                      │  13. Busca Nota do candidato
     │                                      │      ↓
     │                                      │  SELECT * FROM notas
     │                                      │  WHERE candidato_id = 1
     │                                      │
     │                                      │  14. Busca Curso do candidato
     │                                      │      ↓
     │                                      │  SELECT * FROM cursos
     │                                      │  JOIN candidatos...
     │                                      │
     │                                      │  15. Calcula Média Ponderada
     │                                      │      ↓
     │                                      │  media = (
     │                                      │    nota_ct * peso_ct +
     │                                      │    nota_ch * peso_ch +
     │                                      │    nota_lc * peso_lc +
     │                                      │    nota_mt * peso_mt +
     │                                      │    nota_redacao * peso_redacao
     │                                      │  ) / soma_pesos
     │                                      │
     │                                      │  16. Compara com Nota de Corte
     │                                      │      ↓
     │                                      │  aprovado = media >= nota_minima
     │                                      │  diferenca = media - nota_minima
     │                                      │
     │  17. Response 200 OK                 │
     │<─────────────────────────────────────┤
     │      {                               │
     │        aprovado: true,               │
     │        mensagem: "Parabéns...",      │
     │        nota_candidato: 760.0,        │
     │        nota_minima_corte: 650.0,     │
     │        curso: "Ciência da Comp...",  │
     │        diferenca: 110.0              │
     │      }                               │
     │                                      │
```

### Parte 4: Exibição do Resultado

```
┌──────────┐                           ┌──────────────────┐
│ Frontend │                           │ ResultadoSimulacao│
└────┬─────┘                           └────┬─────────────┘
     │                                      │
     │  18. Monta objeto de resultado       │
     │      {                               │
     │        nome_curso: "...",            │
     │        instituicao: "UFPE",          │
     │        mediaEnem: 760.0,             │
     │        selecionado: true,            │
     │        nota_minima: 650.0,           │
     │        diferenca: 110.0,             │
     │        mensagem: "Parabéns...",      │
     │        ... (outros campos)           │
     │      }                               │
     │                                      │
     │  19. (Opcional) Persiste localmente  │
     │      ↓                               │
     │  Simulacao.create(resultado)         │
     │  → Salva em Supabase ou localStorage │
     │                                      │
     │  20. setResultado(resultado)         │
     │  21. setEtapa("resultado")           │
     │      ↓                               │
     ├─────────────────────────────────────>│
     │                                      │  22. Renderiza tela
     │                                      │      com resultado:
     │                                      │
     │                                      │  ✅ APROVADO
     │                                      │  📊 Nota: 760.0
     │                                      │  📈 Corte: 650.0
     │                                      │  ➕ Diferença: +110
     │                                      │  📖 Curso: Ciência...
     │                                      │  🏫 Instituição: UFPE
     │                                      │
```

---

## 🔄 Fluxo de Simulação (MODO LOCAL)

```
┌──────────────────┐                   ┌──────────────┐
│ FormularioSimulacao│                 │ SimulacaoPage│
└────┬─────────────┘                   └────┬─────────┘
     │                                      │
     │  1. onSubmit(dados)                  │
     │     ↓                                │
     ├─────────────────────────────────────>│
     │  handleSubmitFormulario(dados)       │
     │                                      │
     │                                      │  2. Calcula localmente:
     │                                      │     ↓
     │                                      │  media = (lc + mt + ch + ct + red) / 5
     │                                      │  nota_minima = 600 (mock)
     │                                      │  aprovado = media >= 600
     │                                      │  posicao = random
     │                                      │
     │                                      │  3. Persiste (opcional):
     │                                      │     ↓
     │                                      │  Simulacao.create(resultado)
     │                                      │  → localStorage ou Supabase
     │                                      │
     │                                      │  4. setResultado(resultado)
     │                                      │  5. setEtapa("resultado")
     │                                      │
```

---

## 📐 Diagrama de Componentes

```
App.jsx
  │
  ├── AuthProvider (AuthContext)
  │     │
  │     ├── user: { id, candidato_id, nome, email }
  │     ├── signIn(email, senha)
  │     └── signUp(email, senha, metadata)
  │
  ├── Layout
  │     ├── Header (mostra user.nome)
  │     └── Outlet
  │           │
  │           ├── Dashboard
  │           │     └── Link "Nova Simulação"
  │           │
  │           └── SimulacaoPage
  │                 │
  │                 ├── FormularioSimulacao
  │                 │     └── onSubmit(dados)
  │                 │
  │                 ├── ProcessamentoSimulacao
  │                 │     └── Animação de loading
  │                 │
  │                 └── ResultadoSimulacao
  │                       └── Exibe aprovado/reprovado
  │
  └── Services
        ├── authService.js
        │     ├── login(email, senha)
        │     └── cadastrar(dados)
        │
        └── simulacaoService.js
              ├── preencherFormulario(id, dados)
              └── getResultado(id)
```

---

## 🎨 Estados da UI

### Estado: "formulario"
```
┌────────────────────────────────────┐
│  📝 Preencha seus dados            │
├────────────────────────────────────┤
│                                    │
│  [Notas ENEM]                      │
│  Linguagens: [750]                 │
│  Matemática: [800]                 │
│  ...                               │
│                                    │
│  [Instituição]                     │
│  [ UFPE ▼ ]                        │
│                                    │
│  [Curso]                           │
│  [ Ciência da Computação ]         │
│                                    │
│  [ Analisar Perfil ]               │
└────────────────────────────────────┘
```

### Estado: "processamento"
```
┌────────────────────────────────────┐
│  ⏳ Analisando seu perfil          │
├────────────────────────────────────┤
│                                    │
│     ████████░░░░ 60%               │
│                                    │
│  Comparando com dados históricos   │
│  do ProUni...                      │
│                                    │
└────────────────────────────────────┘
```

### Estado: "resultado"
```
┌────────────────────────────────────┐
│  ✅ Resultado da Análise           │
├────────────────────────────────────┤
│                                    │
│  🎉 PARABÉNS!                      │
│  Você foi APROVADO!                │
│                                    │
│  📊 Sua Nota: 760.0                │
│  📈 Nota de Corte: 650.0           │
│  ➕ Diferença: +110.0 pontos       │
│                                    │
│  📖 Curso: Ciência da Computação   │
│  🏫 Instituição: UFPE              │
│  🎓 Grau: Bacharelado              │
│  🕐 Turno: Noturno                 │
│                                    │
│  [ Nova Simulação ]                │
└────────────────────────────────────┘
```

---

## 🔀 Decisões de Fluxo

### Qual modo usar?

```
┌─────────────────────────┐
│ .env configurado?       │
└────────┬────────────────┘
         │
    VITE_USE_REAL_API=?
         │
    ┌────┴────┐
    │         │
  true      false
    │         │
    ↓         ↓
  API    Supabase?
  Mode      │
         ┌──┴──┐
         │     │
       SIM   NÃO
         │     │
         ↓     ↓
    Supabase  Demo
      Mode    Mode
```

### Onde persistir resultado?

```
┌──────────────────┐
│ Modo API ativo?  │
└────────┬─────────┘
         │
      ┌──┴──┐
      │     │
    SIM   NÃO
      │     │
      ↓     ↓
   Backend  Local
   (via API) │
            │
      ┌─────┴─────┐
      │           │
  Supabase    localStorage
  disponível?
      │           │
    SIM         NÃO
      │           │
      ↓           ↓
   Supabase   localStorage
     Mode        Mode
```

---

## 📋 Resumo dos Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/cadastro` | Criar novo candidato |
| POST | `/login` | Autenticar candidato |
| POST | `/formulario/{id}` | Enviar dados de simulação |
| GET | `/resultados/{id}` | Buscar resultado calculado |
| GET | `/candidatos/{id}` | Buscar dados do candidato |
| PUT | `/candidatos/{id}` | Atualizar candidato |

---

**Este fluxo garante que o frontend e backend estejam completamente integrados! 🚀**
