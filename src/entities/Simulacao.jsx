import { supabase, isDemo } from '@/lib/supabase'

// Entity class for Simulacao
// Persiste dados no Supabase; em DEMO MODE usa localStorage

export class Simulacao {
  static async create(data) {
    try {
      if (isDemo) {
        const simulacoes = JSON.parse(localStorage.getItem('simulacoes') || '[]')
        const novaSimulacao = {
          id: Date.now(),
          ...data,
          created_at: new Date().toISOString(),
        }
        simulacoes.push(novaSimulacao)
        localStorage.setItem('simulacoes', JSON.stringify(simulacoes))
        return novaSimulacao
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('Usuário não autenticado')

      const { data: simulacao, error } = await supabase
        .from('simulacoes')
        .insert([
          { user_id: user.id, ...data }
        ])
        .select()
        .single()
      if (error) throw error
      return simulacao
    } catch (error) {
      console.error('Erro ao salvar simulação:', error)
      throw error
    }
  }

  static async findAll() {
    try {
      if (isDemo) {
        return JSON.parse(localStorage.getItem('simulacoes') || '[]')
      }
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('Usuário não autenticado')

      const { data: simulacoes, error } = await supabase
        .from('simulacoes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return simulacoes || []
    } catch (error) {
      console.error('Erro ao buscar simulações:', error)
      return []
    }
  }

  static async findById(id) {
    try {
      if (isDemo) {
        const simulacoes = JSON.parse(localStorage.getItem('simulacoes') || '[]')
        return simulacoes.find(s => s.id === id) || null
      }
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('Usuário não autenticado')

      const { data: simulacao, error } = await supabase
        .from('simulacoes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()
      if (error) throw error
      return simulacao
    } catch (error) {
      console.error('Erro ao buscar simulação:', error)
      return null
    }
  }

  static async delete(id) {
    try {
      if (isDemo) {
        const simulacoes = JSON.parse(localStorage.getItem('simulacoes') || '[]')
        const restante = simulacoes.filter(s => s.id !== id)
        localStorage.setItem('simulacoes', JSON.stringify(restante))
        return true
      }
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('simulacoes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
      if (error) throw error
      return true
    } catch (error) {
      console.error('Erro ao deletar simulação:', error)
      throw error
    }
  }
}

