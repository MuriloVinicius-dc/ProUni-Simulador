/**
 * Serviço de cursos usando a API FastAPI
 */
import { api } from '@/lib/api'

export const cursoService = {
  /**
   * Lista todos os cursos disponíveis
   * @param {number} skip - Número de registros a pular
   * @param {number} limit - Número máximo de registros
   * @returns {Promise<Array>}
   */
  async listarCursos(skip = 0, limit = 100) {
    const response = await api.get(`/cursos/?skip=${skip}&limit=${limit}`)
    return response
  },

  /**
   * Busca detalhes de um curso específico
   * @param {number} cursoId 
   * @returns {Promise<Object>}
   */
  async getCurso(cursoId) {
    const response = await api.get(`/cursos/${cursoId}`)
    return response
  },

  /**
   * Cadastra um novo curso
   * @param {Object} cursoData - { curso: CursoCreate, instituicao: InstituicaoCreate }
   * @returns {Promise<Object>}
   */
  async cadastrarCurso(cursoData) {
    const response = await api.post('/cursos/', cursoData)
    return response
  }
}
