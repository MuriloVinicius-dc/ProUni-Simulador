import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isDemo = !supabaseUrl || !supabaseAnonKey

if (isDemo) {
  // Não bloquear a UI: apenas avisar no console para o modo demo
  // eslint-disable-next-line no-console
  console.warn(
    'Executando em DEMO MODE: variáveis VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY ausentes.\n' +
    'As telas funcionarão para visualização; ações de login/salvar usarão mocks/localStorage.'
  )
}

// Mock minimalista para rodar sem backend
const createMockSupabase = () => {
  const mockChain = {
    insert: async () => ({ data: null, error: new Error('DEMO_MODE: sem backend') }),
    select: () => mockChain,
    single: () => mockChain,
    eq: () => mockChain,
    order: () => mockChain,
    delete: async () => ({ error: new Error('DEMO_MODE: sem backend') }),
  }
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      // Lançamos erros amigáveis para deixar claro que é demo
      signInWithPassword: async () => { throw new Error('DEMO_MODE: backend de autenticação não configurado') },
      signUp: async () => { throw new Error('DEMO_MODE: backend de autenticação não configurado') },
      signInWithOAuth: async () => { throw new Error('DEMO_MODE: backend de autenticação não configurado') },
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => { throw new Error('DEMO_MODE: backend de autenticação não configurado') },
      updateUser: async () => { throw new Error('DEMO_MODE: backend de autenticação não configurado') },
    },
    from: () => mockChain,
  }
}

export const supabase = isDemo
  ? createMockSupabase()
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'prouni-auth-token',
        storage: window.localStorage,
      },
    })

// Configuração de autenticação
export const authConfig = {
  redirectTo: window.location.origin + '/#/Dashboard',
}
