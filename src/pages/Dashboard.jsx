import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Users, TrendingUp, BookOpen } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-indigo-600/5" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Baseado em dados oficiais ProUni 2017
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Verifique sua bolsa
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> ProUni</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
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
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-blue-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">2M+</h3>
                  <p className="text-slate-600">Bolsas concedidas</p>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Milhões de estudantes já foram beneficiados pelo ProUni desde sua criação.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">85%</h3>
                  <p className="text-slate-600">Taxa de sucesso</p>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Alta precisão na nossa análise baseada em dados históricos do programa.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">500+</h3>
                  <p className="text-slate-600">Cursos disponíveis</p>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Ampla variedade de cursos superiores em diversas áreas do conhecimento.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Pronto para descobrir suas chances?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            O processo é rápido, gratuito e totalmente confidencial.
          </p>
          <Link to={createPageUrl("Simulacao")}>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-6 text-lg font-semibold rounded-2xl transition-all duration-200"
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