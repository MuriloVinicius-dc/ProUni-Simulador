import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout";
import Dashboard from "./pages/Dashboard";
import SimulacaoPage from "./pages/Simulacao";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/Dashboard" replace />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Simulacao" element={<SimulacaoPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
