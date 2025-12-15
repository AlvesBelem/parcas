import type { BannerItem } from "@/components/catalog/banner-rotator";
import { BannerRotator } from "@/components/catalog/banner-rotator";
import { PartnerRail } from "@/components/catalog/partner-rail";
import { fetchCategoryOptions } from "@/lib/data/categories";
import { fetchPartners } from "@/lib/data/partners";

type PartnerByCategory = {
  name: string;
  partners: Awaited<ReturnType<typeof fetchPartners>>["partners"];
};

export default async function PartnersCatalogPage() {
  const [categories, latestPartners] = await Promise.all([
    fetchCategoryOptions(),
    fetchPartners({ page: 1, perPage: 50 }),
  ]);

  const bannerItems = buildBannerItems(latestPartners.partners.slice(0, 5));

  const partnersByCategory: PartnerByCategory[] = await Promise.all(
    categories.map(async (category) => {
      const result = await fetchPartners({
        categorySlug: category.slug,
        page: 1,
        perPage: 12,
      });
      return { name: category.name, partners: result.partners };
    }),
  );

  const nonEmpty = partnersByCategory.filter((group) => group.partners.length > 0);

  return (
    <main className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b02b24]">Catálogo</p>
        <h1 className="text-4xl font-semibold text-[#2f1d15]" style={{ fontFamily: "var(--font-playfair)" }}>
          Parceiros por categoria
        </h1>
        <p className="text-[#7a5a4b]">
          Explore os parceiros em trilhas horizontais no estilo catálogo. Use os banners para acompanhar novidades e futuras parcerias.
        </p>
      </header>

      <BannerRotator items={bannerItems} />

      <div className="space-y-8">
        {nonEmpty.length ? (
          nonEmpty.map((group) => (
            <PartnerRail key={group.name} title={group.name} partners={group.partners} />
          ))
        ) : (
          <p className="rounded-3xl border border-[#eaded5] bg-white p-6 text-[#7a5a4b] shadow-[0_12px_35px_rgba(63,33,25,0.08)]">
            Nenhum parceiro cadastrado ainda.
          </p>
        )}
      </div>
    </main>
  );
}

function buildBannerItems(partners: Awaited<ReturnType<typeof fetchPartners>>["partners"]) {
  const baseItems: BannerItem[] = partners.map((partner) => ({
    id: partner.id,
    title: partner.name,
    href: `/out/partner/${partner.slug}`,
    imageUrl: partner.logoUrl,
    badge: "Novo parceiro",
    caption: partner.description ?? "Parceiro oficial verificado pela CPAD Belém.",
  }));

  const customPromos: BannerItem[] = [
    // Exemplo: adicione novos banners de futuros parceiros ou campanhas
    // {
    //   id: "promo-futura",
    //   title: "Em breve: Nova parceria CPAD",
    //   href: "/parceiros",
    //   imageUrl: "/promos/futura-parceria.jpg",
    //   badge: "Teaser",
    //   caption: "Prepare-se para uma nova loja verificada chegando à rede.",
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
