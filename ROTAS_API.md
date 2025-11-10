# Documentação das Rotas da API

Este documento lista todas as rotas disponíveis na API FastAPI e como utilizá-las através dos serviços do frontend.

## Autenticação (`authService`)

### POST /cadastro
Cria um novo candidato no sistema.
```javascript
import { authService } from '@/services'

const candidato = await authService.cadastrar({
  nome: "João Silva",
  email: "joao@email.com",
  senha: "senha123",
  idade: 25,        // opcional
  sexo: "Masculino" // opcional
})
```

### POST /login
Autentica um candidato com email e senha.
```javascript
import { authService } from '@/services'

const response = await authService.login("joao@email.com", "senha123")
// Retorna: { message: "Login bem-sucedido", candidato_id: 1 }
```

### GET /candidatos/{candidato_id}
Busca os dados de um candidato específico.
```javascript
const candidato = await authService.getCandidato(1)
// Retorna: { ID, nome, email, idade, sexo }
```

### PUT /candidatos/{candidato_id}
Atualiza os dados de um candidato.
```javascript
const candidatoAtualizado = await authService.atualizarCandidato(1, {
  nome: "João Pedro Silva",
  email: "joaopedro@email.com",
  idade: 26,
  sexo: "Masculino"
})
```

### GET /candidatos/
Lista todos os candidatos cadastrados (admin/teste).
```javascript
import { simulacaoService } from '@/services'

const candidatos = await simulacaoService.listarCandidatos(0, 100)
// skip=0, limit=100
```

---

## Cursos (`cursoService`)

### GET /cursos/
Lista todos os cursos disponíveis.
```javascript
import { cursoService } from '@/services'

const cursos = await cursoService.listarCursos(0, 100)
// Retorna array de cursos com: ID, nome_curso, grau, turno, pesos, notas de corte
```

### GET /cursos/{curso_id}
Busca detalhes de um curso específico.
```javascript
const curso = await cursoService.getCurso(1)
// Retorna: { ID, ID_instituicao, nome_curso, grau, turno, peso_ct, peso_ch, peso_lc, peso_mt, peso_redacao, nota_maxima, nota_minima }
```

### POST /cursos/
Cadastra um novo curso.
```javascript
const novoCurso = await cursoService.cadastrarCurso({
  curso: {
    nome_curso: "Engenharia de Software",
    grau: "Bacharelado",
    turno: "Noturno",
    peso_ct: 2.0,
    peso_ch: 1.0,
    peso_lc: 1.0,
    peso_mt: 2.5,
    peso_redacao: 1.5,
    nota_maxima: 900,
    nota_minima: 650
  },
  instituicao: {
    nome: "Universidade Federal de Exemplo",
    sigla: "UFE",
    localizacao_campus: "Campus Central",
    modalidade: "Presencial"
  }
})
```

---

## Simulação (`simulacaoService`)

### POST /formulario/{candidato_id}
Preenche os dados complementares do candidato (notas ENEM, curso e instituição de interesse).
```javascript
import { simulacaoService } from '@/services'

const resultado = await simulacaoService.preencherFormulario(1, {
  nota: {
    nota_ct: 750.5,
    nota_ch: 680.0,
    nota_lc: 720.0,
    nota_mt: 800.0,
    nota_redacao: 850.0,
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
})
// Retorna: { message: "Dados complementares salvos com sucesso", candidato_id: 1 }
```

### GET /resultados/{candidato_id}
Calcula e retorna o resultado da simulação (aprovação baseada na média ponderada).
```javascript
const resultado = await simulacaoService.getResultado(1)
// Retorna: {
//   aprovado: true/false,
//   mensagem: "string",
//   nota_candidato: 750.5,
//   nota_minima_corte: 650.0,
//   curso: "Engenharia de Software",
//   diferenca: 100.5
// }
```

### POST /dados/lote/
Insere dados de teste em lote (múltiplos candidatos com notas e cursos).
```javascript
const resultado = await simulacaoService.criarLote({
  candidatos: [
    {
      nome: "Maria Santos",
      email: "maria@email.com",
      senha: "senha123",
      idade: 22,
      sexo: "Feminino",
      nota: {
        nota_ct: 700,
        nota_ch: 650,
        nota_lc: 680,
        nota_mt: 720,
        nota_redacao: 800,
        modalidade_concorrencia: "Ampla Concorrência"
      },
      instituicao: {
        nome: "UFE",
        sigla: "UFE",
        localizacao_campus: "Campus Central",
        modalidade: "Presencial"
      },
      curso: {
        nome_curso: "Medicina",
        grau: "Bacharelado",
        turno: "Integral",
        peso_ct: 3.0,
        peso_ch: 1.0,
        peso_lc: 1.0,
        peso_mt: 2.0,
        peso_redacao: 3.0,
        nota_maxima: 1000,
        nota_minima: 850
      }
    }
    // ... mais candidatos
  ]
})
```

---

## Fluxo Completo de Simulação

### 1. Cadastro
```javascript
import { authService } from '@/services'

const candidato = await authService.cadastrar({
  nome: "João Silva",
  email: "joao@email.com",
  senha: "senha123"
})
```

### 2. Login
```javascript
const { candidato_id } = await authService.login("joao@email.com", "senha123")
// Salvar candidato_id no estado/contexto da aplicação
```

### 3. Listar cursos disponíveis
```javascript
import { cursoService } from '@/services'

const cursos = await cursoService.listarCursos()
// Exibir lista para o usuário selecionar
```

### 4. Preencher formulário com notas e curso de interesse
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

### 5. Obter resultado da simulação
```javascript
const resultado = await simulacaoService.getResultado(candidato_id)

if (resultado.aprovado) {
  console.log(`Parabéns! Você foi aprovado para ${resultado.curso}`)
  console.log(`Sua nota: ${resultado.nota_candidato}`)
  console.log(`Nota de corte: ${resultado.nota_minima_corte}`)
  console.log(`Diferença: ${resultado.diferenca} pontos acima`)
} else {
  console.log(`Não aprovado para ${resultado.curso}`)
  console.log(`Sua nota: ${resultado.nota_candidato}`)
  console.log(`Nota de corte: ${resultado.nota_minima_corte}`)
  console.log(`Diferença: ${Math.abs(resultado.diferenca)} pontos abaixo`)
}
```

---

## Configuração da API

A URL base da API é configurada através da variável de ambiente:

```env
VITE_API_URL=http://localhost:8000
```

Se não configurada, usa `http://localhost:8000` por padrão.

---

## Tratamento de Erros

Todos os serviços lançam exceções quando ocorrem erros. Use try-catch:

```javascript
try {
  const candidato = await authService.cadastrar(dados)
} catch (error) {
  if (error.message.includes('Email já cadastrado')) {
    console.error('Este email já está em uso')
  } else {
    console.error('Erro ao cadastrar:', error.message)
  }
}
```

### Códigos de Status Comuns

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Sucesso sem retorno de dados
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Credenciais inválidas
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: email duplicado)
- `500 Internal Server Error` - Erro no servidor

---

## Importações Centralizadas

Todos os serviços podem ser importados do índice:

```javascript
import { authService, cursoService, simulacaoService } from '@/services'
```

Ou individualmente:

```javascript
import { authService } from '@/services/authService'
import { cursoService } from '@/services/cursoService'
import { simulacaoService } from '@/services/simulacaoService'
```
