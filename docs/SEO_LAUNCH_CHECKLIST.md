# Checklist de publicação SEO — Parceiros CPAD Belém

## Antes da publicação

1. Configure `NEXT_PUBLIC_SITE_URL` no ambiente de produção com o domínio canônico da plataforma, sem barra final. Exemplo: `https://parceiros.cpadbelem.com.br`.
2. Publique a aplicação e confirme que as URLs abaixo retornam `200`:
   - `/robots.txt`
   - `/sitemap.xml`
   - `/llms.txt`
   - `/manifest.webmanifest`
3. Confirme que `https://dominio/` redireciona permanentemente (`308`) para `/parceiros`.
4. Verifique uma página real de loja, produto e serviço no [Rich Results Test](https://search.google.com/test/rich-results) e no [Schema Markup Validator](https://validator.schema.org/).

## Descoberta e indexação

1. Adicione e verifique o domínio no [Google Search Console](https://search.google.com/search-console/).
2. Envie `https://dominio/sitemap.xml` ao Google Search Console.
3. Adicione e verifique o domínio no [Bing Webmaster Tools](https://www.bing.com/webmasters/).
4. Envie o mesmo sitemap ao Bing. Isso também ajuda a descoberta por superfícies que utilizam o índice do Bing, como o Copilot.
5. Após uma publicação importante, use a inspeção de URL do Search Console para solicitar recrawl da página específica.

## Negócios parceiros

- Cada empresa deve manter nome, telefone, endereço, horário e URL oficial consistentes entre a página do diretório, seu Google Business Profile e suas redes sociais.
- Use apenas descrições, imagens e links confirmados pelo parceiro. Não publique preço, disponibilidade, endereço, avaliação ou certificação que não esteja confirmado e visível ao visitante.
- Incentive avaliações honestas de clientes reais. Não compre avaliações, não ofereça recompensa e não solicite texto específico.
- Quando houver preço e estoque verificáveis em um produto, cadastre-os antes de buscar recursos de produto avançados do Google ou Merchant Center.

## Visibilidade em mecanismos de IA

- O site permite rastreadores de descoberta do Google, Bing, OpenAI, Perplexity e Claude via `robots.txt`.
- `/llms.txt` lista páginas e registros públicos para facilitar a leitura por ferramentas de IA. Ele complementa SEO; não garante citações nem melhora, por si só, o ranking no Google.
- Mantenha páginas individuais completas, atualizadas e úteis para pessoas. Estrutura clara, fatos verificáveis e links oficiais são mais importantes que repetir palavras-chave.
- A cada mês, teste consultas reais em Google, Bing/Copilot, ChatGPT, Perplexity e Claude. Registre se a plataforma citou a CPAD Belém ou um parceiro, a URL citada e a precisão da resposta.

## Rotina mensal

1. Revise o relatório de indexação, Core Web Vitals e consultas no Search Console.
2. Revise cobertura e erros de rastreamento no Bing Webmaster Tools.
3. Atualize dados desatualizados de parceiros, produtos e serviços.
4. Corrija links externos quebrados e remova itens inativos do catálogo.
5. Valide novamente os schemas após alterações relevantes no modelo de dados.
