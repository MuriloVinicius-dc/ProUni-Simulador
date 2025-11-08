import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth";
import Layout from "./layout";
import { Login, Cadastro, Dashboard, Simulacao } from "@/pages";

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/Login" element={<Login />} />
          <Route path="/Cadastro" element={<Cadastro />} />

          {/* Rotas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/Dashboard" replace />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Simulacao" element={<Simulacao />} />
          </Route>
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
