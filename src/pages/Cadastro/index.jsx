import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { AuthForm, SocialLoginButton } from '@/components/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { GraduationCap, CheckCircle2 } from 'lucide-react'
import { createPageUrl } from '@/utils'
import styles from './styles.module.css'

export default function Cadastro() {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSignUp = async ({ email, password, metadata }) => {
    try {
      setError(null)
      setLoading(true)
      await signUp(email, password, metadata)
      setSuccess(true)
      
      setTimeout(() => {
        navigate(createPageUrl('Login'))
      }, 3000)
    } catch (error) {
      console.error('Erro no cadastro:', error)
      if (error.message.includes('User already registered')) {
        setError('Este e-mail já está cadastrado')
      } else if (error.message.includes('Password should be at least')) {
        setError('A senha deve ter pelo menos 6 caracteres')
      } else if (error.message.includes('DEMO_MODE')) {
        setError('🔧 Modo demonstração: configure o Supabase para cadastro real')
      } else {
        setError('Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      setError(null)
      setGoogleLoading(true)
      await signInWithGoogle()
    } catch (error) {
      console.error('Erro no cadastro com Google:', error)
      if (error.message.includes('DEMO_MODE')) {
        setError('🔧 Modo demonstração: configure o Supabase para usar Google OAuth')
      } else {
        setError('Erro ao conectar com Google. Tente novamente.')
      }
      setGoogleLoading(false)
    }
  }

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.themeToggle}>
          <ThemeToggle />
        </div>

        <div className={styles.wrapper}>
          <Card className={styles.successCard}>
            <CardHeader className={styles.successHeader}>
              <div className={styles.successIconContainer}>
                <CheckCircle2 className="h-9 w-9 text-white" />
              </div>
              <CardTitle className={styles.successTitle}>
                Conta criada com sucesso!
              </CardTitle>
              <CardDescription className={styles.successDescription}>
                Verifique seu e-mail para confirmar sua conta.
                <br />
                <span className={styles.successSubtext}>
                  Redirecionando para o login em instantes...
                </span>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.themeToggle}>
        <ThemeToggle />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <GraduationCap className="w-11 h-11 text-white" />
          </div>
          <h1 className={styles.title}>ProUni Simulador</h1>
          <p className={styles.subtitle}>Descubra sua elegibilidade para o ProUni</p>
        </div>

        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>Crie sua conta</CardTitle>
            <CardDescription className={styles.cardDescription}>
              Comece a simular sua elegibilidade gratuitamente
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <AuthForm
              mode="signup"
              onSubmit={handleSignUp}
              loading={loading}
              error={error}
            />

            <div className={styles.divider}>
              <div className={styles.dividerLine}>
                <span className={styles.dividerBorder} />
              </div>
              <div className={styles.dividerText}>
                <span className={styles.dividerTextSpan}>Ou continue com</span>
              </div>
            </div>

            <SocialLoginButton
              provider="google"
              onClick={handleGoogleSignUp}
              loading={googleLoading}
            />

            <div className={styles.loginPrompt}>
              <span className={styles.loginText}>Já tem uma conta? </span>
              <Link to={createPageUrl('Login')} className={styles.loginLink}>
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className={styles.footer}>
          Ao criar uma conta, você concorda com nossos termos de uso
        </p>
      </div>
    </div>
  )
}
