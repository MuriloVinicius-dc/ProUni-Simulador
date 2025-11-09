# Sistema de Autenticação - ProUni Simulador

## 📝 Resumo das Alterações

Foi implementado um **sistema completo de autenticação** com as seguintes funcionalidades:

### ✅ Recursos Implementados

1. **Autenticação tradicional (Email/Senha)**
   - Login com email e senha
   - Cadastro de novos usuários
   - Confirmação de email
   - Validação de formulários

2. **Autenticação Social (Google OAuth)**
   - Login com conta Google
   - Cadastro com conta Google
   - Integração OAuth 2.0 segura

3. **Proteção de Rotas**
   - Rotas privadas protegidas
   - Redirecionamento automático para login
   - Persistência de sessão

4. **Gerenciamento de Usuário**
   - Exibição de nome/email no header
   - Avatar com iniciais
   - Botão de logout
   - Perfil do usuário

5. **Persistência de Dados Segura**
   - Simulações salvas no Supabase (PostgreSQL)
   - Row Level Security (RLS)
   - Cada usuário vê apenas seus dados
   - Backup e escalabilidade

---

## 📂 Arquivos Criados/Modificados

### **Novos Arquivos**

```
.env.example                              # Template para variáveis de ambiente
src/lib/supabase.js                       # Cliente Supabase configurado
src/contexts/AuthContext.jsx              # Context de autenticação
src/components/auth/
  ├── ProtectedRoute.jsx                  # Componente de proteção de rotas
  ├── AuthForm.jsx                        # Formulário reutilizável de login/cadastro
  └── SocialLoginButton.jsx               # Botão de login social (Google)
src/pages/
  ├── Login.jsx                           # Página de login
  └── Cadastro.jsx                        # Página de cadastro
SETUP_AUTH.md                             # Documentação completa de configuração
```

### **Arquivos Modificados**

```
src/App.jsx                               # Adicionado AuthProvider e rotas públicas/privadas
src/layout.jsx                            # Adicionado menu de usuário e logout
src/entities/Simulacao.jsx                # Migrado de localStorage para Supabase
.gitignore                                # Adicionado .env e outros arquivos sensíveis
```

---

## 🚀 Como Usar

### 1️⃣ Configurar Supabase

Siga o guia completo em **[SETUP_AUTH.md](./SETUP_AUTH.md)** que inclui:

1. Criar projeto no Supabase
2. Copiar credenciais (URL + Anon Key)
3. Criar tabela de simulações
4. Configurar Google OAuth
5. Testar autenticação

### 2️⃣ Criar arquivo .env

Na raiz do projeto, crie um arquivo `.env`:

```bash
cp .env.example .env
```

Edite e preencha com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### 3️⃣ Executar localmente

```bash
npm install
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🔐 Fluxo de Autenticação

### **Primeira vez (Cadastro)**

1. Usuário acessa `/Cadastro`
2. Preenche: Nome, Email, Senha
3. Ou clica em "Continuar com Google"
4. Recebe email de confirmação
5. Clica no link do email
6. Faz login em `/Login`
7. É redirecionado para `/Dashboard`

### **Usuário existente (Login)**

1. Usuário acessa `/Login`
2. Preenche Email e Senha
3. Ou clica em "Continuar com Google"
4. É redirecionado para `/Dashboard`

### **Navegação protegida**

- Tentativa de acessar `/Dashboard` ou `/Simulacao` sem login → redireciona para `/Login`
- Após login bem-sucedido → retorna para página original
- Sessão persiste mesmo após fechar navegador

### **Logout**

- Clica no botão de logout no header
- Sessão é encerrada
- Redirecionado para `/Login`

---

## 🛡️ Segurança

### **Row Level Security (RLS)**

Todas as simulações têm políticas de segurança:

```sql
-- Usuário só vê suas próprias simulações
create policy "Usuários podem ver suas simulações"
  on public.simulacoes for select
  using (auth.uid() = user_id);

-- Usuário só cria simulações para si mesmo
create policy "Usuários podem criar simulações"
  on public.simulacoes for insert
  with check (auth.uid() = user_id);

-- Usuário só deleta suas simulações
create policy "Usuários podem deletar suas simulações"
  on public.simulacoes for delete
  using (auth.uid() = user_id);
```

### **Boas Práticas Implementadas**

✅ Variáveis de ambiente fora do código  
✅ `.env` no `.gitignore`  
✅ Senhas criptografadas automaticamente  
✅ Tokens JWT com expiração  
✅ HTTPS obrigatório em produção  
✅ Rate limiting pelo Supabase  
✅ Proteção contra SQL Injection  
✅ Validação client e server-side  

---

## 🎨 Interface

### **Página de Login**
- Formulário de email/senha
- Botão "Continuar com Google"
- Link para criar conta
- Mensagens de erro amigáveis
- Dark mode suportado

### **Página de Cadastro**
- Campo de nome completo
- Email e senha
- Confirmação de senha
- Botão "Continuar com Google"
- Link para login
- Feedback de sucesso

### **Header (Layout)**
- Avatar com iniciais do usuário
- Nome do usuário
- Botão de logout
- Navegação entre páginas

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: simulacoes**

| Campo                     | Tipo       | Descrição                          |
|---------------------------|------------|------------------------------------|
| `id`                      | uuid       | ID único (primary key)             |
| `user_id`                 | uuid       | ID do usuário (foreign key)        |
| `idade`                   | integer    | Idade do candidato                 |
| `sexo`                    | text       | Sexo do candidato                  |
| `raca`                    | text       | Raça/cor declarada                 |
| `estado`                  | text       | Estado de residência               |
| `municipio`               | text       | Município de residência            |
| `tipo_escola`             | text       | Tipo de escola (pública/privada)   |
| `nota_enem`               | numeric    | Nota do ENEM                       |
| `deficiencia`             | boolean    | Possui deficiência                 |
| `pontuacao_elegibilidade` | numeric    | Score calculado (0-100)            |
| `created_at`              | timestamp  | Data/hora de criação               |

---

## 📊 Tecnologias Utilizadas

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Autenticação**: Supabase Auth
- **Banco de Dados**: PostgreSQL (Supabase)
- **OAuth**: Google OAuth 2.0
- **Routing**: React Router v6 (HashRouter)
- **State Management**: React Context API
- **UI Components**: Radix UI + shadcn/ui

---

## 🔄 Migração do localStorage para Supabase

### **Antes** (localStorage)
```javascript
localStorage.setItem("simulacoes", JSON.stringify(data))
// ❌ Não seguro, limitado, local
```

### **Depois** (Supabase)
```javascript
await supabase.from('simulacoes').insert([data])
// ✅ Seguro, escalável, compartilhado
```

### **Benefícios da Migração**

✅ Dados persistem entre dispositivos  
✅ Backup automático  
✅ Segurança com RLS  
✅ Escalabilidade  
✅ Consultas SQL avançadas  
✅ Real-time capabilities (futuro)  

---

## 🚀 Deploy em Produção

### **GitHub Pages com Supabase**

1. Configure secrets no GitHub:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Atualize workflow (`.github/workflows/deploy.yml`):
```yaml
- name: Build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
  run: npm run build
```

3. Atualize Google OAuth com URL de produção

4. Push para `main` → Deploy automático

---

## 🆘 Suporte

Se encontrar problemas, consulte:

1. **[SETUP_AUTH.md](./SETUP_AUTH.md)** - Guia completo de configuração
2. **Troubleshooting** no SETUP_AUTH.md
3. [Documentação Supabase](https://supabase.com/docs)
4. [Issues do GitHub](https://github.com/MuriloVinicius-dc/ProUni-Simulador/issues)

---

## 📄 Licença

Este projeto mantém a mesma licença do projeto original.

---

## 🎉 Próximos Passos Sugeridos

1. [ ] Adicionar recuperação de senha
2. [ ] Implementar perfil de usuário editável
3. [ ] Adicionar mais provedores OAuth (Facebook, GitHub)
4. [ ] Dashboard com histórico de simulações
5. [ ] Gráficos de evolução das simulações
6. [ ] Exportar resultados em PDF
7. [ ] Notificações por email
8. [ ] Modo offline com sincronização

---

**Desenvolvido com 💙 para democratizar o acesso ao ensino superior**
