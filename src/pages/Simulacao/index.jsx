import React, { useState } from "react";
import { Simulacao } from "@/entities/Simulacao";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FormularioSimulacao, ResultadoSimulacao, ProcessamentoSimulacao } from "@/components/simulacao";

export default function SimulacaoPage() {
  const [etapa, setEtapa] = useState("formulario"); // formulario, processamento, resultado
  const [dadosSimulacao, setDadosSimulacao] = useState(null);
  const [resultado, setResultado] = useState(null);

  const handleSubmitFormulario = async (dados) => {
    setDadosSimulacao(dados);
    setEtapa("processamento");

    setTimeout(async () => {
      const { mediaEnem, selecionado, posicao, vagas, notaMinima } = calcularResultado(dados);
      
      const novoResultado = {
        // Dados do curso
        nome_curso: dados.curso.nome_curso,
        grau: dados.curso.grau,
        turno: dados.curso.turno,
        // Dados da instituição
        instituicao: dados.instituicao.sigla,
        instituicao_nome: dados.instituicao.nome,
        localizacao_campus: dados.instituicao.localizacao_campus,
        // Dados da nota
        modalidade: dados.nota.modalidade_concorrencia,
        nota_lc: dados.nota.nota_lc,
        nota_mt: dados.nota.nota_mt,
        nota_ch: dados.nota.nota_ch,
        nota_ct: dados.nota.nota_ct,
        nota_redacao: dados.nota.nota_redacao,
        // Resultados calculados
        mediaEnem,
        selecionado,
        posicao,
        vagas,
        nota_minima: notaMinima,
        // Hardcoded para o layout
        ingresso: "1º Semestre", 
        link_instituicao: "#",
      };

      // Salvar no banco (opcional, mantendo a estrutura)
      await Simulacao.create({
        ...novoResultado,
        resultado_elegivel: selecionado,
        pontuacao_calculada: mediaEnem,
      });
      
      setResultado(novoResultado);
      setEtapa("resultado");
    }, 3000);
  };

  const calcularResultado = (dados) => {
    // Dados agora vêm na estrutura: { nota: {...}, instituicao: {...}, curso: {...} }
    const mediaEnem = (
      dados.nota.nota_lc +
      dados.nota.nota_mt +
      dados.nota.nota_ch +
      dados.nota.nota_ct +
      dados.nota.nota_redacao
    ) / 5;

    // Mock de nota mínima (em produção viria do backend)
    const notaMinima = 600;
    const selecionado = mediaEnem >= notaMinima;
    const vagas = 10; // Mock
    let posicao;

    if (selecionado) {
      // Se selecionado, gera uma posição dentro do número de vagas
      posicao = Math.floor(Math.random() * vagas) + 1;
    } else {
      // Se não, gera uma posição acima do número de vagas
      posicao = vagas + Math.floor(Math.random() * 10) + 1;
    }
    
    return { mediaEnem, selecionado, posicao, vagas, notaMinima };
  };

  const reiniciarSimulacao = () => {
    setEtapa("formulario");
    setDadosSimulacao(null);
    setResultado(null);
  };

  return (
    <div className="min-h-screen py-8 px-6">
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