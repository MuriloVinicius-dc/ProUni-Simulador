import React from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Database, CheckCircle } from "lucide-react";

export default function ProcessamentoSimulacao({ dados }) {
  const [progresso, setProgresso] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgresso(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const etapas = [
    { id: 1, nome: "Validando dados", icon: CheckCircle, concluida: progresso > 20 },
    { id: 2, nome: "Consultando base ProUni 2017", icon: Database, concluida: progresso > 50 },
    { id: 3, nome: "Calculando probabilidade", icon: BarChart3, concluida: progresso > 80 }
  ];

  return (
    <>
      <CardHeader className="text-center pb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="text-2xl text-slate-900 dark:text-slate-100 mb-4">
          Analisando seu perfil
        </CardTitle>
        <p className="text-slate-600 dark:text-slate-300">
          Estamos comparando seus dados com milhares de casos do ProUni...
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progresso da análise</span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{Math.round(progresso)}%</span>
          </div>
          <Progress value={progresso} className="h-3" />
        </div>

        <div className="space-y-6">
          {etapas.map((etapa) => (
            <div key={etapa.id} className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                etapa.concluida 
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
              }`}>
                <etapa.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className={`font-medium transition-all duration-500 ${
                  etapa.concluida ? "text-green-700 dark:text-green-400" : "text-slate-600 dark:text-slate-400"
                }`}>
                  {etapa.nome}
                </p>
              </div>
              {etapa.concluida && (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              )}
            </div>
          ))}
        </div>

        
      </CardContent>
    </>
  );
}