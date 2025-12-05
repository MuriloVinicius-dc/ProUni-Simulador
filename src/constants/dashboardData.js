// Dados derivados da análise do ProUni 2017

// Top 5 Universidades por volume de bolsas
export const TOP_UNIVERSITIES = [
  { name: 'UNOPAR', value: 25000, color: '#005c9e' },
  { name: 'ESTÁCIO', value: 21000, color: '#0072bc' },
  { name: 'UNIP', value: 18000, color: '#0088da' },
  { name: 'UNINOVE', value: 15000, color: '#009ef8' },
  { name: 'UNINTER', value: 12000, color: '#3fb5ff' },
];

// Distribuição por Modalidade (EAD vs Presencial)
export const MODALITY_DISTRIBUTION = [
  { name: 'Presencial', value: 45, color: '#009b3a' },
  { name: 'EAD', value: 55, color: '#f4cb05' },
];

// Distribuição por Raça
export const RACE_DISTRIBUTION = [
  { name: 'Parda', value: 46, color: '#8D6E63' },
  { name: 'Branca', value: 38, color: '#D7CCC8' },
  { name: 'Preta', value: 13, color: '#3E2723' },
  { name: 'Amarela', value: 2, color: '#FFECB3' },
  { name: 'Indígena', value: 1, color: '#A1887F' },
];

// Distribuição por Área de Conhecimento
export const AREA_DISTRIBUTION = [
  { name: 'Negócios e Sociais', value: 35, color: '#E91E63' },
  { name: 'Humanas e Educação', value: 30, color: '#9C27B0' },
  { name: 'Exatas e Tec.', value: 20, color: '#2196F3' },
  { name: 'Saúde', value: 15, color: '#4CAF50' },
];

// Performance dos modelos de ML (acurácia em %)
export const MODEL_ACCURACY = [
  { name: 'KNN', value: 68 },
  { name: 'Regressão Logística', value: 72 },
  { name: 'Random Forest', value: 78 },
  { name: 'Neural Network', value: 81 },
];
