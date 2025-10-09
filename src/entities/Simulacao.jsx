// Mock Entity class for Simulacao
// In a real application, this would connect to a backend API

export class Simulacao {
  static async create(data) {
    // Simulate API call
    console.log("Saving simulacao data:", data);
    
    // Store in localStorage for demo purposes
    try {
      const simulacoes = JSON.parse(localStorage.getItem("simulacoes") || "[]");
      const novaSimulacao = {
        id: Date.now(),
        ...data,
        created_at: new Date().toISOString()
      };
      simulacoes.push(novaSimulacao);
      localStorage.setItem("simulacoes", JSON.stringify(simulacoes));
      return novaSimulacao;
    } catch (error) {
      console.error("Error saving simulacao:", error);
      throw error;
    }
  }

  static async findAll() {
    // Get all simulations from localStorage
    try {
      const simulacoes = JSON.parse(localStorage.getItem("simulacoes") || "[]");
      return simulacoes;
    } catch (error) {
      console.error("Error fetching simulacoes:", error);
      return [];
    }
  }

  static async findById(id) {
    try {
      const simulacoes = JSON.parse(localStorage.getItem("simulacoes") || "[]");
      return simulacoes.find(s => s.id === id);
    } catch (error) {
      console.error("Error fetching simulacao:", error);
      return null;
    }
  }
}
