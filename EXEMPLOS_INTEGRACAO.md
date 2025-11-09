# Exemplos de Integração das Rotas

Este documento mostra exemplos práticos de como usar os serviços e hooks nas páginas do frontend.

## Exemplo 1: Página de Cadastro

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createPageUrl } from '@/utils'

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    idade: '',
    sexo: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signUp(formData.email, formData.senha, {
        nome: formData.nome,
        idade: formData.idade ? parseInt(formData.idade) : undefined,
        sexo: formData.sexo
      })
      
      navigate(createPageUrl('Login'))
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        placeholder="Nome completo"
        value={formData.nome}
        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        required
      />
      <Input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        type="password"
        placeholder="Senha (mínimo 6 caracteres)"
        value={formData.senha}
        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
        required
        minLength={6}
      />
      <Input
        type="number"
        placeholder="Idade (opcional)"
        value={formData.idade}
        onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
      />
      <select
        value={formData.sexo}
        onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
      >
        <option value="">Selecione o sexo (opcional)</option>
        <option value="Masculino">Masculino</option>
        <option value="Feminino">Feminino</option>
        <option value="Outro">Outro</option>
      </select>
      
      {error && <p className="text-red-500">{error}</p>}
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </Button>
    </form>
  )
}
```

## Exemplo 2: Página de Login

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createPageUrl } from '@/utils'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn(email, senha)
      navigate(createPageUrl('Dashboard'))
    } catch (err) {
      setError('Credenciais inválidas. Verifique email e senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />
      
      {error && <p className="text-red-500">{error}</p>}
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
```

## Exemplo 3: Página de Simulação (Formulário)

```jsx
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSimulacao, useCursos } from '@/hooks/useSimulacao'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SimulacaoFormulario() {
  const { user } = useAuth()
  const { executarSimulacao, loading: simulacaoLoading } = useSimulacao(user?.ID)
  const { cursos, carregarCursos, loading: cursosLoading } = useCursos()
  
  const [formData, setFormData] = useState({
    // Notas ENEM
    nota_ct: '',
    nota_ch: '',
    nota_lc: '',
    nota_mt: '',
    nota_redacao: '',
    modalidade_concorrencia: 'Ampla Concorrência',
    
    // Curso selecionado
    cursoSelecionado: null,
    
    // Instituição
    nome_instituicao: '',
    sigla_instituicao: '',
    localizacao_campus: '',
    modalidade_instituicao: 'Presencial'
  })

  useEffect(() => {
    carregarCursos()
  }, [])

  const handleCursoChange = (cursoId) => {
    const curso = cursos.find(c => c.ID === parseInt(cursoId))
    setFormData({
      ...formData,
      cursoSelecionado: curso
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.cursoSelecionado) {
      alert('Selecione um curso')
      return
    }

    const dadosSimulacao = {
      nota: {
        nota_ct: parseFloat(formData.nota_ct),
        nota_ch: parseFloat(formData.nota_ch),
        nota_lc: parseFloat(formData.nota_lc),
        nota_mt: parseFloat(formData.nota_mt),
        nota_redacao: parseFloat(formData.nota_redacao),
        modalidade_concorrencia: formData.modalidade_concorrencia
      },
      instituicao: {
        nome: formData.nome_instituicao,
        sigla: formData.sigla_instituicao,
        localizacao_campus: formData.localizacao_campus,
        modalidade: formData.modalidade_instituicao
      },
      curso: {
        nome_curso: formData.cursoSelecionado.nome_curso,
        grau: formData.cursoSelecionado.grau,
        turno: formData.cursoSelecionado.turno
      }
    }

    try {
      const resultado = await executarSimulacao(dadosSimulacao)
      // Navegar para página de resultado ou mostrar modal
      console.log('Resultado:', resultado)
    } catch (err) {
      alert('Erro ao processar simulação: ' + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Suas Notas do ENEM</h2>
      
      <Input
        type="number"
        placeholder="Nota Ciências da Natureza (0-1000)"
        value={formData.nota_ct}
        onChange={(e) => setFormData({ ...formData, nota_ct: e.target.value })}
        min="0"
        max="1000"
        step="0.1"
        required
      />
      
      <Input
        type="number"
        placeholder="Nota Ciências Humanas (0-1000)"
        value={formData.nota_ch}
        onChange={(e) => setFormData({ ...formData, nota_ch: e.target.value })}
        min="0"
        max="1000"
        step="0.1"
        required
      />
      
      <Input
        type="number"
        placeholder="Nota Linguagens e Códigos (0-1000)"
        value={formData.nota_lc}
        onChange={(e) => setFormData({ ...formData, nota_lc: e.target.value })}
        min="0"
        max="1000"
        step="0.1"
        required
      />
      
      <Input
        type="number"
        placeholder="Nota Matemática (0-1000)"
        value={formData.nota_mt}
        onChange={(e) => setFormData({ ...formData, nota_mt: e.target.value })}
        min="0"
        max="1000"
        step="0.1"
        required
      />
      
      <Input
        type="number"
        placeholder="Nota Redação (0-1000)"
        value={formData.nota_redacao}
        onChange={(e) => setFormData({ ...formData, nota_redacao: e.target.value })}
        min="0"
        max="1000"
        step="0.1"
        required
      />

      <h2>Curso de Interesse</h2>
      
      {cursosLoading ? (
        <p>Carregando cursos...</p>
      ) : (
        <select
          value={formData.cursoSelecionado?.ID || ''}
          onChange={(e) => handleCursoChange(e.target.value)}
          required
        >
          <option value="">Selecione um curso</option>
          {cursos.map((curso) => (
            <option key={curso.ID} value={curso.ID}>
              {curso.nome_curso} - {curso.grau} - {curso.turno}
            </option>
          ))}
        </select>
      )}

      <h2>Instituição</h2>
      
      <Input
        placeholder="Nome da Instituição"
        value={formData.nome_instituicao}
        onChange={(e) => setFormData({ ...formData, nome_instituicao: e.target.value })}
        required
      />
      
      <Input
        placeholder="Sigla"
        value={formData.sigla_instituicao}
        onChange={(e) => setFormData({ ...formData, sigla_instituicao: e.target.value })}
        required
      />
      
      <Input
        placeholder="Campus (opcional)"
        value={formData.localizacao_campus}
        onChange={(e) => setFormData({ ...formData, localizacao_campus: e.target.value })}
      />
      
      <select
        value={formData.modalidade_instituicao}
        onChange={(e) => setFormData({ ...formData, modalidade_instituicao: e.target.value })}
      >
        <option value="Presencial">Presencial</option>
        <option value="EAD">EAD</option>
      </select>

      <Button type="submit" disabled={simulacaoLoading || cursosLoading}>
        {simulacaoLoading ? 'Processando...' : 'Simular'}
      </Button>
    </form>
  )
}
```

## Exemplo 4: Página de Resultado

```jsx
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSimulacao } from '@/hooks/useSimulacao'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { createPageUrl } from '@/utils'

export default function ResultadoSimulacao() {
  const { user } = useAuth()
  const { resultado, obterResultado, loading, error } = useSimulacao(user?.ID)
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.ID) {
      obterResultado()
    }
  }, [user])

  if (loading) {
    return <div>Carregando resultado...</div>
  }

  if (error) {
    return <div>Erro: {error}</div>
  }

  if (!resultado) {
    return <div>Nenhum resultado disponível</div>
  }

  return (
    <div className={resultado.aprovado ? 'bg-green-100' : 'bg-red-100'}>
      <h1>{resultado.aprovado ? '🎉 Parabéns!' : '😔 Não aprovado'}</h1>
      <h2>{resultado.curso}</h2>
      
      <p>{resultado.mensagem}</p>
      
      <div>
        <p>Sua nota: <strong>{resultado.nota_candidato.toFixed(2)}</strong></p>
        <p>Nota de corte: <strong>{resultado.nota_minima_corte.toFixed(2)}</strong></p>
        <p>
          Diferença: 
          <strong className={resultado.aprovado ? 'text-green-600' : 'text-red-600'}>
            {resultado.aprovado ? '+' : ''}{resultado.diferenca.toFixed(2)} pontos
          </strong>
        </p>
      </div>

      <Button onClick={() => navigate(createPageUrl('Simulacao'))}>
        Nova Simulação
      </Button>
    </div>
  )
}
```

## Exemplo 5: Dashboard com Histórico

```jsx
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services'

export default function Dashboard() {
  const { user } = useAuth()
  const [candidatoInfo, setCandidatoInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarDados = async () => {
      if (user?.ID) {
        try {
          const dados = await authService.getCandidato(user.ID)
          setCandidatoInfo(dados)
        } catch (err) {
          console.error('Erro ao carregar dados:', err)
        } finally {
          setLoading(false)
        }
      }
    }

    carregarDados()
  }, [user])

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div>
      <h1>Bem-vindo, {candidatoInfo?.nome}!</h1>
      <p>Email: {candidatoInfo?.email}</p>
      {candidatoInfo?.idade && <p>Idade: {candidatoInfo.idade} anos</p>}
      {candidatoInfo?.sexo && <p>Sexo: {candidatoInfo.sexo}</p>}
      
      {/* Aqui você pode adicionar histórico de simulações */}
    </div>
  )
}
```

## Exemplo 6: Gerenciar Cursos (Admin)

```jsx
import { useState } from 'react'
import { useCursos } from '@/hooks/useSimulacao'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function GerenciarCursos() {
  const { cadastrarCurso, loading } = useCursos()
  const [formData, setFormData] = useState({
    nome_curso: '',
    grau: 'Bacharelado',
    turno: 'Noturno',
    peso_ct: '1.0',
    peso_ch: '1.0',
    peso_lc: '1.0',
    peso_mt: '1.0',
    peso_redacao: '1.0',
    nota_maxima: '1000',
    nota_minima: '600',
    // Instituição
    nome_instituicao: '',
    sigla: '',
    localizacao_campus: '',
    modalidade: 'Presencial'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dadosCurso = {
      curso: {
        nome_curso: formData.nome_curso,
        grau: formData.grau,
        turno: formData.turno,
        peso_ct: parseFloat(formData.peso_ct),
        peso_ch: parseFloat(formData.peso_ch),
        peso_lc: parseFloat(formData.peso_lc),
        peso_mt: parseFloat(formData.peso_mt),
        peso_redacao: parseFloat(formData.peso_redacao),
        nota_maxima: parseFloat(formData.nota_maxima),
        nota_minima: parseFloat(formData.nota_minima)
      },
      instituicao: {
        nome: formData.nome_instituicao,
        sigla: formData.sigla,
        localizacao_campus: formData.localizacao_campus,
        modalidade: formData.modalidade
      }
    }

    try {
      await cadastrarCurso(dadosCurso)
      alert('Curso cadastrado com sucesso!')
      // Limpar formulário
    } catch (err) {
      alert('Erro ao cadastrar curso: ' + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar Novo Curso</h2>
      
      <Input
        placeholder="Nome do Curso"
        value={formData.nome_curso}
        onChange={(e) => setFormData({ ...formData, nome_curso: e.target.value })}
        required
      />
      
      {/* Adicionar mais campos conforme necessário */}
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar Curso'}
      </Button>
    </form>
  )
}
```

## Variáveis de Ambiente

Para usar a API real, configure no arquivo `.env`:

```env
VITE_USE_REAL_API=true
VITE_API_URL=http://localhost:8000
```

Se `VITE_USE_REAL_API` não estiver definida ou for `false`, a aplicação usará o Supabase (modo padrão).
