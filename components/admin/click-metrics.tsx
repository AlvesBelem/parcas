"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ClickStatEntry, ClickSeriesPoint } from "@/lib/data/click-stats";

const periods = [
  { key: "day", label: "Dia", helper: "Últimas 24h" },
  { key: "week", label: "Semana", helper: "Últimos 7 dias" },
  { key: "month", label: "Mês", helper: "Últimos 30 dias" },
  { key: "year", label: "Ano", helper: "Últimos 365 dias" },
] as const;

type PeriodKey = (typeof periods)[number]["key"];
type MetricMap = Record<PeriodKey, ClickStatEntry[]>;
type FocusView = "both" | "partners" | "products";

type ClickMetricsProps = {
  partnerStats: MetricMap;
  productStats: MetricMap;
  partnerSeries: ClickSeriesPoint[];
  productSeries: ClickSeriesPoint[];
};

export function ClickMetrics({
  partnerStats,
  productStats,
  partnerSeries,
  productSeries,
}: ClickMetricsProps) {
  const [period, setPeriod] = useState<PeriodKey>("week");
  const [focus, setFocus] = useState<FocusView>("both");

  const partnerData = partnerStats[period] ?? [];
  const productData = productStats[period] ?? [];
  const currentPeriod = periods.find((p) => p.key === period) ?? periods[1];

  const showPartners = focus !== "products";
  const showProducts = focus !== "partners";

  return (
    <div className="space-y-5">
      <Card className="border-[#eaded5] bg-white shadow-[0_15px_45px_rgba(63,33,25,0.08)]">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <CardDescription className="text-xs uppercase tracking-[0.3em] text-[#b02b24]">
              Visão rápida
            </CardDescription>
            <CardTitle className="text-xl text-[#2f1d15]">Métricas de cliques</CardTitle>
            <p className="text-sm text-[#7a5a4b]">
              Ajuste o período e escolha se quer focar em parceiros, produtos ou ambos.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {periods.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriod(p.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${p.key === period ? "bg-[#b02b24] text-white shadow-[0_10px_28px_rgba(178,45,38,0.18)]" : "border border-[#eaded5] bg-white text-[#7a5a4b] hover:bg-[#fff1ec]"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {(["both", "partners", "products"] as FocusView[]).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setFocus(view)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                focus === view
                  ? "border-[#b02b24] bg-[#fff1ec] text-[#b02b24]"
                  : "border-[#eaded5] text-[#7a5a4b] hover:bg-[#fff1ec]"
              }`}
            >
              {view === "both" ? "Ambos" : view === "partners" ? "Só parceiros" : "Só produtos"}
            </button>
          ))}
          <Badge variant="outline" className="ml-auto">
            {currentPeriod.helper}
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {showPartners && (
          <MetricCard
            title="Cliques em parceiros"
            helper="Engajamento dos links de saída."
            data={partnerData}
            periodLabel={currentPeriod.helper}
            tone="red"
          />
        )}
        {showProducts && (
          <MetricCard
            title="Cliques em produtos"
            helper="Saídas para ofertas e afiliados."
            data={productData}
            periodLabel={currentPeriod.helper}
            tone="amber"
          />
        )}
      </div>

      <DailyChart
        focus={focus}
        partnerSeries={partnerSeries}
        productSeries={productSeries}
      />
    </div>
  );
}

function MetricCard({
  title,
  helper,
  data,
  periodLabel,
  tone,
}: {
  title: string;
  helper: string;
  data: ClickStatEntry[];
  periodLabel: string;
  tone: "red" | "amber";
}) {
  const max = data[0]?.clicks ?? 1;
  const barClass = tone === "red" ? "from-[#b02b24] to-[#f5b7ae]" : "from-[#d37b2a] to-[#f3c17e]";

  return (
    <Card className="h-full border-[#eaded5] bg-white shadow-[0_15px_45px_rgba(63,33,25,0.08)]">
      <CardHeader>
        <CardDescription className="uppercase tracking-[0.3em] text-xs text-[#b02b24]">
          Métricas de cliques
        </CardDescription>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-xl text-[#2f1d15]">{title}</CardTitle>
          <span className="rounded-full border border-[#eaded5] bg-[#fff8f3] px-3 py-1 text-[11px] font-semibold text-[#7a5a4b]">
            {periodLabel}
          </span>
        </div>
        <p className="text-sm text-[#7a5a4b]">{helper}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 && (
          <p className="text-sm text-[#7a5a4b]">Nenhum clique registrado nesse período.</p>
        )}
        {data.map((item) => (
          <BarRow
            key={item.id}
            label={item.label}
            badge={item.badge}
            value={item.clicks}
            max={max}
            barClass={barClass}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function DailyChart({
  partnerSeries,
  productSeries,
  focus,
}: {
  partnerSeries: ClickSeriesPoint[];
  productSeries: ClickSeriesPoint[];
  focus: FocusView;
}) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });

  const merged = partnerSeries.map((p, idx) => {
    const product = productSeries[idx];
    return {
      date: formatter.format(new Date(p.date)).replace(".", ""),
      partner: p.clicks,
      product: product?.clicks ?? 0,
    };
  });

  const limited = merged.slice(-14);
  const limitedDesc = limited.slice().reverse();
  const max = useMemo(() => {
    return Math.max(
      ...limitedDesc.map((d) => {
        if (focus === "partners") return d.partner;
        if (focus === "products") return d.product;
        return Math.max(d.partner, d.product);
      }),
      1,
    );
  }, [limitedDesc, focus]);

  const showPartners = focus !== "products";
  const showProducts = focus !== "partners";

  return (
    <Card className="w-full border-[#eaded5] bg-white shadow-[0_15px_45px_rgba(63,33,25,0.08)]">
      <CardHeader>
        <CardDescription className="uppercase tracking-[0.3em] text-xs text-[#b02b24]">
          Cliques diários (30 dias)
        </CardDescription>
        <CardTitle className="text-xl text-[#2f1d15]">Evolução diária</CardTitle>
        <p className="text-sm text-[#7a5a4b]">
          Barras lado a lado para parceiros (vermelho) e produtos (âmbar). Use o filtro acima para
          destacar apenas o que importa.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {limited.length === 0 ? (
          <p className="text-sm text-[#7a5a4b]">Sem cliques registrados neste período.</p>
        ) : (
          <>
            <div className="flex items-center gap-3 text-xs text-[#7a5a4b]">
              {showPartners && (
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded-full bg-[#b02b24]" />
                  Parceiros
                </span>
              )}
              {showProducts && (
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded-full bg-[#d37b2a]" />
                  Produtos
                </span>
              )}
            </div>
            <div className="max-w-full overflow-x-auto rounded-xl border border-[#eaded5] bg-[#fff8f3] p-3">
              <div className="flex items-end gap-2">
                {limitedDesc.map((d) => {
                  const pHeight = Math.max(6, Math.round(((showPartners ? d.partner : 0) / max) * 80));
                  const prodHeight = Math.max(6, Math.round(((showProducts ? d.product : 0) / max) * 80));
                  return (
                    <div
                      key={d.date}
                      className="flex min-w-14 flex-col items-center gap-1 text-[10px] text-[#7a5a4b]"
                    >
                      <div className="flex h-24 w-full items-end justify-center gap-1">
                        {showPartners && (
                          <div
                            className="w-2.5 rounded-t-sm bg-[#b02b24]"
                            style={{ height: `${pHeight}%`, minHeight: 6 }}
                          />
                        )}
                        {showProducts && (
                          <div
                            className="w-2.5 rounded-t-sm bg-[#d37b2a]"
                            style={{ height: `${prodHeight}%`, minHeight: 6 }}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-semibold">
                        {showPartners && <span className="text-[#b02b24]">{d.partner}</span>}
                        {showPartners && showProducts && <span className="text-[#c9b5aa]">/</span>}
                        {showProducts && <span className="text-[#d37b2a]">{d.product}</span>}
                      </div>
                      <span className="truncate text-center leading-tight">{d.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function BarRow({
  label,
  value,
  max,
  badge,
  barClass,
}: {
  label: string;
  value: number;
  max: number;
  badge?: string | null;
  barClass: string;
}) {
  const percent = Math.max(6, max > 0 ? Math.round((value / max) * 100) : 0);
  return (
    <div className="space-y-2 rounded-xl border border-[#eaded5] bg-[#fff8f3] p-3">
      <div className="flex items-center justify-between gap-2 text-sm text-[#2f1d15]">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-medium">{label}</span>
          {badge && (
            <Badge variant="outline" className="shrink-0 border-[#eaded5] text-[11px] text-[#7a5a4b]">
              {badge}
            </Badge>
          )}
        </div>
        <span className="text-[#7a5a4b]">{value} cliques</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#f3e7de]">
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${barClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
