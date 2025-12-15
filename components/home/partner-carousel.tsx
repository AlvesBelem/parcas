import { PartnerSummary } from "@/lib/data/partners";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PartnerCard } from "@/components/home/partner-card";

type PartnerCarouselProps = {
  partners: PartnerSummary[];
};

export function PartnerCarousel({ partners }: PartnerCarouselProps) {
  if (!partners.length) {
    return (
      <div className="rounded-3xl border border-[#eaded5] bg-white p-10 text-center text-[#7a5a4b] shadow-[0_12px_35px_rgba(63,33,25,0.08)]">
        Ainda não temos parceiros nesta categoria. Volte em breve ou cadastre o primeiro em /admin.
      </div>
    );
  }

  return (
    <ScrollArea className="w-full rounded-3xl border border-[#eaded5] bg-white p-3 shadow-[0_12px_35px_rgba(63,33,25,0.08)]">
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
