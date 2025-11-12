## Visao geral

Aplicacao em Next.js 16 (App Router) que apresenta um catalogo estilo streaming com todas as lojas parceiras homologadas pela Nosite. O painel `/admin` agora replica o visual mostrado na referencia: sidebar fixa, cards de status, cadastro de categorias e de parceiros com fotos locais ou remotas. Todo cadastro usa Server Actions e os dados sao persistidos com Prisma + PostgreSQL.

### Destaques

- UI premium baseada nos componentes do shadcn/ui adaptados para o tema noturno.
- Carrossel horizontal com filtro por categoria, paginacao e metricas em tempo real.
- Autenticacao via Google (NextAuth v5) protegida por lista de e-mails `ADMIN_EMAILS`.
- Painel administrativo com gerenciamento completo de categorias e parceiros.
- Suporte a logos hospedadas externamente ou servidas pelo proprio projeto (`/public/...`).

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4 + shadcn/ui
- NextAuth v5 + Google OAuth + Prisma Adapter
- PostgreSQL + Prisma Client

## Configuracao

1. **Instale as dependencias**

   ```bash
   npm install
   ```

2. **Configure as variaveis de ambiente**

   Copie `.env.example` para `.env` e preencha:

   - `DATABASE_URL`: URL completa do banco PostgreSQL.
   - `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`: credenciais do OAuth (callback `http://localhost:3000`).
   - `AUTH_SECRET`: gere com `npx auth secret`.
   - `ADMIN_EMAILS`: lista separada por virgula com os e-mails que acessam o painel.

3. **Execute as migracoes Prisma**

   ```bash
   npx prisma migrate deploy   # ou npx prisma migrate dev --name add-categories
   ```

4. **Rode o projeto**

   ```bash
   npm run dev
   ```

   A aplicacao fica disponivel em `http://localhost:3000`.

## Fluxo do admin

1. Acesse `/admin`. Usuarios nao autenticados sao redirecionados ao Google.
2. Apenas e-mails listados em `ADMIN_EMAILS` entram.
3. Cadastre categorias (nome + descricao interna). Elas alimentam o filtro publico e o select do formulario de parceiros.
4. Cadastre parceiros informando nome, categoria, link oficial, descricao e imagem.
   - O campo de imagem aceita **URLs HTTPS** ou **caminhos relativos** que apontam para a pasta `public`. Exemplo: coloque a logo em `public/parceiros/minha-loja/logo.png` e informe `/parceiros/minha-loja/logo.png`.
5. Cada acao revalida automaticamente a landing page e o painel.

## Scripts uteis

- `npm run dev`: ambiente de desenvolvimento.
- `npm run build`: build de producao.
- `npm run start`: executa o build.
- `npm run lint`: ESLint.

## Proximos passos sugeridos

1. Upload direto das logos (S3, Cloudinary ou supabase storage).
2. Edição/remoção de categorias e parceiros diretamente no painel.
3. Dashboard com graficos (parceiros por trimestre, categorias mais acessadas).
4. Testes E2E (Playwright) cobrindo login, cadastro e filtros da landing.
