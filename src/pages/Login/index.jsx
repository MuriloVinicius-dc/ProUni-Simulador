import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { AuthForm, SocialLoginButton } from '@/components/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { GraduationCap } from 'lucide-react'
import { createPageUrl } from '@/utils'
import styles from './styles.module.css'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(null)

  const from = location.state?.from?.pathname || '/Dashboard'

  const handleLogin = async ({ email, password }) => {
    try {
      setError(null)
      setLoading(true)
      const result = await signIn(email, password)
      
      // Se retornar sucesso, navega
      if (result?.user) {
        navigate(from, { replace: true })
      }
    } catch (error) {
      console.error('Erro no login:', error)
      if (error.message.includes('Invalid login credentials')) {
        setError('E-mail ou senha incorretos')
      } else if (error.message.includes('Email not confirmed')) {
        setError('Por favor, confirme seu e-mail antes de fazer login')
      } else {
        setError('Erro ao fazer login. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setError(null)
      setGoogleLoading(true)
      await signInWithGoogle()
      // Se chegar aqui sem erro, navegue (OAuth geralmente redireciona)
    } catch (error) {
      console.error('Erro no login com Google:', error)
      if (error.message?.includes('DEMO_MODE') || error.message?.includes('OAuth não disponível')) {
        setError('🔧 Modo demonstração ativo. Login com Google não disponível sem configuração do Supabase.')
      } else {
        setError('Erro ao conectar com Google. Tente novamente.')
      }
      setGoogleLoading(false)
    }
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
            <CardTitle className={styles.cardTitle}>Bem-vindo de volta</CardTitle>
            <CardDescription className={styles.cardDescription}>
              Entre com sua conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <AuthForm
              mode="login"
              onSubmit={handleLogin}
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
              onClick={handleGoogleLogin}
              loading={googleLoading}
            />

            <div className={styles.signupPrompt}>
              <span className={styles.signupText}>Não tem uma conta? </span>
              <Link to={createPageUrl('Cadastro')} className={styles.signupLink}>
                Criar conta
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className={styles.footer}>
          Ao continuar, você concorda com nossos termos de uso
        </p>
      </div>
    </div>
  )
}
