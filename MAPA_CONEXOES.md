# Mapa de Conexões - Frontend ↔ Backend

## ✅ Rotas Conectadas

### 🔐 Autenticação
| Frontend | Backend | Serviço | Status |
|----------|---------|---------|--------|
| Login | `POST /login` | `authService.login()` | ✅ |
| Cadastro | `POST /cadastro` | `authService.cadastrar()` | ✅ |
| Buscar candidato | `GET /candidatos/{id}` | `authService.getCandidato()` | ✅ |
| Atualizar candidato | `PUT /candidatos/{id}` | `authService.atualizarCandidato()` | ✅ |

### 📚 Cursos
| Frontend | Backend | Serviço | Status |
|----------|---------|---------|--------|
| Listar cursos | `GET /cursos/` | `cursoService.listarCursos()` | ✅ |
| Buscar curso | `GET /cursos/{id}` | `cursoService.getCurso()` | ✅ |
| Cadastrar curso | `POST /cursos/` | `cursoService.cadastrarCurso()` | ✅ |

### 🎯 Simulação
| Frontend | Backend | Serviço | Status |
|----------|---------|---------|--------|
| Preencher formulário | `POST /formulario/{candidato_id}` | `simulacaoService.preencherFormulario()` | ✅ |
| Obter resultado | `GET /resultados/{candidato_id}` | `simulacaoService.getResultado()` | ✅ |
| Criar lote (teste) | `POST /dados/lote/` | `simulacaoService.criarLote()` | ✅ |
| Listar candidatos | `GET /candidatos/` | `simulacaoService.listarCandidatos()` | ✅ |

## 📂 Estrutura de Serviços

```
src/
├── services/
│   ├── index.js              # Exporta todos os serviços
│   ├── authService.js        # Autenticação e candidatos
│   ├── cursoService.js       # Gerenciamento de cursos
│   └── simulacaoService.js   # Fluxo de simulação
├── hooks/
│   └── useSimulacao.js       # Hooks customizados
├── lib/
│   └── api.js                # Cliente HTTP base
└── contexts/
    └── AuthContext.jsx       # Contexto de autenticação
```

## 🔄 Fluxo Completo de Uso

### 1. Cadastro e Login
```javascript
// Cadastro
import { authService } from '@/services'
const candidato = await authService.cadastrar({
  nome: "João Silva",
  email: "joao@email.com",
  senha: "senha123",
  idade: 25,
  sexo: "Masculino"
})

// Login
const { candidato_id } = await authService.login("joao@email.com", "senha123")
```

### 2. Buscar Cursos
```javascript
import { cursoService } from '@/services'
const cursos = await cursoService.listarCursos()
```

### 3. Preencher Formulário
```javascript
import { simulacaoService } from '@/services'
await simulacaoService.preencherFormulario(candidato_id, {
  nota: {
    nota_ct: 750,
    nota_ch: 680,
    nota_lc: 720,
    nota_mt: 800,
    nota_redacao: 850,
    modalidade_concorrencia: "Ampla Concorrência"
  },
  instituicao: {
    nome: "UFE",
    sigla: "UFE",
    localizacao_campus: "Campus Central",
    modalidade: "Presencial"
  },
  curso: {
    nome_curso: "Engenharia de Software",
    grau: "Bacharelado",
    turno: "Noturno"
  }
})
```

### 4. Obter Resultado
```javascript
const resultado = await simulacaoService.getResultado(candidato_id)
// {
//   aprovado: true,
//   mensagem: "Parabéns! Você foi aprovado!",
//   nota_candidato: 756.5,
//   nota_minima_corte: 650.0,
//   curso: "Engenharia de Software",
//   diferenca: 106.5
// }
```

## 🎨 Hooks Customizados

### useSimulacao
```javascript
import { useSimulacao } from '@/hooks/useSimulacao'

const { 
  loading, 
  error, 
  resultado,
  preencherFormulario,
  obterResultado,
  executarSimulacao,
  limparResultado 
} = useSimulacao(candidatoId)

// Uso
await executarSimulacao(dadosFormulario)
```

### useCursos
```javascript
import { useCursos } from '@/hooks/useSimulacao'

const {
  cursos,
  loading,
  error,
  carregarCursos,
  buscarCurso,
  cadastrarCurso
} = useCursos()

// Uso
await carregarCursos()
```

## ⚙️ Configuração

### Variáveis de Ambiente

Criar arquivo `.env` na raiz:

```env
# Para usar a API FastAPI real
VITE_USE_REAL_API=true
VITE_API_URL=http://localhost:8000
```

### Iniciar Backend

```powershell
# Windows PowerShell
./start-api.ps1
```

### Iniciar Frontend

```powershell
npm run dev
```

## 📖 Documentação Adicional

- **[ROTAS_API.md](./ROTAS_API.md)** - Documentação completa de todas as rotas
- **[EXEMPLOS_INTEGRACAO.md](./EXEMPLOS_INTEGRACAO.md)** - Exemplos de código para cada página
- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Guia de integração original

## 🧪 Testando as Conexões

### Teste 1: Cadastro
```javascript
const candidato = await authService.cadastrar({
  nome: "Teste",
  email: "teste@email.com",
  senha: "123456"
})
console.log('✅ Candidato criado:', candidato)
```

### Teste 2: Login
```javascript
const { candidato_id } = await authService.login("teste@email.com", "123456")
console.log('✅ Login bem-sucedido:', candidato_id)
```

### Teste 3: Listar Cursos
```javascript
const cursos = await cursoService.listarCursos()
console.log('✅ Cursos disponíveis:', cursos.length)
```

### Teste 4: Simulação Completa
```javascript
// 1. Preencher
await simulacaoService.preencherFormulario(candidato_id, dados)
console.log('✅ Formulário preenchido')

// 2. Resultado
const resultado = await simulacaoService.getResultado(candidato_id)
console.log('✅ Resultado:', resultado.aprovado ? 'Aprovado' : 'Não aprovado')
```

## 🚀 Próximos Passos

1. ✅ Conectar todas as rotas nos serviços
2. ✅ Criar hooks customizados
3. ✅ Atualizar AuthContext
4. ✅ Documentar exemplos de uso
5. ⏳ Implementar nas páginas existentes
6. ⏳ Adicionar tratamento de erros global
7. ⏳ Criar testes automatizados
8. ⏳ Adicionar loading states nas páginas

## 🐛 Troubleshooting

### Erro: "Network Error"
- Verifique se o backend está rodando em `http://localhost:8000`
- Confirme que `VITE_API_URL` está configurado corretamente

### Erro: "401 Unauthorized"
- Credenciais inválidas
- Verifique email e senha

### Erro: "404 Not Found"
- Rota não existe no backend
- Verifique se a URL está correta

### Erro: "409 Conflict"
- Email já cadastrado
- Use outro email ou faça login

### Erro: CORS
- Backend deve ter CORS configurado para aceitar requisições do frontend
- Verifique `allow_origins` no `main.py`
