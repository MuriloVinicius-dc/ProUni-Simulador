import React from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, GraduationCap, MapPin, User, Users, BookOpen, CalendarDays, AlertCircle } from "lucide-react";

export default function ResultadoSimulacao({ resultado, onNovaSimulacao }) {
  const {
    classificacao,
    mensagem,
    idade,
    sexo,
    raca,
    pcd,
    regiao,
    nome_curso,
    turno,
    modalidade_ensino,
    modalidade_concorrencia,
    instituicao,
  } = resultado;

  const isBolsaIntegral = classificacao === "Bolsa Integral";

  return (
    <>
      <CardHeader className="text-center pb-6">
        <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
          isBolsaIntegral 
            ? "bg-gradient-to-r from-green-500 to-emerald-600" 
            : "bg-gradient-to-r from-blue-500 to-indigo-600"
        }`}>
          <Award className="w-10 h-10 text-white" />
        </div>
        <CardTitle className={`text-3xl font-bold mb-4 ${
          isBolsaIntegral  ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"
        }`}>
          {classificacao} {isBolsaIntegral ? "100%" : "50%"}
        </CardTitle>
        <p className="text-slate-600 dark:text-slate-300 text-lg">
          {mensagem}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Informações do Curso */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg space-y-4">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Informações do Curso
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Curso</p>
              <p className="font-semibold text-slate-700 dark:text-slate-200">{nome_curso}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Instituição</p>
              <p className="font-semibold text-slate-700 dark:text-slate-200">{instituicao}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Turno</p>
              <p className="font-semibold text-slate-700 dark:text-slate-200">{turno}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Modalidade de Ensino</p>
              <p className="font-semibold text-slate-700 dark:text-slate-200">{modalidade_ensino}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">Modalidade de Concorrência</p>
              <p className="font-semibold text-slate-700 dark:text-slate-200">{modalidade_concorrencia}</p>
            </div>
          </div>
        </div>

        {/* Seu Perfil */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg space-y-4">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Seu Perfil
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Idade</p>
              <p className="font-semibold text-slate-700 dark:text-slate-200">{idade} anos</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sexo</p>
              <p className="font-semibold text-slate-700 dark:text-slate-200">{sexo}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Raça/Cor</p>
              <p className="font-semibold text-slate-700 dark:text-slate-200">{raca}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Região</p>
              <p className="font-semibold text-slate-700 dark:text-slate-200">{regiao}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">Pessoa com Deficiência</p>
              <p className="font-semibold text-slate-700 dark:text-slate-200">{pcd ? "Sim" : "Não"}</p>
            </div>
          </div>
        </div>

        {/* Informação sobre Acurácia do Modelo */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="font-semibold text-amber-900 dark:text-amber-200">Informação importante</p>
            <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
              Nosso modelo tem uma taxa de acurácia de <strong>73%</strong>, portanto este resultado é uma previsão e não deve ser considerado como uma garantia absoluta.
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            onClick={onNovaSimulacao}
            size="lg"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Nova Simulação
          </Button>
        </div>
      </CardContent>
    </>
  );
}