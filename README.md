# ProUni-Simulador — Frontend

Este repositório contém a interface do simulador ProUni construída com React + Vite + Tailwind.

## Objetivo

Publicar o site no GitHub Pages automaticamente ao enviar para a branch `main`. O projeto está configurado para gerar os arquivos estáticos em `docs/` (via `vite.config.js`).

## Como funciona o deploy automático

- Um workflow GitHub Actions (`.github/workflows/deploy.yml`) roda em pushes para `main`.
- O workflow executa `npm ci`, `npm run build` e publica a pasta `docs/` usando `peaceiris/actions-gh-pages`.

Observação: o `base` em `vite.config.js` já está definido como `/ProUni-Simulador/`. Se o repositório tiver outro nome, atualize-o ou remova a opção `base`.

## Rodando localmente

1. Instale dependências:

```powershell
npm ci
```

2. Rodar em modo de desenvolvimento:

```powershell
npm run dev
```

3. Build para produção (gera `docs/`):

```powershell
npm run build
```

4. Testar preview local (opcional):

```powershell
npm run preview
```

## Publicar manualmente

Se preferir publicar manualmente sem Actions, gere o build (`npm run build`) e comite a pasta `docs/` na branch `main`. Depois, nas configurações do repositório no GitHub, vá em Settings → Pages e escolha a pasta `docs/` na branch `main` como fonte.

## Observações finais

- Certifique-se de que o repositório remoto no GitHub se chama `ProUni-Simulador` se mantiver o `base` configurado. Caso contrário, ajuste `base` no `vite.config.js` ou remova-o para deploy em raiz.
