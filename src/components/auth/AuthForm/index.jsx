import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import styles from './styles.module.css'

export function AuthForm({ 
  mode = 'login', 
  onSubmit, 
  loading = false,
  error = null 
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nome, setNome] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (mode === 'signup' && password !== confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }

    const data = { email, password }
    if (mode === 'signup' && nome) {
      data.metadata = { full_name: nome }
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && (
        <div className={styles.errorAlert}>
          {error}
        </div>
      )}

      {mode === 'signup' && (
        <div className={styles.field}>
          <Label htmlFor="nome" className={styles.label}>
            Nome completo
          </Label>
          <Input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome completo"
            className={styles.input}
            required
          />
        </div>
      )}

      <div className={styles.field}>
        <Label htmlFor="email" className={styles.label}>
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.field}>
        <Label htmlFor="password" className={styles.label}>
          Senha
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          minLength={6}
          className={styles.input}
          required
        />
      </div>

      {mode === 'signup' && (
        <div className={styles.field}>
          <Label htmlFor="confirmPassword" className={styles.label}>
            Confirmar senha
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
            className={styles.input}
            required
          />
        </div>
      )}

      <Button 
        type="submit" 
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? (
          <span className={styles.loadingContent}>
            <span className={styles.spinner}></span>
            {mode === 'login' ? 'Entrando...' : 'Cadastrando...'}
          </span>
        ) : (
          mode === 'login' ? 'Entrar' : 'Criar conta'
        )}
      </Button>
    </form>
  )
}
