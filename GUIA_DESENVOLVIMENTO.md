# 🚀 Guia Rápido de Desenvolvimento

## Primeiros Passos

### 1. Clone e Instale

```powershell
git clone https://github.com/MuriloVinicius-dc/ProUni-Simulador.git
cd ProUni-Simulador
npm ci
```

### 2. Configure o Ambiente

Crie `.env.local` na raiz:

```env
VITE_USE_REAL_API=true
VITE_API_URL=http://localhost:8000
```

### 3. Inicie os Servidores

**Terminal 1 - Backend:**
```powershell
.\start-api.ps1
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

## Como Adicionar uma Nova Funcionalidade

### Exemplo: Adicionar campo "telefone" no cadastro

#### 1. Backend - Atualizar Model

```python
# Backend/db/models.py
class Candidato(Base):
    __tablename__ = "candidatos"
    
    ID = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha = Column(String, nullable=False)
    idade = Column(Integer, nullable=True)
    sexo = Column(String, nullable=True)
    telefone = Column(String, nullable=True)  # 🆕 NOVO CAMPO
```

#### 2. Backend - Atualizar Schema

```python
# Backend/db/schemas.py
class CandidatoBase(BaseModel):
    nome: str = Field(..., max_length=100)
    email: EmailStr
    idade: Optional[int] = Field(None, ge=15, le=100)
    sexo: Optional[str] = Field(None, max_length=9)
    telefone: Optional[str] = Field(None, max_length=20)  # 🆕 NOVO CAMPO
```

#### 3. Backend - Atualizar CRUD (se necessário)

```python
# Backend/db/crud.py
def create_candidato(db: Session, candidato: schemas.CandidatoCreate):
    db_candidato = models.Candidato(
        nome=candidato.nome,
        email=candidato.email,
        senha=candidato.senha,
        idade=candidato.idade,
        sexo=candidato.sexo,
        telefone=candidato.telefone  # 🆕 NOVO CAMPO
    )
    # ...
```

#### 4. Frontend - Atualizar Formulário

```jsx
// src/pages/Cadastro/index.jsx
const [formData, setFormData] = useState({
  nome: '',
  email: '',
  senha: '',
  idade: '',
  sexo: '',
  telefone: ''  // 🆕 NOVO CAMPO
})

// No JSX
<Input
  placeholder="Telefone (opcional)"
  value={formData.telefone}
  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
/>
```

#### 5. Frontend - Atualizar Service Call

```jsx
await signUp(formData.email, formData.senha, {
  nome: formData.nome,
  idade: formData.idade ? parseInt(formData.idade) : undefined,
  sexo: formData.sexo,
  telefone: formData.telefone  // 🆕 NOVO CAMPO
})
```

## Como Adicionar uma Nova Rota

### Exemplo: Endpoint para buscar cursos por instituição

#### 1. Backend - Adicionar Rota

```python
# Backend/db/routers/candidato_router.py

@router.get(
    "/cursos/instituicao/{instituicao_id}",
    response_model=List[schemas.CursoResponse],
    summary="Lista cursos de uma instituição"
)
def list_cursos_by_instituicao(
    instituicao_id: int,
    db: Session = DbDependency
):
    """Retorna todos os cursos de uma instituição específica"""
    cursos = db.query(models.Curso).filter(
        models.Curso.ID_instituicao == instituicao_id
    ).all()
    return cursos
```

#### 2. Backend - Adicionar no CRUD (se necessário)

```python
# Backend/db/crud.py

def get_cursos_by_instituicao(db: Session, instituicao_id: int):
    return db.query(models.Curso).filter(
        models.Curso.ID_instituicao == instituicao_id
    ).all()
```

#### 3. Frontend - Adicionar no Service

```javascript
// src/services/cursoService.js

export const cursoService = {
  // ... métodos existentes

  /**
   * Lista cursos de uma instituição específica
   * @param {number} instituicaoId 
   * @returns {Promise<Array>}
   */
  async listarCursosPorInstituicao(instituicaoId) {
    const response = await api.get(`/cursos/instituicao/${instituicaoId}`)
    return response
  }
}
```

#### 4. Frontend - Usar no Componente

```jsx
import { cursoService } from '@/services'

const MeuComponente = () => {
  const [cursos, setCursos] = useState([])

  useEffect(() => {
    const carregarCursos = async () => {
      const dados = await cursoService.listarCursosPorInstituicao(1)
      setCursos(dados)
    }
    carregarCursos()
  }, [])

  // ...
}
```

## Como Usar os Hooks Customizados

### Hook useSimulacao

```jsx
import { useSimulacao } from '@/hooks/useSimulacao'
import { useAuth } from '@/contexts/AuthContext'

function MinhaSimulacao() {
  const { user } = useAuth()
  const { 
    resultado, 
    loading, 
    error,
    executarSimulacao 
  } = useSimulacao(user?.ID)

  const handleSubmit = async (dados) => {
    try {
      const res = await executarSimulacao(dados)
      console.log('Resultado:', res)
    } catch (err) {
      console.error('Erro:', err)
    }
  }

  if (loading) return <div>Processando...</div>
  if (error) return <div>Erro: {error}</div>
  
  return (
    <div>
      {resultado && (
        <div>
          {resultado.aprovado ? '✅ Aprovado!' : '❌ Não aprovado'}
        </div>
      )}
    </div>
  )
}
```

### Hook useCursos

```jsx
import { useCursos } from '@/hooks/useSimulacao'

function ListaCursos() {
  const { cursos, loading, carregarCursos } = useCursos()

  useEffect(() => {
    carregarCursos()
  }, [])

  if (loading) return <div>Carregando cursos...</div>

  return (
    <ul>
      {cursos.map(curso => (
        <li key={curso.ID}>{curso.nome_curso}</li>
      ))}
    </ul>
  )
}
```

## Estrutura de um Service

```javascript
// src/services/meuService.js
import { api } from '@/lib/api'

export const meuService = {
  /**
   * Descrição do método
   * @param {type} param - Descrição do parâmetro
   * @returns {Promise<type>} - Descrição do retorno
   */
  async meuMetodo(param) {
    const response = await api.get(`/endpoint/${param}`)
    return response
  },

  async criar(dados) {
    const response = await api.post('/endpoint', dados)
    return response
  },

  async atualizar(id, dados) {
    const response = await api.put(`/endpoint/${id}`, dados)
    return response
  },

  async deletar(id) {
    const response = await api.delete(`/endpoint/${id}`)
    return response
  }
}
```

## Padrões de Código

### 1. Naming Conventions

```javascript
// Variáveis e funções: camelCase
const minhaVariavel = 'valor'
function minhaFuncao() {}

// Componentes: PascalCase
function MeuComponente() {}

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8000'

// Arquivos de componentes: PascalCase
// MeuComponente.jsx

// Arquivos de utilitários: camelCase
// minhaUtil.js
```

### 2. Estrutura de Componente

```jsx
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function MeuComponente({ prop1, prop2 }) {
  // 1. Estados
  const [estado, setEstado] = useState(null)
  
  // 2. Hooks customizados
  const { data, loading } = useMeuHook()
  
  // 3. Efeitos
  useEffect(() => {
    // lógica
  }, [])
  
  // 4. Handlers
  const handleClick = () => {
    // lógica
  }
  
  // 5. Early returns
  if (loading) return <div>Carregando...</div>
  
  // 6. Render principal
  return (
    <div>
      <Button onClick={handleClick}>Clique</Button>
    </div>
  )
}
```

### 3. Tratamento de Erros

```javascript
// Sempre use try-catch em operações assíncronas
const handleSubmit = async (dados) => {
  try {
    const resultado = await service.metodo(dados)
    // Sucesso
    setResultado(resultado)
  } catch (error) {
    // Erro
    console.error('Erro ao processar:', error)
    setError(error.message)
  } finally {
    // Sempre executado
    setLoading(false)
  }
}
```

### 4. Importações

```javascript
// 1. Importações externas
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// 2. Importações de componentes UI
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// 3. Importações de serviços/hooks
import { authService } from '@/services'
import { useAuth } from '@/contexts/AuthContext'

// 4. Importações de utilitários
import { createPageUrl } from '@/utils'

// 5. Importações de estilos (se houver)
import './styles.module.css'
```

## Comandos Úteis

```powershell
# Frontend
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linter (se configurado)

# Backend
.\start-api.ps1      # Iniciar API (Windows)
./start-api.sh       # Iniciar API (Linux/Mac)

# Git
git status           # Ver mudanças
git add .            # Adicionar todos os arquivos
git commit -m "msg"  # Commit com mensagem
git push            # Enviar para GitHub
git pull            # Baixar do GitHub
```

## Checklist Antes do Commit

- [ ] Código testado localmente
- [ ] Sem erros no console
- [ ] Código formatado
- [ ] Variáveis com nomes descritivos
- [ ] Comentários onde necessário
- [ ] Import paths usando @/ alias
- [ ] Tratamento de erros implementado
- [ ] Loading states adicionados

## Recursos Úteis

- **Documentação React**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **FastAPI**: https://fastapi.tiangolo.com
- **SQLAlchemy**: https://docs.sqlalchemy.org

## Suporte

- Consulte [ROTAS_API.md](./ROTAS_API.md) para detalhes das rotas
- Veja [EXEMPLOS_INTEGRACAO.md](./EXEMPLOS_INTEGRACAO.md) para exemplos de código
- Confira [MAPA_CONEXOES.md](./MAPA_CONEXOES.md) para visão geral
- Use [CHECKLIST_IMPLEMENTACAO.md](./CHECKLIST_IMPLEMENTACAO.md) para acompanhar progresso
