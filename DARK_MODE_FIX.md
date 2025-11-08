# Correção do Dark Mode - CSS Modules

## Problema Identificado

Após a reorganização do projeto e migração para CSS Modules, o modo dark parou de funcionar nas telas de login e cadastro.

### Causa Raiz

CSS Modules automaticamente faz **scope local** de todas as classes CSS. Isso significa que a sintaxe `.dark .container` era transformada em algo como:

```css
.Login_dark__xyz .Login_container__abc { ... }
```

Quando o Tailwind aplica a classe `dark` no elemento `<html>` ou `<body>`, ela não consegue fazer match com essa classe com scope, porque está procurando por `.dark`, não por `.Login_dark__xyz`.

## Solução Implementada

Utilizamos o modificador `:global()` do CSS Modules para indicar que `.dark` é uma classe global gerenciada pelo Tailwind, enquanto as demais classes permanecem com scope local.

### Antes (Incorreto)

```css
.container {
  background: linear-gradient(to bottom right, ...);
}

.dark .container {
  background: linear-gradient(to bottom right, ...);
}
```

### Depois (Correto)

```css
.container {
  background: linear-gradient(to bottom right, ...);
}

:global(.dark) .container {
  background: linear-gradient(to bottom right, ...);
}
```

## Arquivos Corrigidos

1. **src/pages/Login/styles.module.css**
   - Todas as regras `.dark` foram convertidas para `:global(.dark)`
   - Afeta: container, title, subtitle, card, cardTitle, etc.

2. **src/pages/Cadastro/styles.module.css**
   - Mesma correção aplicada
   - Inclui também os estilos da tela de sucesso

3. **src/components/auth/AuthForm/styles.module.css**
   - Correção em: errorAlert, label, input, input:focus

4. **src/components/auth/SocialLoginButton/styles.module.css**
   - Correção em: button, button:hover

## Como Funciona Agora

1. O componente `ThemeToggle` adiciona/remove a classe `dark` no `<html>`
2. O CSS Modules reconhece `:global(.dark)` como uma classe externa (não faz scope)
3. Os estilos dark mode são aplicados corretamente quando `.dark` está presente no DOM
4. As demais classes continuam com scope local para evitar conflitos

## Padrão para Futuras Adições

Sempre que adicionar estilos dark mode em CSS Modules, use:

```css
/* Modo Light (scope local) */
.meuComponente {
  background-color: white;
  color: black;
}

/* Modo Dark (classe global + scope local) */
:global(.dark) .meuComponente {
  background-color: rgb(15 23 42);
  color: white;
}
```

## Validação

✅ Build executado com sucesso sem erros  
✅ Todas as classes dark mode agora usam `:global(.dark)`  
✅ Compatível com o sistema de dark mode do Tailwind  
✅ Mantém o scope local das classes do componente  

## Documentação Relacionada

- [CSS Modules - Global Scope](https://github.com/css-modules/css-modules#exceptions)
- [Tailwind CSS - Dark Mode](https://tailwindcss.com/docs/dark-mode)
- Arquivo principal: `src/components/ui/theme-toggle.jsx`
