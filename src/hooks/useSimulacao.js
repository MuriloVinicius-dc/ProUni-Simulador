/**
 * Hook customizado para gerenciar o fluxo de simulação
 */
import { useState } from 'react'
import { simulacaoService, cursoService } from '@/services'

export const useSimulacao = (candidatoId) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [resultado, setResultado] = useState(null)

  /**
   * Preenche o formulário de simulação
   */
  const preencherFormulario = async (dadosFormulario) => {
    if (!candidatoId) {
      throw new Error('ID do candidato não fornecido')
    }

    setLoading(true)
    setError(null)

    try {
      const response = await simulacaoService.preencherFormulario(
        candidatoId,
        dadosFormulario
      )
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Obtém o resultado da simulação
   */
  const obterResultado = async () => {
    if (!candidatoId) {
      throw new Error('ID do candidato não fornecido')
    }

    setLoading(true)
    setError(null)

    try {
      const result = await simulacaoService.getResultado(candidatoId)
      setResultado(result)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Executa o fluxo completo: preencher formulário e obter resultado
   */
  const executarSimulacao = async (dadosFormulario) => {
    await preencherFormulario(dadosFormulario)
    return await obterResultado()
  }

  /**
   * Limpa o resultado atual
   */
  const limparResultado = () => {
    setResultado(null)
    setError(null)
  }

  return {
    loading,
    error,
    resultado,
    preencherFormulario,
    obterResultado,
    executarSimulacao,
    limparResultado,
  }
}

/**
 * Hook customizado para gerenciar cursos
 */
export const useCursos = () => {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Carrega a lista de cursos
   */
  const carregarCursos = async (skip = 0, limit = 100) => {
    setLoading(true)
    setError(null)

    try {
      const data = await cursoService.listarCursos(skip, limit)
      setCursos(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Busca um curso específico
   */
  const buscarCurso = async (cursoId) => {
    setLoading(true)
    setError(null)

    try {
      const curso = await cursoService.getCurso(cursoId)
      return curso
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Cadastra um novo curso
   */
  const cadastrarCurso = async (dadosCurso) => {
    setLoading(true)
    setError(null)

    try {
      const novoCurso = await cursoService.cadastrarCurso(dadosCurso)
      // Adiciona o novo curso à lista
      setCursos((prev) => [...prev, novoCurso])
      return novoCurso
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    cursos,
    loading,
    error,
    carregarCursos,
    buscarCurso,
    cadastrarCurso,
  }
}
