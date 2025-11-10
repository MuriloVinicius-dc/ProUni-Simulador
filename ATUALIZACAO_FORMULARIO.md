# Atualização do Formulário de Simulação

## 📋 Resumo

O formulário do frontend foi completamente atualizado para corresponder exatamente ao schema esperado pelo backend API.

## 🔄 Mudanças Realizadas

### 1. Estrutura de Dados

**Antes (flat structure):**
```javascript
{
  nota_ct: 750,
  nota_ch: 680,
  nota_lc: 720,
  nota_mt: 690,
  nota_redacao: 800,
  modalidade: "Ampla Concorrência",
  instituicao: "UFPE",
  nome_curso: "Engenharia Civil",
  grau: "Bacharelado",
  turno: "Integral"
}
```

**Depois (nested structure - conforme backend):**
```javascript
{
  nota: {
    nota_ct: 750,
    nota_ch: 680,
    nota_lc: 720,
    nota_mt: 690,
    nota_redacao: 800,
    modalidade_concorrencia: "Ampla Concorrência"
  },
  instituicao: {
    nome: "Universidade Federal de Pernambuco",
    sigla: "UFPE",
    localizacao_campus: "Recife - PE"
  },
  curso: {
    nome_curso: "Engenharia Civil",
    grau: "Bacharelado",
    turno: "Integral"
  }
}
```

### 2. Campos Atualizados

#### FormularioSimulacao (`src/components/simulacao/FormularioSimulacao/index.jsx`)

**Campos adicionados:**
- `instituicao_nome` - Nome completo da instituição (obrigatório pelo backend)
- `instituicao_sigla` - Sigla da instituição (anteriormente `instituicao`)

**Campos renomeados:**
- `modalidade` → `modalidade_concorrencia` (dentro de `nota`)

**Campos aproveitados:**
- `estado` + `municipio` → `localizacao_campus` (concatenados como "Município - UF")

**Nova constante INSTITUICOES:**
```javascript
const INSTITUICOES = [
  { sigla: "UFPE", nome: "Universidade Federal de Pernambuco" },
  { sigla: "UFRPE", nome: "Universidade Federal Rural de Pernambuco" },
  // ... 28 instituições com sigla e nome completo
];
```

### 3. Validação Atualizada

A função `validateForm()` agora valida:
- ✅ Todas as 5 notas (0-1000)
- ✅ `modalidade_concorrencia` (obrigatória)
- ✅ `instituicao_sigla` (obrigatória, derivando `instituicao_nome`)
- ✅ `nome_curso` (obrigatória)
- ✅ `grau` (obrigatória)
- ✅ `turno` (obrigatória)

### 4. Lógica de Submissão

A função `handleSubmit()` agora formata os dados em 3 objetos aninhados:

```javascript
const dadosFormatados = {
  nota: {
    nota_ct: parseFloat(formData.nota_ct),
    nota_ch: parseFloat(formData.nota_ch),
    nota_lc: parseFloat(formData.nota_lc),
    nota_mt: parseFloat(formData.nota_mt),
    nota_redacao: parseFloat(formData.nota_redacao),
    modalidade_concorrencia: formData.modalidade_concorrencia,
  },
  instituicao: {
    nome: formData.instituicao_nome,
    sigla: formData.instituicao_sigla,
    localizacao_campus: formData.estado && formData.municipio 
      ? `${formData.municipio} - ${formData.estado}` 
      : formData.estado || null,
  },
  curso: {
    nome_curso: formData.nome_curso,
    grau: formData.grau || null,
    turno: formData.turno || null,
  }
};
```

### 5. Página de Simulação Atualizada

**Arquivo:** `src/pages/Simulacao/index.jsx`

**Mudanças:**
- `calcularResultado()` agora acessa `dados.nota.nota_lc` etc. (estrutura aninhada)
- `handleSubmitFormulario()` reestrutura o resultado para compatibilidade com componentes de UI
- Adicionado campo `notaMinima` (mock de 600 pontos)

## 🎯 Correspondência com Backend Schema

### DadosComplementaresRequest (Backend)
```python
class DadosComplementaresRequest(BaseModel):
    nota: NotaCreate
    instituicao: InstituicaoCreate
    curso: CursoDadosInteresse
```

### NotaCreate
```python
class NotaCreate(BaseModel):
    nota_ct: float (0-1000)          ✅
    nota_ch: float (0-1000)          ✅
    nota_lc: float (0-1000)          ✅
    nota_mt: float (0-1000)          ✅
    nota_redacao: float (0-1000)     ✅
    modalidade_concorrencia: str     ✅
```

### InstituicaoCreate
```python
class InstituicaoCreate(BaseModel):
    nome: str (max 100 chars)                    ✅
    sigla: str (max 10 chars)                    ✅
    localizacao_campus: Optional[str]            ✅
    modalidade: Optional[str]                    ⚠️ (não usado no form)
```

### CursoDadosInteresse
```python
class CursoDadosInteresse(BaseModel):
    nome_curso: str (max 100 chars)    ✅
    grau: Optional[str]                ✅
    turno: Optional[str]               ✅
```

## 🧪 Como Testar

1. **Iniciar o backend:**
   ```powershell
   cd Backend
   venv\Scripts\Activate.ps1
   uvicorn main:app --reload
   ```

2. **Iniciar o frontend:**
   ```powershell
   npm run dev
   ```

3. **Criar um candidato e fazer login:**
   - Acessar `/cadastro`
   - Preencher nome, email, senha
   - Login em `/login`

4. **Preencher o formulário de simulação:**
   - Acessar `/simulacao`
   - Preencher todas as notas (0-1000)
   - Selecionar instituição (ex: UFPE - Universidade Federal de Pernambuco)
   - Selecionar curso (ex: Engenharia Civil)
   - Selecionar grau (Bacharelado/Licenciatura)
   - Selecionar turno (Matutino/Vespertino/Noturno/Integral)
   - Selecionar modalidade de concorrência (Cota/Ampla Concorrência)
   - Opcional: Estado e município

5. **Verificar o envio:**
   - Abrir DevTools (F12) → Network
   - Submeter o formulário
   - Verificar payload do POST para `/formulario/{candidato_id}`

## ⚠️ Notas Importantes

1. **Campo `modalidade` da instituição:** Não está sendo coletado no formulário (opcional no schema)
2. **Localização:** Os campos `estado` e `municipio` são concatenados em `localizacao_campus`
3. **Validação de notas:** Todas as notas devem estar entre 0 e 1000
4. **Instituições:** Lista hardcoded com 28 universidades federais e estaduais

## 📁 Arquivos Modificados

- ✅ `src/components/simulacao/FormularioSimulacao/index.jsx`
- ✅ `src/pages/Simulacao/index.jsx`

## 🚀 Próximos Passos

1. **Integrar com backend real:** Substituir mock de `calcularResultado()` por chamada ao endpoint `/resultado/{candidato_id}`
2. **Adicionar loading states:** Durante submissão do formulário
3. **Melhorar validação:** Adicionar validação server-side com mensagens de erro do backend
4. **Cache de instituições/cursos:** Buscar lista de instituições/cursos dinamicamente do backend
5. **Autocompletar município:** Carregar municípios do estado selecionado (API IBGE ou backend)

## ✅ Checklist de Conformidade

- [x] Estrutura de dados aninhada (nota/instituicao/curso)
- [x] Campo `modalidade_concorrencia` dentro de `nota`
- [x] Campo `nome` obrigatório em instituição
- [x] Campo `sigla` em instituição
- [x] Campo `localizacao_campus` opcional (gerado de estado+município)
- [x] Todas as 5 notas validadas (0-1000)
- [x] Campos opcionais com valores `null` quando vazios
- [x] Select de instituições mostra sigla + nome completo
- [x] Validação de campos obrigatórios
- [x] Conversão de strings para float nas notas
