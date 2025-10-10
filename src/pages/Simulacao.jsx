import React, { useState } from "react";
import { Simulacao } from "@/entities/Simulacao";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import FormularioSimulacao from "@/components/simulacao/FormularioSimulacao";
import ResultadoSimulacao from "@/components/simulacao/ResultadoSimulacao";
import ProcessamentoSimulacao from "@/components/simulacao/ProcessamentoSimulacao";

export default function SimulacaoPage() {
  const [etapa, setEtapa] = useState("formulario"); // formulario, processamento, resultado
  const [dadosSimulacao, setDadosSimulacao] = useState(null);
  const [resultado, setResultado] = useState(null);

  const handleSubmitFormulario = async (dados) => {
    setDadosSimulacao(dados);
    setEtapa("processamento");
    
    // Simular processamento
    setTimeout(async () => {
      const pontuacao = calcularElegibilidade(dados);
      const elegivel = pontuacao >= 60;
      
      const novoResultado = {
        ...dados,
        resultado_elegivel: elegivel,
        pontuacao_calculada: pontuacao
      };

      // Salvar no banco
      await Simulacao.create(novoResultado);
      
      setResultado(novoResultado);
      setEtapa("resultado");
    }, 3000);
  };

  const calcularElegibilidade = (dados) => {
    let pontuacao = 0;

    // Critério renda (peso alto)
    const salarioMinimo = 1212; // valor aproximado de 2017
    const rendaPerCapita = dados.renda_familiar / (dados.membros_familia || 4);
    
    if (rendaPerCapita <= salarioMinimo * 1.5) {
      pontuacao += 30;
    } else if (rendaPerCapita <= salarioMinimo * 3) {
      pontuacao += 20;
    }

    // Critério nota ENEM
    if (dados.nota_enem >= 600) {
      pontuacao += 25;
    } else if (dados.nota_enem >= 500) {
      pontuacao += 15;
    } else if (dados.nota_enem >= 450) {
      pontuacao += 10;
    }

    // Critério escola pública
    if (dados.tipo_escola === "Publica") {
      pontuacao += 20;
    }

    // Critério idade (jovens têm preferência)
    if (dados.idade <= 25) {
      pontuacao += 10;
    }

    // Critério pessoa com deficiência
    if (dados.pessoa_deficiencia) {
      pontuacao += 15;
    }

    return Math.min(pontuacao, 100);
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
              {etapa === "resultado" && "Resultado da sua simulação"}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {etapa === "formulario" && "Informe seus dados acadêmicos e pessoais para verificarmos sua elegibilidade"}
              {etapa === "processamento" && "Estamos comparando seu perfil com dados históricos do ProUni"}
              {etapa === "resultado" && "Confira o resultado da análise baseada em dados oficiais"}
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