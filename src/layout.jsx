import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { GraduationCap, BarChart3, Home } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", icon: Home, url: createPageUrl("Dashboard") },
    { name: "Simulação", icon: BarChart3, url: createPageUrl("Simulacao") }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header fixo minimalista */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">ProUni Simulador</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Descubra sua elegibilidade</p>
              </div>
            </div>
            
            <nav className="flex items-center gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    location.pathname === item.url
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:block font-medium text-sm">{item.name}</span>
                </Link>
              ))}
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
}