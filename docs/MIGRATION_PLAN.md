# Plano de migração — Parceiros CPAD Belém

> Status: Fase 1 — diagnóstico concluído em 15 de outubro de 2026. Nenhuma migração, exclusão de dados ou alteração de funcionalidades foi executada. Este documento precisa de aprovação antes da Fase 2.

## 1. Resumo executivo

O repositório já é uma aplicação web com base adequada para evolução: Next.js App Router, React, PostgreSQL, Prisma, autenticação com Google e armazenamento de imagens no Vercel Blob. Há também um catálogo público, redirecionamentos com contagem de cliques e um painel administrativo.

O produto atual, porém, é um catálogo simples de parceiros e itens independentes. Ele ainda não suporta a relação essencial do novo produto — uma empresa com sua própria vitrine, produtos, serviços, endereço, contatos e usuários autorizados. A recomendação é uma migração **aditiva e em etapas**, preservando o catálogo atual até a validação dos dados e a publicação da nova experiência.

## 2. Inventário técnico atual

| Área | Estado atual |
| --- | --- |
| Framework | Next.js 16.1.1, App Router, React 19.2, TypeScript 5 |
| Estilos e UI | Tailwind CSS 4, componentes próprios inspirados em shadcn/Radix, Lucide |
| Banco e ORM | PostgreSQL + Prisma 5.22, 9 migrações versionadas |
| Autenticação | NextAuth/Auth.js v5 beta, Google OAuth, sessão em banco, Prisma Adapter |
| Autorização | Administração permitida apenas aos e-mails de `ADMIN_EMAILS` |
| Arquivos | Vercel Blob, via `POST /api/upload`, restrito ao administrador |
| Telemetria | Contadores diários e totais de clique para parceiro e produto |
| Monitoramento | Vercel Speed Insights no layout global |
| Branch atual | `main`; diretório Git limpo antes deste documento |

### Rotas existentes

| Tipo | Rotas |
| --- | --- |
| Públicas | `/`, `/parceiros`, `/produtos`, `/produtos/[slug]` |
| Saída rastreada | `/out/partner/[slug]`, `/out/product/[slug]` |
| Administração | `/admin/overview`, `/admin/categories`, `/admin/partners`, `/admin/products` |
| API | `/api/auth/[...nextauth]`, `/api/upload` |

### Modelo de dados existente

- `Partner`: nome, slug, categoria como texto, URL externa, logo, descrição, ativo e contagem de cliques.
- `Category` e `ProductCategory`: duas taxonomias paralelas, sem relação entre si.
- `PartnerProduct`: catálogo de itens sem chave estrangeira para `Partner`; usa `platform` como texto, categoria própria, imagens, URL externa e cliques.
- `PartnerClickStat` e `ProductClickStat`: séries diárias de cliques.
- `User`, `Account`, `Session` e `VerificationToken`: tabelas padrão do adapter de autenticação.

## 3. Reaproveitar, refatorar e criar

### Reaproveitar

- App Router, componentes de interface, fontes `Manrope` e `Playfair Display`, ícones e utilitários de slug.
- Prisma, PostgreSQL e o histórico de migrações existente.
- Fluxo de Google OAuth, sessão no banco e guarda de administração no servidor.
- Padrão de Server Actions com Zod para cadastros administrativos.
- Upload ao Vercel Blob, após endurecimento de segurança.
- Rotas de saída e estrutura de métricas de clique, generalizando-as para eventos de interação.
- Logotipos oficiais já presentes em `public/`; nenhuma nova versão da marca será criada sem arquivo autorizado.

### Refatorar

- A identidade usa vermelho/salmão e fundos rosados; deve migrar para os tokens CPAD aprovados: vinho `#750B2A`, vinho escuro `#51071F`, dourado `#C3944D`, dourado claro `#F1C77D`, fundos claros e bordas neutras.
- O cabeçalho atual tem apenas três links. Ele precisa receber pesquisa global, favoritos, login, CTA de parceiro, menu de categorias e a navegação completa dos layouts de referência.
- A home atual usa mensagens que afirmam validação, auditoria de links, segurança e entrega monitorada sem evidência correspondente no modelo ou nos fluxos. Essas afirmações devem sair ou só reaparecer vinculadas a um processo administrativo real e auditável.
- `Partner.category` é texto e perde integridade. Produtos usam outra tabela de categoria; as duas estruturas devem convergir em uma taxonomia canônica hierárquica.
- `PartnerProduct` não pertence a um parceiro. Essa lacuna impede a página de loja, autorização por propriedade e os catálogos solicitados.
- Produtos e serviços estão misturados em uma única entidade e rota. Devem ter modelos, filtros e páginas públicas distintos.
- Exclusões administrativas atuais removem registros de forma definitiva; o produto alvo exige status, histórico, auditoria e desativação segura.
- Os redirecionamentos aceitam URLs armazenadas sem política de domínios, e o upload não limita tipo, tamanho, dimensões nem conteúdo de arquivo.
- A configuração de imagens permite qualquer host HTTPS, o que deve ser reduzido a origens aprovadas.

### Criar

- Design system com tokens CSS, estados de interação, foco visível e componentes reutilizáveis.
- Página inicial, diretório em grade com filtros preservados na URL, perfil público de parceiro, diretórios e detalhes de produtos e serviços.
- Páginas institucionais, formulário de solicitação de parceria em etapas, painel do parceiro e administração completa.
- Categorias administráveis, mídia, contatos, endereço, horários, favoritos, auditoria, eventos de interação e vínculos de usuários a empresas.
- Busca sem acentuação, paginação indexável, SEO técnico, sitemap, robots, Schema.org, estados de carregamento/erro/vazio e suíte de testes.

## 4. Lacunas funcionais em relação ao MVP

Ainda não existem as rotas de perfil de parceiro, serviços, detalhes de serviço, favoritos, login público/recuperação de senha, solicitação de parceria, painel do parceiro, páginas institucionais, privacidade ou termos. Também faltam busca unificada, filtros por localização/canais, endereço/mapa, telefone/WhatsApp/redes/horários, galeria, aprovação de cadastros, gestão de conteúdo e controle de ordem de seções.

O diretório atual é organizado em trilhas horizontais; o layout aprovado requer banner, filtros laterais, grade paginada e ordenação. A página de produtos também não exibe vínculo com empresa, preço, disponibilidade, empresa responsável ou catálogo relacionado.

## 5. Arquitetura alvo proposta

```text
Next.js App Router
├── Camada pública SSR/RSC: home, parceiros, produtos, serviços e institucionais
├── Camada autenticada: solicitação, painel do parceiro e administração
├── Server Actions / Route Handlers: validação Zod + autorização por função e propriedade
├── Serviços de domínio: busca, mídia, links externos, métricas e moderação
└── PostgreSQL / Prisma: entidades normalizadas e logs imutáveis
```

Manter o monólito Next.js é a opção recomendada neste MVP: reduz superfícies de integração e permite evoluir o domínio em módulos (`partners`, `catalog`, `identity`, `content`, `analytics`). Não há motivo técnico para introduzir microsserviços, busca externa ou pagamentos agora.

### Entidades alvo

- `User`: perfil, `role` (`VISITOR`, `PARTNER`, `ADMIN`) e `status`.
- `Partner` e `PartnerMember`: empresa, responsável e possibilidade futura de vários usuários por empresa.
- `PartnerAddress`, `PartnerContact`, `PartnerOpeningHour` e `PartnerMedia`.
- `Category`: taxonomia única com `parentId`, `icon`, `sortOrder`, `active` e escopo de catálogo.
- `Product`, `ProductMedia` e `Service`, `ServiceMedia`: ambos pertencem a `Partner` e a uma categoria.
- `FavoritePartner`, `FavoriteProduct` e `FavoriteService`: tabelas explícitas, evitando associação polimórfica sem integridade.
- `InteractionEvent`: evento de visualização, WhatsApp, loja externa, compartilhamento e contato, com agregações derivadas quando necessárias.
- `PartnerApplication`, `PartnerApplicationMedia` e `AdminAuditLog`.
- `SiteSection`/`SiteBanner`: ordem, visibilidade e conteúdo administrável das vitrines.

## 6. Estratégia de migração do banco

### Princípios

1. Não executar `db push`, `migrate reset` ou SQL destrutivo no banco existente.
2. Criar backup lógico versionado com `pg_dump`, testar a restauração e registrar contagens por tabela antes de cada release.
3. Aplicar migrações Prisma somente após revisão do SQL gerado, em branch própria e primeiro em staging.
4. Toda alteração de compatibilidade será aditiva, com backfill idempotente e relatório de pendências.
5. Não gerar empresa, endereço ou responsável fictício para completar relações históricas.

### Fases de migração propostas

1. **Inventário e backup.** Validar histórico em `_prisma_migrations`; registrar quantidades, slugs duplicados, categorias sem correspondência, URLs inválidas, itens sem associação empresarial e arquivos órfãos. Gerar backup e testar restauração em ambiente isolado.
2. **Schema aditivo.** Criar tabelas/colunas novas como opcionais: status, dados institucionais, contatos, endereço, mídia, horas, `PartnerMember`, categorias canônicas, serviços, favoritos, eventos e auditoria. Não remover colunas legadas.
3. **Categorias.** Popular a categoria canônica a partir de `Category` e `ProductCategory`, com mapeamento de slug revisável. Preencher `Partner.categoryId` e a nova categoria de catálogo dos itens; produzir uma lista de divergências para decisão humana.
4. **Associação de catálogo.** Adicionar `partnerId` opcional aos itens legados. Como hoje não existe essa relação, ela não será inferida de `platform` automaticamente. O administrador deve confirmar cada associação; itens não mapeados ficam fora do catálogo público novo até a curadoria.
5. **Leitura compatível.** A aplicação passa a ler primeiro o modelo novo, mantendo a visualização do catálogo legado para registros ainda em transição. Escritas novas usam somente o modelo novo.
6. **Integridade.** Após relatório sem pendências e aceite, tornar chaves obrigatórias, adicionar índices e constraints, ativar status/publicação e substituir exclusão definitiva por arquivamento.
7. **Descontinuação controlada.** Apenas numa release posterior e com backup validado, remover campos legados e tabelas duplicadas que já não possuem leitores.

### Observações importantes sobre o histórico

- A migração `20260211143004_add_click_counts_and_stats` removeu a coluna `PartnerProduct.price`. A base atual não preserva esse valor; preço só poderá voltar a partir de nova informação cadastrada ou de uma fonte autorizada.
- `PartnerProduct` não possui `partnerId`. Este é o principal bloqueio de dados para perfis de empresas e deve ser resolvido por curadoria, não por suposição.

## 7. Segurança, qualidade e riscos

| Prioridade | Risco observado | Tratamento na implementação |
| --- | --- | --- |
| Crítica | Dependências com vulnerabilidades: auditoria do lockfile reportou 4 críticas, incluindo Next.js e NextAuth/Auth.js beta. | Atualização compatível e teste de autenticação antes da exposição pública. |
| Alta | O Next.js travado pela resolução atual está vulnerável; a auditoria pede versão corrigida posterior. | Atualizar lockfile de modo controlado, rodar build, testes e validação de rotas. |
| Alta | Apenas admins autenticados podem fazer upload, mas não há limite de tamanho/tipo, inspeção de conteúdo nem rate limit. | Allowlist MIME/extensão, limite de bytes/dimensões, remoção de metadados, nomes opacos, rate limiting e política de retenção. |
| Alta | Autorizações usam uma lista de e-mails; não há papel persistido, parceiro nem verificação de propriedade. | RBAC no banco, `PartnerMember`, checagem no servidor para cada mutação e auditoria. |
| Alta | Exclusões de categorias e parceiros podem afetar registros relacionados sem fluxo de recuperação. | Soft delete/status, bloqueio de exclusão referenciada e confirmação contextual. |
| Média | URLs externas permitem HTTP e não possuem política de segurança comercial. | Exigir HTTPS em produção, normalizar/validar URL e exibir aviso de saída; allowlist opcional por parceiro. |
| Média | `remotePatterns` aceita qualquer hostname e as imagens são muitas vezes não otimizadas. | Restringir hosts de mídia, usar `next/image` com dimensões/`sizes`, CDN e lazy loading. |
| Média | Não há cabeçalhos de segurança, CSP, rate limiting, sitemap, robots ou metadados dinâmicos. | Configurar headers, CSP compatível com OAuth, limites por rota e SEO técnico. |
| Média | Não há testes ou pipeline CI detectados. | Adicionar unitários, integração e E2E; gate de lint, typecheck, testes e build. |

O arquivo `.env` não está rastreado pelo Git e as chaves não foram exibidas durante a auditoria. A aplicação expõe somente os nomes das variáveis esperadas.

## 8. Responsividade e design

O trabalho seguirá mobile-first em 320 px, tablet, notebook, desktop e telas largas. No celular: header compacto com busca acionável, menu em painel, categorias com rolagem horizontal, filtros em drawer e CTAs de contato com área de toque mínima de 44 px. Em tablet, a grade passa a duas colunas e os filtros tornam-se painel lateral/drawer conforme espaço; no desktop, sidebar fixa e grade de três a quatro cards.

Os layouts fornecidos são referência de composição e identidade, não fonte de dados de produção. Imagens, empresas e textos demonstrativos serão explicitamente marcados como seed/desenvolvimento e não serão publicados como dados reais.

## 9. Skills pesquisadas

Foi usada a skill `find-skills` para pesquisar apoio especializado. As opções abaixo foram avaliadas por adoção e procedência; nenhuma foi instalada nesta Fase 1.

| Necessidade | Opção | Evidência | Decisão |
| --- | --- | --- | --- |
| React/Next.js e performance | `vercel-labs/agent-skills@vercel-react-best-practices` | 803,4 mil instalações na busca; repositório oficial da Vercel com cerca de 32 mil estrelas. | Recomendada para a Fase 2. |
| Prisma e migrações | `sickn33/agentic-awesome-skills@prisma-expert` | 4,2 mil instalações. É uma coleção comunitária ampla; requer leitura e revisão antes de instalar. | Opcional; não necessária para iniciar o plano. |
| Padrões de backend/front-end | `affaan-m/ecc@backend-patterns` e `@frontend-patterns` | 14,7 mil e 14,5 mil instalações. | Opcional; não instalar sem avaliar o conteúdo específico. |
| Design | `frontend-design` já disponível neste ambiente. | Skill apropriada para design system, estados e responsividade. | Será aplicada na Fase 2. |

Comandos sugeridos, sujeitos à aprovação: `npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y`. Não é necessário instalar uma skill para implementar a base; a decisão evita adicionar instruções externas sem necessidade.

## 10. Sequência de implementação recomendada

1. Aprovar este diagnóstico, arquitetura e abordagem de dados; definir a origem dos conteúdos e a pessoa que fará o mapeamento de produtos legados para parceiros.
2. Criar branch de trabalho, atualizar dependências críticas e estabelecer baseline de lint/typecheck/build/testes.
3. Implantar design system, layout global, header/footer e componentes de vitrine responsivos.
4. Criar schema aditivo e ferramenta administrativa de curadoria/mapeamento; executar em staging com backup validado.
5. Entregar home, diretório de parceiros e perfil público de parceiro.
6. Separar produtos e serviços, com seus catálogos e detalhes.
7. Implementar autenticação evoluída e solicitação de parceiro em etapas.
8. Construir painel do parceiro e painel administrativo, incluindo moderação e auditoria.
9. Consolidar segurança, SEO, observabilidade, acessibilidade e testes antes da produção.

## 11. Validações executadas nesta fase

- Estrutura, Git, rotas, schema Prisma, migrações, autenticação, ações de servidor, validações, configuração e variáveis de ambiente foram inspecionados.
- `npx prisma@5.22.0 validate` foi executado com sucesso; o schema Prisma atual é válido.
- `git diff --check` não reportou problemas na base antes deste documento.
- `npm audit --package-lock-only --omit=dev` foi executado e encontrou 10 vulnerabilidades de produção (4 críticas, 5 altas, 1 moderada); a atualização foi deliberadamente adiada para a fase aprovada de implementação.
- Não há arquivos de teste ou configuração de CI/E2E no repositório.
- `npm run lint` não pôde executar porque as dependências locais não estão instaladas (`eslint` não está disponível no `PATH`). Build, typecheck e testes ficam pendentes após instalar dependências e corrigir as vulnerabilidades.

## 12. Aprovação solicitada

Para iniciar a Fase 2, é necessário aprovar: (1) a migração aditiva e a curadoria manual para itens sem empresa; (2) a atualização de segurança de Next.js e Auth.js; (3) a criação da taxonomia única; e (4) a instalação opcional da skill oficial da Vercel para boas práticas de React/Next.js.

## 13. Execução da Fase 2 — 15 de outubro de 2026

Implementação iniciada na branch `codex/phase-2-foundation`, sem migrações de banco.

- Criado o design system documentado em `docs/DESIGN_SYSTEM.md`, com tokens CPAD, padrões de tipografia, componentes-base e critérios responsivos.
- Atualizado o frame global com cabeçalho responsivo, busca real no diretório de parceiros, navegação móvel, rodapé institucional e metadata pública mais fiel ao produto.
- Componentes base de botão, card, campo, seleção, label e badge passaram a usar tokens centralizados e foco visível.
- Corrigidos os filtros de categorias para manter a rota atual em vez de redirecionar incorretamente para a home.
- A busca de cabeçalho filtra nome, categoria e descrição de parceiros com parâmetro `q`, limite de entrada e comparação case-insensitive; a busca unificada de produtos/serviços continua prevista para a Fase 3.
- Removidas afirmações públicas que não possuem suporte técnico atual, como entrega monitorada, link auditado e validação de parceiros.
- Dependências diretas atualizadas para Next.js 16.4.1, NextAuth 5.0.0-beta.32 e `@auth/prisma-adapter` 2.11.3. A auditoria de dependências de produção no lockfile passou a reportar zero vulnerabilidades.

### Validação pendente

O ambiente local ficou com `node_modules` incompleto após interrupções externas do npm durante a substituição de diretórios no Windows. Por isso `lint`, `typecheck` e `build` ainda precisam ser executados após uma reinstalação limpa das dependências. O lockfile foi atualizado e auditado; nenhuma alteração de dados ou schema foi realizada.

### Atualização de validação — 15 de outubro de 2026

Após a recomposição das dependências, as validações pendentes foram executadas com sucesso nesta mesma branch:

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `git diff --check`

## 14. Execução da Fase 3 — diretório público

Sem alterar o schema ou os dados existentes, a vitrine pública foi adaptada ao design system CPAD e às referências de tela:

- Home editorial responsiva com hero institucional, categorias navegáveis, vitrine de parceiros reais e CTA de parceria.
- Diretório `/parceiros` com busca por nome/categoria/descrição, filtro de categoria, paginação, estados vazios e cards responsivos.
- Perfil público em `/parceiros/[slug]`, com metadados por parceiro e CTA que preserva o redirecionamento externo já rastreado em `/out/partner/[slug]`.
- Os cards não exibem localização, preços, entregas ou selos de verificação, pois esses dados não existem ou não possuem regra de validação na base atual.

O próximo incremento de dados continua condicionado à curadoria manual que relacionará cada item legado de `PartnerProduct` ao seu `Partner`. Nenhuma associação será inferida automaticamente.
