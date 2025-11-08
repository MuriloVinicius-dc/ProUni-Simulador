/**
 * Exemplos de uso da API FastAPI
 * Execute este arquivo no console do navegador para testar
 */

import { authService } from './services/authService'
import { simulacaoService } from './services/simulacaoService'

// ==================== AUTENTICAÇÃO ====================

// 1. Criar um novo candidato (Cadastro)
async function exemploCadastro() {
  try {
    const novoCandidato = await authService.cadastrar({
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      senha: 'senha123',
      idade: 22,
      sexo: 'M'
    })
    console.log('✅ Candidato criado:', novoCandidato)
    return novoCandidato
  } catch (error) {
    console.error('❌ Erro no cadastro:', error.message)
  }
}

// 2. Fazer login
async function exemploLogin() {
  try {
    const resultado = await authService.login(
      'joao.silva@email.com',
      'senha123'
    )
    console.log('✅ Login bem-sucedido:', resultado)
    return resultado.candidato
  } catch (error) {
    console.error('❌ Erro no login:', error.message)
  }
}

// 3. Buscar dados do candidato
async function exemploBuscarCandidato(candidatoId) {
  try {
    const candidato = await authService.getCandidato(candidatoId)
    console.log('✅ Candidato encontrado:', candidato)
    return candidato
  } catch (error) {
    console.error('❌ Erro ao buscar candidato:', error.message)
  }
}

// 4. Atualizar dados do candidato
async function exemploAtualizarCandidato(candidatoId) {
  try {
    const candidatoAtualizado = await authService.atualizarCandidato(
      candidatoId,
      {
        nome: 'João Silva Santos',
        email: 'joao.silva@email.com',
        idade: 23,
        sexo: 'M'
      }
    )
    console.log('✅ Candidato atualizado:', candidatoAtualizado)
    return candidatoAtualizado
  } catch (error) {
    console.error('❌ Erro ao atualizar:', error.message)
  }
}

// ==================== SIMULAÇÃO ====================

// 5. Criar simulação completa
async function exemploSimulacaoCompleta() {
  try {
    const simulacao = {
      nome: 'Maria Santos',
      email: 'maria.santos@email.com',
      senha: 'senha123',
      idade: 20,
      sexo: 'F',
      nota: {
        nota_ct: 720,
        nota_ch: 680,
        nota_lc: 750,
        nota_mt: 690,
        nota_redacao: 850
      },
      instituicao: {
        nome: 'Universidade Federal de São Paulo',
        sigla: 'UNIFESP',
        localizacao_campus: 'São Paulo - SP'
      },
      curso: {
        nome_curso: 'Engenharia de Software',
        grau: 'Bacharelado',
        modalidade: 'Ampla Concorrência',
        nota_maxima: 900,
        nota_minima: 650
      },
      inscricao: {
        ano_sisu: 2024,
        modalidade: 'Ampla Concorrência'
      }
    }

    const resultado = await simulacaoService.criarSimulacaoCompleta(simulacao)
    console.log('✅ Simulação criada:', resultado)
    return resultado
  } catch (error) {
    console.error('❌ Erro na simulação:', error.message)
  }
}

// 6. Listar candidatos aprovados em um curso
async function exemploListarAprovados(cursoId = 1) {
  try {
    const aprovados = await simulacaoService.getAprovados(cursoId)
    console.log(`✅ Aprovados no curso ${cursoId}:`, aprovados)
    return aprovados
  } catch (error) {
    console.error('❌ Erro ao listar aprovados:', error.message)
  }
}

// 7. Listar todos os candidatos
async function exemploListarCandidatos() {
  try {
    const candidatos = await simulacaoService.listarCandidatos(0, 10)
    console.log('✅ Candidatos cadastrados:', candidatos)
    return candidatos
  } catch (error) {
    console.error('❌ Erro ao listar candidatos:', error.message)
  }
}

// ==================== TESTE COMPLETO ====================

async function testeCompleto() {
  console.log('🧪 Iniciando testes da API...\n')

  // 1. Cadastro
  console.log('1️⃣ Testando cadastro...')
  const candidato = await exemploCadastro()
  if (!candidato) return

  // 2. Login
  console.log('\n2️⃣ Testando login...')
  const loginResult = await exemploLogin()
  if (!loginResult) return

  // 3. Buscar candidato
  console.log('\n3️⃣ Buscando dados do candidato...')
  await exemploBuscarCandidato(candidato.ID)

  // 4. Atualizar candidato
  console.log('\n4️⃣ Atualizando candidato...')
  await exemploAtualizarCandidato(candidato.ID)

  // 5. Criar simulação
  console.log('\n5️⃣ Criando simulação completa...')
  await exemploSimulacaoCompleta()

  // 6. Listar aprovados
  console.log('\n6️⃣ Listando aprovados...')
  await exemploListarAprovados(1)

  // 7. Listar todos candidatos
  console.log('\n7️⃣ Listando todos os candidatos...')
  await exemploListarCandidatos()

  console.log('\n✅ Testes concluídos!')
}

// Exportar funções para uso no console
window.apiExemplos = {
  exemploCadastro,
  exemploLogin,
  exemploBuscarCandidato,
  exemploAtualizarCandidato,
  exemploSimulacaoCompleta,
  exemploListarAprovados,
  exemploListarCandidatos,
  testeCompleto
}

console.log(`
📚 Exemplos de API disponíveis no console:

// Cadastro
await apiExemplos.exemploCadastro()

// Login
await apiExemplos.exemploLogin()

// Buscar candidato
await apiExemplos.exemploBuscarCandidato(1)

// Atualizar candidato
await apiExemplos.exemploAtualizarCandidato(1)

// Criar simulação completa
await apiExemplos.exemploSimulacaoCompleta()

// Listar aprovados em curso
await apiExemplos.exemploListarAprovados(1)

// Listar todos candidatos
await apiExemplos.exemploListarCandidatos()

// Teste completo
await apiExemplos.testeCompleto()
`)
