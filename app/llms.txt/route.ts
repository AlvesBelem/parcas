import { fetchPartners } from "@/lib/data/partners";
import { fetchPartnerProducts } from "@/lib/data/products";
import { fetchServices } from "@/lib/data/services";
import { absoluteUrl, metaDescription, siteConfig } from "@/lib/seo";

export const revalidate = 3600;

const CATALOG_LIMIT = 50_000;

export async function GET() {
  const [partnerResult, productResult, serviceResult] = await Promise.all([
    fetchPartners({ page: 1, perPage: CATALOG_LIMIT }),
    fetchPartnerProducts({ page: 1, perPage: CATALOG_LIMIT }),
    fetchServices({ page: 1, perPage: CATALOG_LIMIT }),
  ]);

  const lines = [
    `# ${siteConfig.name}`,
    "",
    "> Diretório público de lojas, produtos afiliados e serviços parceiros da CPAD Belém, em Belém do Pará.",
    "",
    "A plataforma ajuda visitantes a descobrir negócios e entrar em contato pelos canais oficiais informados por cada parceiro. Não realiza vendas, pagamentos, entregas ou a prestação dos serviços anunciados.",
    "",
    "## Páginas principais",
    `- [Catálogo completo](${absoluteUrl("/parceiros")}): lojas, produtos e serviços em um único diretório.`,
    `- [Lojas parceiras](${absoluteUrl("/parceiros")}): empresas e empreendedores parceiros.`,
    `- [Produtos afiliados](${absoluteUrl("/produtos")}): produtos com links oficiais para marketplaces ou parceiros.`,
    `- [Serviços parceiros](${absoluteUrl("/servicos")}): profissionais e empresas de serviços.`,
    `- [Como ser parceiro](${absoluteUrl("/seja-um-parceiro")}): informações sobre o Programa de Parceiros CPAD Belém.`,
    "",
    "## Lojas parceiras",
    ...partnerResult.partners.map((partner) => `- [${partner.name}](${absoluteUrl(`/parceiros/${partner.slug}`)}): ${metaDescription(partner.description, `Loja parceira na categoria ${partner.category}.`)}`),
    "",
    "## Produtos afiliados",
    ...productResult.products.map((product) => `- [${product.name}](${absoluteUrl(`/produtos/${product.slug}`)}): ${metaDescription(product.description, `Produto afiliado na categoria ${product.category?.name ?? "geral"}.`)}`),
    "",
    "## Serviços parceiros",
    ...serviceResult.services.map((service) => `- [${service.name}](${absoluteUrl(`/servicos/${service.slug}`)}): ${metaDescription(service.description, `Serviço parceiro na categoria ${service.category.name}.`)}`),
    "",
    "## Contato",
    "- WhatsApp para parceria: +55 91 99912-71407",
    "- E-mail: parcerias@cpadbelem.com.br",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
