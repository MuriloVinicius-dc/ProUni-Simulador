# 📁 Estrutura do Projeto - ProUni Simulador

Estrutura organizada e modular seguindo as melhores práticas de React.

## 📂 Estrutura de Diretórios

```
src/
├── assets/                      # Recursos estáticos (imagens, ícones)
│   └── images/
│
├── components/                  # Componentes reutilizáveis
│   ├── auth/                   # Componentes de autenticação
│   │   ├── AuthForm/
│   │   │   ├── index.jsx       # Componente React
│   │   │   └── styles.module.css
│   │   ├── SocialLoginButton/
│   │   │   ├── index.jsx
│   │   │   └── styles.module.css
│   │   └── ProtectedRoute/
│   │       └── index.jsx
│   │
│   ├── simulacao/              # Componentes da simulação
│   │   ├── FormularioSimulacao/
│   │   │   └── index.jsx
│   │   ├── ProcessamentoSimulacao/
│   │   │   └── index.jsx
│   │   └── ResultadoSimulacao/
│   │       └── index.jsx
│   │
│   └── ui/                     # Componentes UI base (shadcn)
│       ├── button.jsx
│       ├── card.jsx
│       ├── input.jsx
│       ├── label.jsx
│       ├── select.jsx
│       ├── progress.jsx
│       ├── checkbox.jsx
│       └── theme-toggle.jsx
│
├── contexts/                    # React Contexts
│   └── AuthContext.jsx         # Context de autenticação
│
├── entities/                    # Camada de dados/entidades
│   └── Simulacao.jsx           # Entidade de simulação (CRUD)
│
├── lib/                        # Bibliotecas e utilitários
│   ├── supabase.js            # Cliente Supabase configurado
│   └── utils.jsx              # Funções utilitárias (cn)
│
├── pages/                      # Páginas da aplicação
│   ├── Login/
│   │   ├── index.jsx          # Página de login
│   │   └── styles.module.css  # Estilos específicos
│   ├── Cadastro/
│   │   ├── index.jsx          # Página de cadastro
│   │   └── styles.module.css
│   ├── Dashboard/
│   │   ├── index.jsx          # Dashboard principal
│   │   └── styles.module.css
│   └── Simulacao/
│       ├── index.jsx          # Página de simulação
│       └── styles.module.css
│
├── utils/                      # Utilitários gerais
│   └── index.jsx              # Helpers (createPageUrl, etc)
│
├── App.jsx                     # Componente raiz com rotas
├── layout.jsx                  # Layout principal (header, navegação)
├── main.jsx                    # Entry point da aplicação
└── index.css                   # Estilos globais (Tailwind)
```

## 🎯 Convenções

### Nomenclatura de Arquivos

- **Componentes React**: `index.jsx` dentro de pasta com nome do componente
- **Estilos CSS Modules**: `styles.module.css`
- **Componentes UI**: nome descritivo em minúsculo (ex: `button.jsx`)
- **Contextos**: sufixo `Context` (ex: `AuthContext.jsx`)
- **Entidades**: nome singular em PascalCase (ex: `Simulacao.jsx`)

### Estrutura de Pastas

Cada componente/página tem sua própria pasta contendo:
```
ComponentName/
├── index.jsx           # Lógica do componente
└── styles.module.css   # Estilos isolados (opcional)
```

### Imports

Use **path alias** `@/` para imports absolutos:
```javascript
// ✅ Bom
import { AuthForm } from '@/components/auth/AuthForm'
import { supabase } from '@/lib/supabase'

// ❌ Evitar
import { AuthForm } from '../../../components/auth/AuthForm'
```

### CSS Modules

Estilos devem ser isolados usando CSS Modules:
```javascript
import styles from './styles.module.css'

<div className={styles.container}>
  <h1 className={styles.title}>Título</h1>
</div>
```

## 🔄 Fluxo de Dados

```
User Input
    ↓
Components (UI)
    ↓
Contexts (State Management)
    ↓
Entities (Data Layer)
    ↓
Supabase (Backend)
```

## 📝 Como Adicionar uma Nova Página

1. Criar pasta em `src/pages/NomeDaPagina/`
2. Criar `index.jsx` e `styles.module.css`
3. Adicionar rota em `src/App.jsx`
4. Adicionar link em `src/layout.jsx` (se necessário)

Exemplo:
```javascript
// src/pages/NovaPagina/index.jsx
import styles from './styles.module.css'

export default function NovaPagina() {
  return (
    <div className={styles.container}>
      <h1>Nova Página</h1>
    </div>
  )
}

// src/App.jsx
import NovaPagina from '@/pages/NovaPagina'
// ... adicionar <Route path="/NovaPagina" element={<NovaPagina />} />
```

## 🧩 Como Adicionar um Novo Componente

1. Criar pasta em `src/components/categoria/NomeComponente/`
2. Criar `index.jsx` e `styles.module.css` (se necessário)
3. Exportar o componente

Exemplo:
```javascript
// src/components/common/Card/index.jsx
import styles from './styles.module.css'

export function Card({ children }) {
  return (
    <div className={styles.card}>
      {children}
    </div>
  )
}
```

## 🎨 Sistema de Design

### Cores Principais
- **Primária**: Azul (#2563eb) → Indigo (#4f46e5)
- **Gradientes**: `from-blue-600 to-indigo-600`
- **Texto**: Slate (50-900)
- **Background**: Gradientes suaves (slate/blue/indigo)

### Dark Mode
Todos os componentes devem suportar dark mode usando seletor `.dark`:
```css
.title {
  color: rgb(15 23 42);
}

.dark .title {
  color: rgb(241 245 249);
}
```

## 🔐 Autenticação

A autenticação é gerenciada por:
- **Supabase Auth** (backend)
- **AuthContext** (estado global)
- **ProtectedRoute** (proteção de rotas)

### Usar autenticação em componentes:
```javascript
import { useAuth } from '@/contexts/AuthContext'

function MeuComponente() {
  const { user, signOut } = useAuth()
  
  return <div>Olá, {user?.email}</div>
}
```

## 📦 Dependências Principais

- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing (HashRouter)
- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Supabase** - Backend (Auth + Database)

## 🚀 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run preview      # Preview do build
```

## 📖 Documentação Adicional

- [SETUP_AUTH.md](../../SETUP_AUTH.md) - Configuração de autenticação
- [AUTH_README.md](../../AUTH_README.md) - Arquitetura de autenticação
- [README.md](../../README.md) - Documentação principal
