import React, { useState } from "react";
import { Simulacao } from "@/entities/Simulacao";
import { simulacaoService } from "@/services";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FormularioSimulacao, ResultadoSimulacao, ProcessamentoSimulacao } from "@/components/simulacao";

// Verifica se deve usar a API FastAPI real
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true'

export default function SimulacaoPage() {
  const { user } = useAuth();
  const [etapa, setEtapa] = useState("formulario"); // formulario, processamento, resultado
  const [dadosSimulacao, setDadosSimulacao] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const handleSubmitFormulario = async (dados) => {
    console.log('📝 Formulário submetido:', dados);
    setDadosSimulacao(dados);
    setEtapa("processamento");
    setErro(null);

    try {
      console.log('🔍 USE_REAL_API:', USE_REAL_API);
      console.log('👤 User:', user);
      
      if (USE_REAL_API) {
        // Modo API: sempre usa a API direta agora
        console.log('✅ Usando API FastAPI');
        await processarSimulacaoComAPI(dados);
      } else {
        // Modo local/Supabase: calcula no frontend
        console.log('✅ Usando processamento local');
        await processarSimulacaoLocal(dados);
      }
    } catch (error) {
      console.error('❌ Erro ao processar simulação:', error);
      setErro(error.message || 'Erro ao processar simulação. Tente novamente.');
      setEtapa("formulario");
    }
  };

  // Processamento via API FastAPI
  const processarSimulacaoComAPI = async (dados) => {
    try {
      console.log('🔄 Iniciando processamento com API...', dados);
      
      // Aguarda 1.5s para efeito visual de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Envia os dados do formulário ao backend para análise do modelo
      const resultadoIA = await simulacaoService.analisarCandidato({
        idade: dados.idade,
        modalidade_concorrencia: dados.modalidade_concorrencia,
        pcd: dados.pcd,
        sexo: dados.sexo,
        raca_beneficiario: dados.raca_beneficiario,
        regiao_beneficiario: dados.regiao_beneficiario,
        modalidade_ensino: dados.modalidade_ensino,
        nome_turno: dados.nome_turno,
        nome_curso: dados.nome_curso,
        nome_instituicao: dados.nome_instituicao,
      });

      console.log('✅ Resultado da API:', resultadoIA);

      const novoResultado = {
        // Dados do candidato
        idade: dados.idade,
        sexo: dados.sexo,
        raca: dados.raca_beneficiario,
        pcd: dados.pcd,
        regiao: dados.regiao_beneficiario,
        // Dados do curso
        nome_curso: dados.nome_curso,
        turno: dados.nome_turno,
        modalidade_ensino: dados.modalidade_ensino,
        modalidade_concorrencia: dados.modalidade_concorrencia,
        // Dados da instituição
        instituicao: dados.nome_instituicao,
        // Resultados da IA
        classificacao: resultadoIA.classificacao || "Não Elegível",
        probabilidade: resultadoIA.probabilidade || 0,
        mensagem: resultadoIA.mensagem || "Resultado da análise do modelo de IA",
        selecionado: resultadoIA.classificacao && resultadoIA.classificacao !== "Não Elegível",
      };

      // Persiste localmente (opcional, para histórico)
      await Simulacao.create({
        ...novoResultado,
        resultado_elegivel: novoResultado.selecionado,
        pontuacao_calculada: novoResultado.probabilidade,
      });

      console.log('📊 Resultado final:', novoResultado);
      setResultado(novoResultado);
      setEtapa("resultado");
    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      alert(`Erro ao processar simulação: ${error.message}`);
      setEtapa("formulario");
    }
  };

  // Processamento local (modo Supabase/Demo)
  const processarSimulacaoLocal = async (dados) => {
    try {
      console.log('🔄 Iniciando processamento local...', dados);
      
      // Aguarda 3s para efeito visual de processamento
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulação simples baseada em regras
      const probabilidadeMock = Math.random() * 100;
      const selecionado = probabilidadeMock > 50;
      
      const novoResultado = {
        // Dados do candidato
        idade: dados.idade,
        sexo: dados.sexo,
        raca: dados.raca_beneficiario,
        pcd: dados.pcd,
        regiao: dados.regiao_beneficiario,
        // Dados do curso
        nome_curso: dados.nome_curso,
        turno: dados.nome_turno,
        modalidade_ensino: dados.modalidade_ensino,
        modalidade_concorrencia: dados.modalidade_concorrencia,
        // Dados da instituição
        instituicao: dados.nome_instituicao,
        // Resultados simulados
        classificacao: selecionado ? "Bolsa Integral" : "Não Elegível",
        probabilidade: probabilidadeMock.toFixed(2),
        mensagem: selecionado 
          ? "Com base no seu perfil, você tem boas chances de conseguir uma bolsa!" 
          : "Seu perfil não atende aos critérios mínimos para esta simulação.",
        selecionado,
      };

      // Salvar no banco (opcional)
      await Simulacao.create({
        ...novoResultado,
        resultado_elegivel: selecionado,
        pontuacao_calculada: probabilidadeMock,
      });
      
      console.log('📊 Resultado local:', novoResultado);
      setResultado(novoResultado);
      setEtapa("resultado");
    } catch (error) {
      console.error('❌ Erro no processamento local:', error);
      alert(`Erro ao processar simulação: ${error.message}`);
      setEtapa("formulario");
    }
  };

  const reiniciarSimulacao = () => {
    setEtapa("formulario");
    setDadosSimulacao(null);
    setResultado(null);
    setErro(null);
  };

  return (
    <div className="min-h-screen py-8 px-6">
      {console.log('🎨 Renderizando página - Etapa:', etapa, 'Erro:', erro, 'Resultado:', resultado)}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" className="mb-4 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {etapa === "formulario" && "Preencha seus dados para análise"}
              {etapa === "processamento" && "Analisando seu perfil"}
              {etapa === "resultado" && "Resultado da Análise"}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {etapa === "formulario" && "Informe seus dados acadêmicos e pessoais para verificarmos sua elegibilidade"}
              {etapa === "processamento" && "Estamos comparando seu perfil com dados históricos do ProUni"}
              {etapa === "resultado" && "Informe seus dados acadêmicos e pessoais para verificarmos sua elegibilidade"}
            </p>
          </div>
        </div>

        {/* Mensagem de erro */}
        {erro && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-center">{erro}</p>
          </div>
        )}

        {/* Conteúdo baseado na etapa */}
        <Card className="border-0 shadow-2xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm dark:shadow-black/50 dark:ring-1 dark:ring-slate-800/50">
          {etapa === "formulario" && (
            <FormularioSimulacao onSubmit={handleSubmitFormulario} />
          )}
          
          {etapa === "processamento" && (
            <ProcessamentoSimulacao dados={dadosSimulacao} />
          )}
          
          {etapa === "resultado" && (
            <ResultadoSimulacao 
              resultado={resultado} 
              onNovaSimulacao={reiniciarSimulacao}
            />
          )}
        </Card>
      </div>
    </div>
  );
}