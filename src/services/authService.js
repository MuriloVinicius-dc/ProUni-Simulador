/**
 * Serviço de autenticação usando a API FastAPI
 */
import { api } from '@/lib/api'

export const authService = {
  /**
   * Faz login com email e senha
   * @param {string} email 
   * @param {string} senha 
   * @returns {Promise<{access_status: string, candidato: Object}>}
   */
  async login(email, senha) {
    const response = await api.post('/login', { email, senha })
    return response
  },

  /**
   * Cria um novo candidato (cadastro)
   * @param {Object} candidatoData - { nome, email, senha, idade?, sexo? }
   * @returns {Promise<Object>} - Candidato criado
   */
  async cadastrar(candidatoData) {
    // FastAPI endpoint for creating a candidate is POST /cadastro
    const response = await api.post('/cadastro', candidatoData)
    return response
  },

  /**
   * Busca dados do candidato por ID
   * @param {number} candidatoId 
   * @returns {Promise<Object>}
   */
  async getCandidato(candidatoId) {
    const response = await api.get(`/candidatos/${candidatoId}`)
    return response
  },

  /**
   * Atualiza dados do candidato
   * @param {number} candidatoId 
   * @param {Object} candidatoData - { nome, email, idade?, sexo? }
   * @returns {Promise<Object>}
   */
  async atualizarCandidato(candidatoId, candidatoData) {
    const response = await api.put(`/candidatos/${candidatoId}`, candidatoData)
    return response
  },

  /**
   * Deleta um candidato
   * @param {number} candidatoId 
   * @returns {Promise<null>}
   */
  async deletarCandidato(candidatoId) {
    const response = await api.delete(`/candidatos/${candidatoId}`)
    return response
  }
}
