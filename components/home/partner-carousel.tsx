import { PartnerSummary } from "@/lib/data/partners";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PartnerCard } from "@/components/home/partner-card";

type PartnerCarouselProps = {
  partners: PartnerSummary[];
};

export function PartnerCarousel({ partners }: PartnerCarouselProps) {
  if (!partners.length) {
    return (
      <div className="rounded-3xl border border-black/5 bg-white p-10 text-center text-neutral-700 shadow-[0_18px_60px_rgba(45,28,22,0.08)]">
        Ainda não temos parceiros nesta categoria. Volte em breve ou cadastre o primeiro em /admin.
      </div>
    );
  }

  return (
    <ScrollArea className="w-full rounded-[24px] border border-black/5 bg-white p-3 shadow-[0_18px_60px_rgba(45,28,22,0.08)]">
      <div className="flex gap-4 pb-4">
        {partners.map((partner) => (
          <div key={partner.id} className="w-[270px] shrink-0">
            <PartnerCard partner={partner} />
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
