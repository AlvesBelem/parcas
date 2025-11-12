import { PartnerSummary } from "@/lib/data/partners";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PartnerCard } from "@/components/home/partner-card";

type PartnerCarouselProps = {
  partners: PartnerSummary[];
};

export function PartnerCarousel({ partners }: PartnerCarouselProps) {
  if (!partners.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
        Ainda não temos parceiros nesta categoria. Volte em breve ou cadastre o primeiro em /admin.
      </div>
    );
  }

  return (
    <ScrollArea className="w-full rounded-3xl border border-white/10 bg-zinc-950/60 p-3">
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
