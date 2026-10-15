"use client";

import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ClickSeriesPoint, ClickStatEntry } from "@/lib/data/click-stats";

const periods = [
  { key: "day", label: "Dia", helper: "Últimas 24 horas" },
  { key: "week", label: "Semana", helper: "Últimos 7 dias" },
  { key: "month", label: "Mês", helper: "Últimos 30 dias" },
  { key: "year", label: "Ano", helper: "Últimos 365 dias" },
] as const;

type PeriodKey = (typeof periods)[number]["key"];
type MetricMap = Record<PeriodKey, ClickStatEntry[]>;
type Focus = "both" | "partners" | "products";

type ClickMetricsProps = {
  partnerStats: MetricMap;
  productStats: MetricMap;
  partnerSeries: ClickSeriesPoint[];
  productSeries: ClickSeriesPoint[];
};

export function ClickMetrics({ partnerStats, productStats, partnerSeries, productSeries }: ClickMetricsProps) {
  const [period, setPeriod] = useState<PeriodKey>("week");
  const [focus, setFocus] = useState<Focus>("both");
  const currentPeriod = periods.find((item) => item.key === period) ?? periods[1];

  return (
    <section className="space-y-5" aria-labelledby="metrics-title">
      <div className="border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-wine)]">Acessos externos</p>
            <h2 id="metrics-title" className="mt-1 font-[family-name:var(--font-playfair)] text-3xl text-[var(--color-text)]">Métricas de cliques</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">Dados registrados quando alguém segue um link para um parceiro ou produto.</p>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Período das métricas">
            {periods.map((item) => <FilterButton key={item.key} active={period === item.key} onClick={() => setPeriod(item.key)}>{item.label}</FilterButton>)}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-4">
          <span className="mr-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-subtle)]">Exibir</span>
          <FilterButton active={focus === "both"} onClick={() => setFocus("both")}>Todos</FilterButton>
          <FilterButton active={focus === "partners"} onClick={() => setFocus("partners")}>Parceiros</FilterButton>
          <FilterButton active={focus === "products"} onClick={() => setFocus("products")}>Produtos</FilterButton>
          <Badge variant="outline" className="ml-auto">{currentPeriod.helper}</Badge>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {focus !== "products" && <MetricList title="Cliques em parceiros" detail="Canais de atendimento das lojas." data={partnerStats[period]} tone="wine" />}
        {focus !== "partners" && <MetricList title="Cliques em produtos" detail="Links externos dos itens cadastrados." data={productStats[period]} tone="gold" />}
      </div>

      <DailyChart focus={focus} partnerSeries={partnerSeries} productSeries={productSeries} />
    </section>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`min-h-9 border px-3 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] ${active ? "border-[var(--color-wine)] bg-[var(--color-wine)] text-white" : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-wine)] hover:text-[var(--color-wine)]"}`}>{children}</button>;
}

function MetricList({ title, detail, data, tone }: { title: string; detail: string; data: ClickStatEntry[]; tone: "wine" | "gold" }) {
  const maximum = data[0]?.clicks ?? 1;
  const barClass = tone === "wine" ? "bg-[var(--color-wine)]" : "bg-[var(--color-gold)]";
  return (
    <section className="border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]">
      <div className="border-b border-[var(--color-border)] px-5 py-4"><h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--color-text)]">{title}</h3><p className="mt-1 text-sm text-[var(--color-text-muted)]">{detail}</p></div>
      <div className="space-y-4 p-5">
        {data.length ? data.map((item) => <BarRow key={item.id} item={item} maximum={maximum} barClass={barClass} />) : <p className="text-sm text-[var(--color-text-muted)]">Nenhum clique registrado nesse período.</p>}
      </div>
    </section>
  );
}

function BarRow({ item, maximum, barClass }: { item: ClickStatEntry; maximum: number; barClass: string }) {
  const percent = Math.max(4, Math.round((item.clicks / maximum) * 100));
  return <div>
    <div className="flex items-center justify-between gap-3 text-sm"><span className="min-w-0 truncate font-semibold text-[var(--color-text)]">{item.label}</span><span className="shrink-0 text-[var(--color-text-muted)]">{item.clicks} cliques</span></div>
    {item.badge && <p className="mt-1 text-xs text-[var(--color-text-subtle)]">{item.badge}</p>}
    <div className="mt-2 h-2 w-full bg-[var(--color-surface-warm)]"><div className={`h-full ${barClass}`} style={{ width: `${percent}%` }} /></div>
  </div>;
}

function DailyChart({ focus, partnerSeries, productSeries }: { focus: Focus; partnerSeries: ClickSeriesPoint[]; productSeries: ClickSeriesPoint[] }) {
  const points = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" });
    return partnerSeries.map((partner, index) => ({ date: formatter.format(new Date(partner.date)).replace(".", ""), partner: partner.clicks, product: productSeries[index]?.clicks ?? 0 })).slice(-14);
  }, [partnerSeries, productSeries]);
  const highest = Math.max(...points.map((point) => focus === "partners" ? point.partner : focus === "products" ? point.product : Math.max(point.partner, point.product)), 1);

  return (
    <section className="border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-wine)]">Últimos 14 dias</p>
          <h3 className="mt-1 font-[family-name:var(--font-playfair)] text-2xl text-[var(--color-text)]">Evolução diária</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
          {focus !== "products" && <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 bg-[var(--color-wine)]" />Parceiros</span>}
          {focus !== "partners" && <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 bg-[var(--color-gold)]" />Produtos</span>}
        </div>
      </div>
      <div className="overflow-x-auto p-5">
        {points.length ? (
          <div className="flex min-w-[620px] items-end gap-3">
            {points.map((point) => {
              const partnerHeight = `${Math.max(4, (point.partner / highest) * 100)}%`;
              const productHeight = `${Math.max(4, (point.product / highest) * 100)}%`;
              return (
                <div key={point.date} className="flex min-w-10 flex-1 flex-col items-center gap-2">
                  <div className="flex h-32 w-full items-end justify-center gap-1.5 border-b border-[var(--color-border)]">
                    {focus !== "products" && <span title={`${point.partner} cliques de parceiros`} className="w-2.5 bg-[var(--color-wine)]" style={{ height: partnerHeight }} />}
                    {focus !== "partners" && <span title={`${point.product} cliques de produtos`} className="w-2.5 bg-[var(--color-gold)]" style={{ height: productHeight }} />}
                  </div>
                  <span className="text-[10px] text-[var(--color-text-subtle)]">{point.date}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-32 items-center justify-center text-sm text-[var(--color-text-muted)]"><BarChart3 className="mr-2 h-4 w-4" aria-hidden />Sem cliques registrados.</div>
        )}
      </div>
    </section>
  );
}
