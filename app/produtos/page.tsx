import type { BannerItem } from "@/components/catalog/banner-rotator";
import { BannerRotator } from "@/components/catalog/banner-rotator";
import { ProductRail } from "@/components/catalog/product-rail";
import { fetchProductCategoryOptions } from "@/lib/data/product-categories";
import { fetchPartnerProducts } from "@/lib/data/products";

type ProductsByCategory = {
  name: string;
  products: Awaited<ReturnType<typeof fetchPartnerProducts>>["products"];
};

export default async function ProductsCatalogPage() {
  const [categories, latestProducts] = await Promise.all([
    fetchProductCategoryOptions(),
    fetchPartnerProducts({ page: 1, perPage: 50 }),
  ]);

  const bannerItems = buildBannerItems(latestProducts.products.slice(0, 5));

  const productsByCategory: ProductsByCategory[] = await Promise.all(
    categories.map(async (category) => {
      const result = await fetchPartnerProducts({
        categorySlug: category.slug,
        page: 1,
        perPage: 12,
      });
      return { name: category.name, products: result.products };
    }),
  );

  const nonEmpty = productsByCategory.filter((group) => group.products.length > 0);

  return (
    <main className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b02b24]">Catálogo</p>
        <h1 className="text-4xl font-semibold text-[#2f1d15]" style={{ fontFamily: "var(--font-playfair)" }}>
          Produtos por categoria
        </h1>
        <p className="text-[#7a5a4b]">
          Trilha no estilo catálogo para navegar produtos oficiais por categoria, com banners rotativos para lançamentos e campanhas.
        </p>
      </header>

      <BannerRotator items={bannerItems} />

      <div className="space-y-8">
        {nonEmpty.length ? (
          nonEmpty.map((group) => (
            <ProductRail key={group.name} title={group.name} products={group.products} />
          ))
        ) : (
          <p className="rounded-3xl border border-[#eaded5] bg-white p-6 text-[#7a5a4b] shadow-[0_12px_35px_rgba(63,33,25,0.08)]">
            Nenhum produto cadastrado ainda.
          </p>
        )}
      </div>
    </main>
  );
}

function buildBannerItems(products: Awaited<ReturnType<typeof fetchPartnerProducts>>["products"]) {
  const baseItems: BannerItem[] = products.map((product) => ({
    id: product.id,
    title: product.name,
    href: `/out/product/${product.slug}`,
    imageUrl: product.imageUrls[0] ?? "/logo_cpad_belem.svg",
    badge: "Produto novo",
    caption: product.description ?? "Oferta oficial com link verificado pela CPAD Belém.",
  }));

  const customPromos: BannerItem[] = [
    // Exemplo de campanha intercalada
    // {
    //   id: "promo-produtos",
    //   title: "Campanha de fim de ano",
    //   href: "/produtos",
    //   imageUrl: "/promos/campanha-fim-ano.jpg",
    //   badge: "Promo",
    //   caption: "Divulgue aqui banners de ações comerciais ou futuros lançamentos.",
    // },
  ];

  if (!baseItems.length && customPromos.length) return customPromos;
  if (!customPromos.length) return baseItems;

  const mixed: BannerItem[] = [];
  const promoEvery = 2;
  baseItems.forEach((item, idx) => {
    mixed.push(item);
    const promo = customPromos[idx % customPromos.length];
    if ((idx + 1) % promoEvery === 0) {
      mixed.push({ ...promo, id: `${promo.id}-${idx}` });
    }
  });

  return mixed;
}
