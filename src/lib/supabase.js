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
  
  // Mock user para demo mode
  const createMockUser = (email) => ({
    id: 'demo-user-' + Date.now(),
    email,
    user_metadata: { nome: email.split('@')[0] },
    created_at: new Date().toISOString(),
  })
  
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      // Retorna sucesso com usuário mockado ao invés de throw
      signInWithPassword: async ({ email }) => {
        const user = createMockUser(email)
        return { 
          data: { 
            user, 
            session: { user, access_token: 'demo-token', refresh_token: 'demo-refresh' }
          }, 
          error: null 
        }
      },
      signUp: async ({ email }) => {
        const user = createMockUser(email)
        return { 
          data: { 
            user, 
            session: { user, access_token: 'demo-token', refresh_token: 'demo-refresh' }
          }, 
          error: null 
        }
      },
      signInWithOAuth: async () => {
        // OAuth em modo demo apenas retorna erro sem throw
        return { 
          data: null, 
          error: new Error('DEMO_MODE: OAuth não disponível em modo demonstração') 
        }
      },
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ 
        data: null, 
        error: new Error('DEMO_MODE: reset de senha não disponível em modo demonstração') 
      }),
      updateUser: async () => ({ 
        data: null, 
        error: new Error('DEMO_MODE: atualização de usuário não disponível em modo demonstração') 
      }),
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
