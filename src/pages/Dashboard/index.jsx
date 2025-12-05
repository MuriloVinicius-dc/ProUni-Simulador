import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Users, TrendingUp, BookOpen, BarChart3, PieChart as PieIcon, Activity, Info } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  TOP_UNIVERSITIES, 
  MODALITY_DISTRIBUTION, 
  RACE_DISTRIBUTION,
  MODEL_ACCURACY
} from "@/constants/dashboardData";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-indigo-600/5 dark:from-blue-400/5 dark:to-indigo-400/5" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Baseado em dados oficiais ProUni 2017
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
            Verifique sua bolsa
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"> ProUni</span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Descubra em poucos minutos se você tem o perfil para conseguir uma bolsa de estudos no ProUni. 
            Nossa análise usa dados reais do programa.
          </p>
          
          <Link to={createPageUrl("Simulacao")}>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Verificar minha elegibilidade
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          
          <div className="mt-12 flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-0 shadow-lg bg-white/60 dark:bg-slate-900/70 backdrop-blur-sm dark:shadow-black/50 dark:ring-1 dark:ring-slate-800/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/60 rounded-xl flex items-center justify-center dark:ring-1 dark:ring-blue-800/30">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">2M+</h3>
                  <p className="text-slate-600 dark:text-slate-300">Bolsas concedidas</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Milhões de estudantes já foram beneficiados pelo ProUni desde sua criação.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg bg-white/60 dark:bg-slate-900/70 backdrop-blur-sm dark:shadow-black/50 dark:ring-1 dark:ring-slate-800/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-950/60 rounded-xl flex items-center justify-center dark:ring-1 dark:ring-green-800/30">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">85%</h3>
                  <p className="text-slate-600 dark:text-slate-300">Taxa de sucesso</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Alta precisão na nossa análise baseada em dados históricos do programa.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg bg-white/60 dark:bg-slate-900/70 backdrop-blur-sm dark:shadow-black/50 dark:ring-1 dark:ring-slate-800/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/60 rounded-xl flex items-center justify-center dark:ring-1 dark:ring-purple-800/30">
                  <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">500+</h3>
                  <p className="text-slate-600 dark:text-slate-300">Cursos disponíveis</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ampla variedade de cursos superiores em diversas áreas do conhecimento.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Visualizations Section */}
      <section className="py-16 px-6 bg-slate-50/50 dark:bg-slate-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Estatísticas do ProUni
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Análise baseada nos dados oficiais do ProUni 2017
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top Universities */}
            <Card className="p-6 border-0 shadow-lg bg-white dark:bg-slate-900 dark:shadow-black/50 dark:ring-1 dark:ring-slate-800/50">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Top Universidades (Volume de Bolsas)
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={TOP_UNIVERSITIES} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: 'currentColor'}} className="text-slate-600 dark:text-slate-400" />
                    <RechartsTooltip 
                      contentStyle={{
                        backgroundColor: 'rgb(15 23 42)',
                        border: '1px solid rgb(51 65 85)',
                        borderRadius: '8px',
                        color: 'rgb(226 232 240)'
                      }}
                    />
                    <Bar dataKey="value" fill="#005c9e" radius={[0, 4, 4, 0]} barSize={20}>
                      {TOP_UNIVERSITIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Modality Distribution */}
            <Card className="p-6 border-0 shadow-lg bg-white dark:bg-slate-900 dark:shadow-black/50 dark:ring-1 dark:ring-slate-800/50">
              <div className="flex items-center gap-2 mb-4">
                <PieIcon className="text-green-600 dark:text-green-400 w-5 h-5" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Distribuição: EAD vs Presencial
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MODALITY_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {MODALITY_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{
                        backgroundColor: 'rgb(15 23 42)',
                        border: '1px solid rgb(51 65 85)',
                        borderRadius: '8px',
                        color: 'rgb(226 232 240)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Race Distribution */}
            <Card className="p-6 border-0 shadow-lg bg-white dark:bg-slate-900 dark:shadow-black/50 dark:ring-1 dark:ring-slate-800/50">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-orange-500 dark:text-orange-400 w-5 h-5" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Distribuição por Raça
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={RACE_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {RACE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right" 
                      wrapperStyle={{fontSize: '12px'}}
                      formatter={(value) => <span className="text-slate-700 dark:text-slate-300">{value}</span>}
                    />
                    <RechartsTooltip 
                      contentStyle={{
                        backgroundColor: 'rgb(15 23 42)',
                        border: '1px solid rgb(51 65 85)',
                        borderRadius: '8px',
                        color: 'rgb(226 232 240)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Model Performance */}
            <Card className="p-6 border-0 shadow-lg bg-white dark:bg-slate-900 dark:shadow-black/50 dark:ring-1 dark:ring-slate-800/50">
              <div className="flex items-center gap-2 mb-4">
                <Info className="text-purple-600 dark:text-purple-400 w-5 h-5" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Performance dos Modelos (Acurácia)
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MODEL_ACCURACY}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
                    <XAxis dataKey="name" tick={{fontSize: 10, fill: 'currentColor'}} className="text-slate-600 dark:text-slate-400" />
                    <YAxis domain={[0, 100]} tick={{fill: 'currentColor'}} className="text-slate-600 dark:text-slate-400" />
                    <RechartsTooltip 
                      contentStyle={{
                        backgroundColor: 'rgb(15 23 42)',
                        border: '1px solid rgb(51 65 85)',
                        borderRadius: '8px',
                        color: 'rgb(226 232 240)'
                      }}
                    />
                    <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                      <Cell fill="#9CA3AF" />
                      <Cell fill="#9CA3AF" />
                      <Cell fill="#9CA3AF" />
                      <Cell fill="#7C3AED" /> {/* Highlight NN */}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs mt-2 text-center" style={{ color: 'rgb(124, 58, 237)' }}>
                A Rede Neural (MLP) obteve o melhor resultado com 81% de acurácia.
              </p>
            </Card>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Pronto para descobrir suas chances?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10">
            O processo é rápido, gratuito e totalmente confidencial.
          </p>
          <Link to={createPageUrl("Simulacao")}>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-1000 hover:border-blue-1000 hover:text-white dark:hover:bg-blue-1000 dark:hover:border-blue-900 px-8 py-6 text-lg font-semibold rounded-2xl transition-all duration-200"
            >
              Começar simulação
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}