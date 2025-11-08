# 🔐 Guia de Configuração de Autenticação

Este guia contém instruções completas para configurar a autenticação no ProUni-Simulador usando Supabase.

## 📋 Índice

1. [Criar Projeto no Supabase](#1-criar-projeto-no-supabase)
2. [Configurar Variáveis de Ambiente](#2-configurar-variáveis-de-ambiente)
3. [Configurar Banco de Dados](#3-configurar-banco-de-dados)
4. [Configurar Google OAuth](#4-configurar-google-oauth)
5. [Testar Autenticação](#5-testar-autenticação)
6. [Segurança e Boas Práticas](#6-segurança-e-boas-práticas)

---

## 1. Criar Projeto no Supabase

### Passo 1.1: Criar conta
1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **"Start your project"**
3. Crie uma conta gratuita usando GitHub ou Google

### Passo 1.2: Criar novo projeto
1. No dashboard, clique em **"New Project"**
2. Preencha os dados:
   - **Name**: `prouni-simulador`
   - **Database Password**: Escolha uma senha forte (anote em local seguro!)
   - **Region**: Selecione a região mais próxima (ex: South America - São Paulo)
3. Clique em **"Create new project"**
4. Aguarde ~2 minutos para o projeto ser criado

### Passo 1.3: Obter credenciais
1. No painel lateral, clique em **⚙️ Settings**
2. Clique em **API**
3. Copie as seguintes informações:
   - **Project URL** (ex: `https://xyzcompany.supabase.co`)
   - **anon/public key** (longa string começando com `eyJ...`)

---

## 2. Configurar Variáveis de Ambiente

### Passo 2.1: Criar arquivo .env
1. Na raiz do projeto, crie um arquivo chamado `.env`
2. Copie o conteúdo de `.env.example`:

```bash
cp .env.example .env
```

### Passo 2.2: Preencher credenciais
Edite o arquivo `.env` e substitua os valores:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_publica_aqui
```

⚠️ **IMPORTANTE**: 
- O arquivo `.env` já está no `.gitignore` e **NÃO deve ser commitado**
- Nunca compartilhe suas chaves em repositórios públicos

---

## 3. Configurar Banco de Dados

### Passo 3.1: Criar tabela de simulações
1. No Supabase, vá em **🗄️ Database** → **SQL Editor**
2. Cole e execute o seguinte SQL:

```sql
-- Criar tabela de simulações
create table public.simulacoes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  
  -- Dados do formulário
  idade integer,
  sexo text,
  raca text,
  estado text,
  municipio text,
  tipo_escola text,
  nota_enem numeric,
  deficiencia boolean default false,
  
  -- Resultado da simulação
  pontuacao_elegibilidade numeric,
  
  -- Metadados
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security (RLS)
alter table public.simulacoes enable row level security;

-- Política: Usuários só podem ver suas próprias simulações
create policy "Usuários podem ver suas simulações"
  on public.simulacoes
  for select
  using (auth.uid() = user_id);

-- Política: Usuários podem criar suas simulações
create policy "Usuários podem criar simulações"
  on public.simulacoes
  for insert
  with check (auth.uid() = user_id);

-- Política: Usuários podem deletar suas simulações
create policy "Usuários podem deletar suas simulações"
  on public.simulacoes
  for delete
  using (auth.uid() = user_id);

-- Criar índices para performance
create index simulacoes_user_id_idx on public.simulacoes(user_id);
create index simulacoes_created_at_idx on public.simulacoes(created_at desc);
```

3. Clique em **"Run"** para executar
4. Verifique se apareceu: ✅ **"Success. No rows returned"**

### Passo 3.2: Verificar tabela criada
1. Vá em **🗄️ Database** → **Tables**
2. Você deve ver a tabela **`simulacoes`** listada

---

## 4. Configurar Google OAuth

### Passo 4.1: Criar projeto no Google Cloud
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto:
   - Nome: `ProUni Simulador`
3. No menu lateral, vá em **APIs & Services** → **Credentials**

### Passo 4.2: Configurar OAuth Consent Screen
1. Clique em **"OAuth consent screen"**
2. Selecione **"External"** → **"Create"**
3. Preencha:
   - **App name**: ProUni Simulador
   - **User support email**: seu email
   - **Developer contact**: seu email
4. Clique em **"Save and Continue"**
5. Em **Scopes**, clique em **"Add or Remove Scopes"**
6. Adicione os escopos:
   - `userinfo.email`
   - `userinfo.profile`
7. Clique em **"Save and Continue"**
8. Em **Test users**, adicione seu email para testar
9. Clique em **"Save and Continue"** → **"Back to Dashboard"**

### Passo 4.3: Criar credenciais OAuth
1. Vá em **Credentials** → **"+ Create Credentials"** → **"OAuth client ID"**
2. Selecione **"Web application"**
3. Preencha:
   - **Name**: ProUni Simulador Web
   - **Authorized JavaScript origins**: 
     - `http://localhost:5173` (desenvolvimento)
     - `https://seu-usuario.github.io` (produção)
   - **Authorized redirect URIs**:
     - `https://seu-projeto.supabase.co/auth/v1/callback`
4. Clique em **"Create"**
5. Copie o **Client ID** e **Client Secret** exibidos

### Passo 4.4: Configurar no Supabase
1. No Supabase, vá em **🔐 Authentication** → **Providers**
2. Encontre **Google** na lista
3. Habilite o toggle ✅
4. Cole as credenciais:
   - **Client ID**: (do Google Cloud)
   - **Client Secret**: (do Google Cloud)
5. Clique em **"Save"**

### Passo 4.5: Atualizar redirect URI no Google
1. Copie a **Callback URL (for OAuth)** mostrada no Supabase
2. Volte ao Google Cloud Console
3. Edite suas credenciais OAuth
4. Adicione a URL de callback do Supabase em **Authorized redirect URIs**
5. Salve

---

## 5. Testar Autenticação

### Passo 5.1: Iniciar aplicação
```bash
npm run dev
```

### Passo 5.2: Testar cadastro com email
1. Acesse `http://localhost:5173/#/Cadastro`
2. Preencha:
   - Nome completo
   - E-mail
   - Senha (mínimo 6 caracteres)
   - Confirmar senha
3. Clique em **"Criar conta"**
4. Verifique seu email para confirmação
5. Clique no link de confirmação

### Passo 5.3: Testar login com email
1. Acesse `http://localhost:5173/#/Login`
2. Preencha email e senha
3. Clique em **"Entrar"**
4. Você deve ser redirecionado para o Dashboard

### Passo 5.4: Testar login com Google
1. Acesse `http://localhost:5173/#/Login`
2. Clique em **"Continuar com Google"**
3. Selecione sua conta Google
4. Autorize o aplicativo
5. Você deve ser redirecionado para o Dashboard

### Passo 5.5: Testar simulação
1. Vá em **Simulação**
2. Preencha o formulário
3. Clique em **"Calcular Elegibilidade"**
4. Aguarde o processamento
5. Verifique o resultado

### Passo 5.6: Verificar dados no Supabase
1. No Supabase, vá em **🗄️ Database** → **Tables** → **simulacoes**
2. Você deve ver a simulação salva
3. Vá em **🔐 Authentication** → **Users**
4. Você deve ver seu usuário listado

---

## 6. Segurança e Boas Práticas

### ✅ O que já está configurado

#### Row Level Security (RLS)
- ✅ Cada usuário só acessa suas próprias simulações
- ✅ Impossível ver dados de outros usuários
- ✅ Proteção a nível de banco de dados

#### Autenticação Segura
- ✅ Senhas criptografadas automaticamente
- ✅ Tokens JWT com expiração
- ✅ Refresh tokens automáticos
- ✅ Sessões persistentes e seguras

#### Variáveis de Ambiente
- ✅ Credenciais fora do código-fonte
- ✅ `.env` no `.gitignore`
- ✅ Chaves nunca expostas no repositório

### 🔒 Recomendações Adicionais

#### Para Produção
1. **Email Personalizado**:
   - Configure SMTP próprio em **Settings** → **Auth** → **SMTP Settings**
   - Use serviços como SendGrid, Mailgun, ou AWS SES

2. **Domínio Personalizado**:
   - Configure um domínio próprio
   - Atualize redirect URIs no Google OAuth
   - Configure HTTPS obrigatório

3. **Rate Limiting**:
   - Supabase já inclui proteção contra ataques
   - Configure limites adicionais se necessário

4. **Monitoramento**:
   - Ative logs em **Logs** no Supabase
   - Configure alertas para atividades suspeitas

#### Segurança do Frontend
1. **Nunca expor Service Role Key**:
   - Use apenas `anon/public` key no frontend
   - Service Role bypassa RLS (use apenas no backend)

2. **Validação de Dados**:
   - Sempre valide no frontend E no backend
   - Não confie apenas em validação client-side

3. **HTTPS Obrigatório**:
   - Em produção, sempre use HTTPS
   - GitHub Pages já fornece HTTPS automaticamente

---

## 🚀 Deploy em Produção

### GitHub Pages

1. **Atualizar base URL**:
   - Já configurado em `vite.config.js`
   - `base: "/ProUni-Simulador/"`

2. **Adicionar variáveis de ambiente no GitHub**:
   - Vá em **Settings** → **Secrets and variables** → **Actions**
   - Adicione os secrets:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

3. **Atualizar workflow** (`.github/workflows/deploy.yml`):
```yaml
- name: Build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
  run: npm run build
```

4. **Atualizar Google OAuth**:
   - Adicione a URL do GitHub Pages em **Authorized JavaScript origins**
   - Adicione a callback URL do Supabase em **Authorized redirect URIs**

5. **Push para main**:
```bash
git add .
git commit -m "feat: adicionar autenticação com Supabase e Google OAuth"
git push origin main
```

---

## 🆘 Troubleshooting

### Erro: "Invalid login credentials"
- ✅ Verifique se o email foi confirmado
- ✅ Confirme que a senha está correta
- ✅ Tente resetar a senha

### Erro: "Email not confirmed"
- ✅ Verifique a caixa de spam
- ✅ Reenvie o email de confirmação no Supabase
- ✅ Configure SMTP personalizado se necessário

### Google OAuth não funciona
- ✅ Verifique se as URLs estão corretas no Google Cloud
- ✅ Confirme que o Client ID/Secret estão corretos no Supabase
- ✅ Verifique se o projeto está em modo de teste (limite de 100 usuários)
- ✅ Publique o app OAuth para remover limite

### Simulações não salvam
- ✅ Verifique se a tabela foi criada corretamente
- ✅ Confirme que as políticas RLS estão ativas
- ✅ Veja os logs de erro no console do navegador
- ✅ Verifique os logs no Supabase

### Variáveis de ambiente não carregam
- ✅ Arquivo `.env` deve estar na raiz do projeto
- ✅ Reinicie o servidor de desenvolvimento
- ✅ Variáveis devem começar com `VITE_`
- ✅ Não use aspas nos valores

---

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## 🎉 Pronto!

Se você seguiu todos os passos, seu sistema de autenticação está:
- ✅ Funcionando localmente
- ✅ Seguro com RLS
- ✅ Suportando email/senha
- ✅ Suportando Google OAuth
- ✅ Pronto para deploy em produção

**Próximos passos**:
1. Personalize o design das páginas de login/cadastro
2. Adicione mais provedores OAuth (Facebook, GitHub, etc.)
3. Implemente recuperação de senha
4. Configure email transacional personalizado
5. Deploy em produção!
