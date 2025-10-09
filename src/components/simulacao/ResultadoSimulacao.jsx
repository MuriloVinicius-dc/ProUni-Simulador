import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, RotateCcw, ExternalLink, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ResultadoSimulacao({ resultado, onNovaSimulacao }) {
  const isElegivel = resultado.resultado_elegivel;
  const pontuacao = resultado.pontuacao_calculada;

  const getDicas = () => {
    if (isElegivel) {
      return [
        "Mantenha seus documentos atualizados para a inscrição",
        "Fique atento aos prazos do ProUni",
        "Considere também o Fies como alternativa",
        "Verifique as instituições participantes na sua região"
      ];
    } else {
      return [
        "Tente melhorar sua nota do ENEM no próximo exame",
        "Considere bolsas de estudo privadas",
        "Verifique outros programas de financiamento estudantil",
        "Analise cursos técnicos como alternativa inicial"
      ];
    }
  };

  return (
    <>
      <CardHeader className="text-center pb-8">
        <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
          isElegivel 
            ? "bg-green-100" 
            : "bg-orange-100"
        }`}>
          {isElegivel ? (
            <CheckCircle className="w-12 h-12 text-green-600" />
          ) : (
            <AlertCircle className="w-12 h-12 text-orange-600" />
          )}
        </div>
        
        <CardTitle className={`text-3xl mb-4 ${
          isElegivel ? "text-green-700" : "text-orange-700"
        }`}>
          {isElegivel 
            ? "Você tem boas chances!" 
            : "Resultado não favorável"
          }
        </CardTitle>
        
        <p className="text-lg text-slate-600">
          {isElegivel 
            ? "Seu perfil se enquadra nos critérios do ProUni" 
            : "Você não atende todos os critérios necessários"
          }
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Pontuação */}
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold ${
            isElegivel 
              ? "bg-green-100 text-green-800" 
              : "bg-orange-100 text-orange-800"
          }`}>
            <span>Pontuação: {pontuacao}/100</span>
          </div>
        </div>

        {/* Detalhes do resultado */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Análise detalhada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Critério renda:</span>
                <span className={`font-medium ${
                  (resultado.renda_familiar / 4) <= (1212 * 3) ? "text-green-600" : "text-red-600"
                }`}>
                  {(resultado.renda_familiar / 4) <= (1212 * 3) ? "✓ Atendido" : "✗ Não atendido"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Nota ENEM:</span>
                <span className={`font-medium ${
                  resultado.nota_enem >= 450 ? "text-green-600" : "text-red-600"
                }`}>
                  {resultado.nota_enem >= 450 ? "✓ Suficiente" : "✗ Insuficiente"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Escola pública:</span>
                <span className={`font-medium ${
                  resultado.tipo_escola === "Publica" ? "text-green-600" : "text-orange-600"
                }`}>
                  {resultado.tipo_escola === "Publica" ? "✓ Sim" : "○ Privada"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Pessoa com deficiência:</span>
                <span className={`font-medium ${
                  resultado.pessoa_deficiencia ? "text-green-600" : "text-slate-500"
                }`}>
                  {resultado.pessoa_deficiencia ? "✓ Sim" : "○ Não"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dicas */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              {isElegivel ? "Próximos passos" : "Dicas para melhorar"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {getDicas().map((dica, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-slate-700">{dica}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Links úteis */}
        <div className="bg-slate-50 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Links úteis</h3>
          <div className="space-y-3">
            <a
              href="https://prouniportal.mec.gov.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Portal oficial do ProUni
            </a>
            <a
              href="https://enem.inep.gov.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Inscrições do ENEM
            </a>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button
            onClick={onNovaSimulacao}
            variant="outline"
            size="lg"
            className="px-8 py-3"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Refazer análise
          </Button>
          <Link to={createPageUrl("Dashboard")}>
            <Button size="lg" className="w-full sm:w-auto px-8 py-3">
              Voltar ao início
            </Button>
          </Link>
        </div>
      </CardContent>
    </>
  );
}