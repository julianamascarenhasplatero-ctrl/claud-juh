# Juh Design

Estúdio criativo em português, construído sobre o OpenDesign 0.22.1 fornecido no ZIP. A licença Apache-2.0 e os créditos do projeto original permanecem no repositório.

## Abrir

Requisitos: Node 24.x e pnpm 10.33.2. No Windows, as dependências nativas podem exigir Visual Studio Build Tools.

```powershell
pnpm install
pnpm tools-dev run web --daemon-port 17456 --web-port 17573
```

Abra http://localhost:17573/estudio. O OpenDesign original continua em `/`, com um link para o estúdio.

## Criar

1. Escolha uma área e um modelo.
2. Edite a marca, os textos, as cores, a tipografia e os cantos. O campo conteúdo usa uma linha por item, no formato `Título | Descrição`.
3. Confira a prévia desktop ou celular. Os carrosséis têm navegação, catálogos têm busca e dashboards têm filtro de período.
4. Exporte HTML, logo SVG, tokens JSON ou briefing Markdown. O HTML é independente e pode abrir diretamente no navegador.
5. Use **Salvar projeto** para baixar um backup JSON e **Importar** para recuperá-lo.
6. Use **Refinar este briefing com IA** para preencher o compositor do OpenDesign. Revise o briefing, escolha um modelo configurado e envie a solicitação.

O projeto atual é salvo no armazenamento local do navegador. Não há sincronização com o GitHub nem envio automático de dados. Guarde backups JSON para manter vários projetos.

## Escopo desta versão

Nove modelos: landing page, dashboard, componentes, manual de marca, moodboard, carrossel, vetores, catálogo e design tokens. O editor usa modelos determinísticos; não simula geração por IA. O monograma SVG é um estudo JU editável. Moodboards usam formas e cores em CSS. Dados de dashboard são demonstrativos e o formulário apenas valida os campos, sem enviar contatos.

O manual calcula contraste entre cor principal e fundo; isso não equivale a uma auditoria completa de acessibilidade. Imagens, propostas originais de marca, estratégia de Instagram, roteiros completos e exportação React/Tailwind são pedidos encaminhados à IA do OpenDesign, que exige um provedor ou CLI configurado. HTML exportado usa CSS incorporado e JavaScript nativo, sem depender de CDN.

## Validação

```powershell
pnpm guard
pnpm typecheck
pnpm --filter @open-design/web exec vitest run -c vitest.config.ts tests/design-studio/artifacts.test.ts
pnpm --filter @open-design/web build
```
