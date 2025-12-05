/**
 * Serviço de simulação usando a API FastAPI
 */
import { api } from '@/lib/api'

export const simulacaoService = {
  /**
   * Preenche dados complementares do candidato (notas, curso, instituição)
   * @param {number} candidatoId 
   * @param {Object} dadosComplementares - { nota, instituicao, curso }
   * @returns {Promise<Object>}
   */
  async preencherFormulario(candidatoId, dadosComplementares) {
    const response = await api.post(`/formulario/${candidatoId}`, dadosComplementares)
    return response
  },

  /**
   * Aciona a simulação de classificação de bolsa via IA
   * Coleta todos os dados do candidato e retorna a classificação (Integral/Parcial)
   * @param {number} candidatoId 
   * @returns {Promise<{classificacao_bolsa: string, mensagem: string, curso: string}>}
   */
  async simularClassificacao(candidatoId) {
    const response = await api.get(`/simular/${candidatoId}`)
    return response
  },

  /**
   * Calcula e retorna o resultado da simulação para um candidato
   * @param {number} candidatoId 
   * @returns {Promise<{aprovado: boolean, mensagem: string, nota_candidato: float, nota_minima_corte: float, curso: string, diferenca: float}>}
   */
  async getResultado(candidatoId) {
    const response = await api.get(`/resultados/${candidatoId}`)
    return response
  },

  /**
   * Cria dados em lote (teste)
   * @param {Object} loteData - { candidatos: Array<CandidatoCompleto> }
   * @returns {Promise<Object>}
   */
  async criarLote(loteData) {
    const response = await api.post('/dados/lote/', loteData)
    return response
  },

  /**
   * Busca todos os candidatos (admin/teste)
   * @param {number} skip 
   * @param {number} limit 
   * @returns {Promise<Array>}
   */
  async listarCandidatos(skip = 0, limit = 100) {
    const response = await api.get(`/candidatos/?skip=${skip}&limit=${limit}`)
    return response
  }
}
