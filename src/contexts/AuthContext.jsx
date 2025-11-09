import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { authService } from '@/services/authService'

const AuthContext = createContext({})

// Verifica se deve usar a API FastAPI real
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Se usa API real, verifica localStorage
    if (USE_REAL_API) {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setSession({ user: userData })
        } catch (e) {
          console.error('Erro ao carregar usuário do localStorage:', e)
        }
      }
      setLoading(false)
      return
    }

    // Caso contrário, usa Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Login com email e senha
  const signIn = async (email, password) => {
    if (USE_REAL_API) {
      // Usa API FastAPI
      const response = await authService.login(email, password)
      
      // A API retorna { access_status: "success", candidato: {...} }
      if (response.access_status === 'success' && response.candidato) {
        const candidato = response.candidato
        const userData = { ...candidato, id: candidato.ID }
        setUser(userData)
        setSession({ user: userData })
        localStorage.setItem('user', JSON.stringify(userData))
        return { user: userData }
      }
      throw new Error('Falha na autenticação')
    }

    // Usa Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  // Cadastro com email e senha
  const signUp = async (email, password, metadata = {}) => {
    if (USE_REAL_API) {
      // Usa API FastAPI
      const candidatoData = {
        email,
        senha: password,
        nome: metadata.nome || email.split('@')[0],
        idade: metadata.idade,
        sexo: metadata.sexo,
      }
      const candidato = await authService.cadastrar(candidatoData)
      return { user: candidato }
    }

    // Usa Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    if (error) throw error
    return data
  }

  // Login com Google
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/#/Dashboard',
      },
    })
    if (error) throw error
    return data
  }

  // Logout
  const signOut = async () => {
    if (USE_REAL_API) {
      // Limpa localStorage
      localStorage.removeItem('user')
      setUser(null)
      setSession(null)
      return
    }

    // Usa Supabase
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Resetar senha
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/#/reset-password',
    })
    if (error) throw error
    return data
  }

  // Atualizar perfil
  const updateProfile = async (updates) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    })
    if (error) throw error
    return data
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
