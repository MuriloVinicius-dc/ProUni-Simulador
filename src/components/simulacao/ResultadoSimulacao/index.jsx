import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Award } from "lucide-react";

export default function ResultadoSimulacao({ resultado, onNovaSimulacao }) {
  const {
    selecionado,
    nome_instituicao,
    sigla_instituicao,
    nome_curso,
    grau,
    turno,
    modalidade,
    ingresso,
    posicao,
    vagas,
    mediaEnem,
    nota_maxima,
    nota_minima,
    link_instituicao,
  } = resultado;

  return (
    <CardContent className="pt-8">
      <div className="bg-blue-600 text-white text-center py-3 rounded-t-lg">
        <h2 className="text-xl font-bold">{nome_instituicao} {sigla_instituicao}</h2>
      </div>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-b-lg shadow-md mb-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{nome_curso}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">Grau</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200">{grau || "N/A"}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Turno</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200">{turno || "N/A"}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Modalidade</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200">{modalidade}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Ingresso</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200">{ingresso}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-slate-800/50 p-8 rounded-lg text-center">
        {selecionado ? (
          <>
            <Award className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">Parabéns</p>
            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
              VOCÊ FOI SELECIONADO NA
            </h4>
            <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">CHAMADA REGULAR</p>
          </>
        ) : (
          <>
            <X className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h4 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
              Você não foi selecionado na
            </h4>
            <p className="text-xl font-semibold text-red-600 dark:text-red-400">chamada regular</p>
          </>
        )}

        <p className="text-slate-600 dark:text-slate-300 mt-4">
          {posicao}º de {vagas} vagas para ampla concorrência
        </p>

        <div className="mt-6 text-slate-500 dark:text-slate-400">
          <p>Sua nota foi: {mediaEnem.toFixed(2)}</p>
          <p>Nota mínima: {nota_minima}</p>
        </div>
      </div>

      <div className="text-center mt-8">
        <Button
          onClick={onNovaSimulacao}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-base"
        >
          Nova Análise
        </Button>
      </div>
    </CardContent>
  );
}