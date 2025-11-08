/**
 * Serviço de simulação usando a API FastAPI
 */
import { api } from '@/lib/api'

export const simulacaoService = {
  /**
   * Busca lista de candidatos aprovados para um curso
   * @param {number} cursoId 
   * @returns {Promise<Array<{ID, nome, email, nota_final, nota_de_corte}>>}
   */
  async getAprovados(cursoId) {
    const response = await api.get(`/aprovados/${cursoId}`)
    return response
  },

  /**
   * Cria uma simulação completa (candidato + notas + inscrição)
   * @param {Object} simulacaoData - Dados completos da simulação
   * @returns {Promise<Object>}
   */
  async criarSimulacaoCompleta(simulacaoData) {
    // Formato esperado pela API: LoteCandidatos
    const payload = {
      candidatos: [simulacaoData]
    }
    const response = await api.post('/candidatos/lote/', payload)
    return response
  },

  /**
   * Busca todos os candidatos
   * @param {number} skip 
   * @param {number} limit 
   * @returns {Promise<Array>}
   */
  async listarCandidatos(skip = 0, limit = 100) {
    const response = await api.get(`/candidatos/?skip=${skip}&limit=${limit}`)
    return response
  }
}
