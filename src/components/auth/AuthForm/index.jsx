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
  const [idade, setIdade] = useState('')
  const [sexo, setSexo] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (mode === 'signup' && password !== confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }

    // Build payload expected by AuthContext.signUp: { email, password, metadata }
    const data = { email, password }

    if (mode === 'signup') {
      const metadata = {
        nome: nome || email.split('@')[0],
        // convert idade to number when possible
        ...(idade !== '' ? { idade: Number(idade) } : {}),
        ...(sexo ? { sexo } : {}),
      }

      data.metadata = metadata
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

      {mode === 'signup' && (
        <div className={styles.row}>
          <div className={styles.field}>
            <Label htmlFor="idade" className={styles.label}>
              Idade
            </Label>
            <Input
              id="idade"
              type="number"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              placeholder="Ex: 25"
              min={15}
              max={120}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor="sexo" className={styles.label}>
              Sexo
            </Label>
            <select
              id="sexo"
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              className={`flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none ${styles.input} ${styles.select}`}
              aria-label="Sexo"
            >
              <option value="">Prefiro não informar</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
          </div>
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
