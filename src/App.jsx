import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout";
import Dashboard from "./pages/Dashboard";
import SimulacaoPage from "./pages/Simulacao";

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/Dashboard" replace />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Simulacao" element={<SimulacaoPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
