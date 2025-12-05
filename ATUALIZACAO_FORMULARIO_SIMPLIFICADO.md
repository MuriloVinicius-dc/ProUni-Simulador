# Atualização: Formulário Simplificado com Dados Essenciais

## Data: 2025-12-04

## Objetivo
Simplificar o formulário de simulação para coletar **apenas** os dados essenciais que o modelo de IA necessita para realizar a análise.

## Mudanças Implementadas

### 1. Campos Essenciais do Modelo

O formulário agora coleta **APENAS** os seguintes dados:

#### Perfil do Candidato
- **idade** (número, 14-100)
- **sexo** (Masculino | Feminino)
- **raca_beneficiario** (Branca | Preta | Parda | Amarela | Indígena)
- **pcd** (sim | não) - Pessoa com Deficiência

#### Localização
- **regiao_beneficiario** (Norte | Nordeste | Centro-Oeste | Sudeste | Sul)

#### Curso Pretendido
- **nome_instituicao** (lista de instituições)
- **nome_curso** (lista de cursos populares)
- **nome_turno** (Matutino | Vespertino | Noturno | Integral)
- **modalidade_ensino** (Presencial | EAD)
- **modalidade_concorrencia** (Ampla concorrência | L1 | L2 | L5 | L6 | L9 | L10 | L13 | L14)

### 2. Campos Removidos

Foram **removidos** os seguintes campos que não são essenciais para o modelo:

- ❌ Notas ENEM (nota_lc, nota_mt, nota_ch, nota_ct, nota_redacao)
- ❌ Data de nascimento (substituído por idade direta)
- ❌ Estado (UF)
- ❌ Município
- ❌ Grau do curso
- ❌ Localização do campus
- ❌ Outros campos demográficos não essenciais

### 3. Estrutura de Dados de Saída

O formulário agora envia os dados no seguinte formato:

```javascript
{
  idade: 18,
  modalidade_concorrencia: "Ampla concorrência",
  pcd: false,
  sexo: "Feminino",
  raca_beneficiario: "Parda",
  regiao_beneficiario: "Nordeste",
  modalidade_ensino: "Presencial",
  nome_turno: "Matutino",
  nome_curso: "Engenharia Civil",
  nome_instituicao: "Universidade Federal de Pernambuco"
}
```

### 4. Integração com Backend

#### Modo API (USE_REAL_API=true)
```javascript
const resultadoIA = await simulacaoService.analisarCandidato({
  idade: dados.idade,
  modalidade_concorrencia: dados.modalidade_concorrencia,
  pcd: dados.pcd,
  sexo: dados.sexo,
  raca_beneficiario: dados.raca_beneficiario,
  regiao_beneficiario: dados.regiao_beneficiario,
  modalidade_ensino: dados.modalidade_ensino,
  nome_turno: dados.nome_turno,
  nome_curso: dados.nome_curso,
  nome_instituicao: dados.nome_instituicao,
});
```

#### Modo Local/Demo
- Gera resultado simulado baseado em probabilidade aleatória
- Não requer backend

### 5. Arquivos Modificados

1. **`src/components/simulacao/FormularioSimulacao/index.jsx`**
   - Reescrito completamente
   - 3 seções: Perfil do Candidato, Região do Beneficiário, Curso Pretendido
   - Validações simplificadas
   - Interface limpa e objetiva

2. **`src/pages/Simulacao/index.jsx`**
   - Função `processarSimulacaoComAPI()` atualizada
   - Função `processarSimulacaoLocal()` simplificada
   - Função `calcularResultado()` removida (não necessária)

### 6. Modalidades de Concorrência Suportadas

- Ampla concorrência
- L1 - Renda ≤ 1,5 SM + Escola Pública
- L2 - PPI + Renda ≤ 1,5 SM + Escola Pública
- L5 - Escola Pública (independente de renda)
- L6 - PPI + Escola Pública (independente de renda)
- L9 - PCD + Renda ≤ 1,5 SM + Escola Pública
- L10 - PCD + PPI + Renda ≤ 1,5 SM + Escola Pública
- L13 - PCD + Escola Pública (independente de renda)
- L14 - PCD + PPI + Escola Pública (independente de renda)

## Próximos Passos

### Backend (API)
1. Criar endpoint `POST /api/simulacao/analisar-candidato`
2. Implementar modelo de IA que recebe esses 10 parâmetros
3. Retornar resposta no formato:
```json
{
  "classificacao": "Bolsa Integral" | "Bolsa Parcial" | "Não Elegível",
  "probabilidade": 85.5,
  "mensagem": "Descrição do resultado"
}
```

### Frontend (Próximas Melhorias)
1. Atualizar componente `ResultadoSimulacao` para exibir os novos dados
2. Adicionar gráficos de probabilidade
3. Implementar feedback visual baseado na classificação
4. Melhorar mensagens de erro e validação

## Testes Recomendados

1. ✅ Testar validação de todos os campos obrigatórios
2. ✅ Testar envio do formulário com dados válidos
3. ✅ Testar processamento no modo local (sem API)
4. ⏳ Testar integração com API quando disponível
5. ⏳ Testar diferentes combinações de modalidades de concorrência

## Observações

- O formulário está **totalmente funcional** sem o backend
- A integração com API está **preparada** mas precisa do endpoint backend
- Interface **responsiva** e compatível com dark mode
- Validações **robustas** no frontend

## Referências

- Dados essenciais baseados no modelo de IA documentado
- Modalidades de concorrência conforme Lei nº 12.711/2012 (Lei de Cotas)
- Interface seguindo padrões do projeto ProUni-Simulador
