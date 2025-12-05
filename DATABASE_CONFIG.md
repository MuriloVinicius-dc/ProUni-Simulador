# Configuração do Banco de Dados

## Banco de Dados Ativo

**Arquivo oficial:** `Backend/db/database_verdadeiro.db`

Este é o **único** banco de dados que deve ser utilizado em todo o projeto (backend, frontend, testes, etc.).

## Configuração

O arquivo `Backend/db/database.py` está configurado para apontar exclusivamente para `database_verdadeiro.db`:

```python
db_path = os.path.join(db_dir, "database_verdadeiro.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"
```

## Arquivos de Banco de Dados Obsoletos

Os seguintes arquivos de banco de dados existem no projeto mas **NÃO devem ser utilizados**:

1. ❌ `database.db` (raiz do projeto)
2. ❌ `Backend/database.db`
3. ❌ `Backend/db/database.db`

Estes arquivos são versões antigas/duplicadas e devem ser ignorados ou removidos.

## Importante

- Todos os arquivos `.db` estão no `.gitignore` (não são versionados)
- O banco `database_verdadeiro.db` é criado/atualizado automaticamente pelo backend
- Qualquer migração ou modificação de schema deve ser feita apenas no `database_verdadeiro.db`

## Verificação

Para confirmar qual banco está sendo usado, execute:

```powershell
# Windows PowerShell
Get-Content Backend\db\database.py | Select-String "database_verdadeiro"
```

```bash
# Linux/Mac
grep "database_verdadeiro" Backend/db/database.py
```

Você deve ver a referência ao `database_verdadeiro.db` na configuração.

## Localização

```
Backend/
  └── db/
      ├── database.py              ← Configuração (aponta para database_verdadeiro.db)
      └── database_verdadeiro.db   ← BANCO OFICIAL ✅
```

## Em caso de problemas

Se encontrar erros relacionados ao banco de dados:

1. Verifique se `Backend/db/database_verdadeiro.db` existe
2. Certifique-se de que o arquivo `database.py` aponta para `database_verdadeiro.db`
3. Reinicie o servidor backend
4. Se necessário, delete os bancos antigos (mas NUNCA o `database_verdadeiro.db`)
