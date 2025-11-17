"use client";

import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ClickStatEntry, ClickSeriesPoint } from "@/lib/data/click-stats";

const periods = [
  { key: "day", label: "Dia", helper: "últimas 24h" },
  { key: "week", label: "Semana", helper: "últimos 7 dias" },
  { key: "month", label: "Mês", helper: "últimos 30 dias" },
  { key: "year", label: "Ano", helper: "últimos 365 dias" },
] as const;

type MetricMap = Record<(typeof periods)[number]["key"], ClickStatEntry[]>;

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
  const [period, setPeriod] = useState<(typeof periods)[number]["key"]>("week");

  const partnerData = partnerStats[period] ?? [];
  const productData = productStats[period] ?? [];

  return (
    <div className="grid w-full max-w-full gap-4 lg:grid-cols-2 lg:items-start">
      <div className="lg:col-span-2">
        <MetricCard
          title="Cliques em parceiros"
          helper="Engajamento dos links de saída."
          data={partnerData}
          period={period}
          onPeriodChange={setPeriod}
        />
      </div>
      <div className="lg:col-span-2">
        <MetricCard
          title="Cliques em produtos"
          helper="Saídas para ofertas e afiliados."
          data={productData}
          period={period}
          onPeriodChange={setPeriod}
        />
      </div>
      <div className="lg:col-span-2">
        <DailyChart partnerSeries={partnerSeries} productSeries={productSeries} />
      </div>
    </div>
  );
}

function MetricCard({
  title,
  helper,
  data,
  period,
  onPeriodChange,
}: {
  title: string;
  helper: string;
  data: ClickStatEntry[];
  period: (typeof periods)[number]["key"];
  onPeriodChange: (key: (typeof periods)[number]["key"]) => void;
}) {
  const max = data[0]?.clicks ?? 1;
  return (
    <Card className="border-white/10 bg-black/30">
      <CardHeader>
        <CardDescription className="uppercase tracking-[0.35em] text-xs text-white/50">
          Métricas de cliques
        </CardDescription>
        <CardTitle className="text-xl text-white">{title}</CardTitle>
        <p className="text-sm text-white/60">{helper}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {periods.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => onPeriodChange(p.key)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                p.key === period
                  ? "border-lime-300/60 bg-lime-300/10 text-lime-100"
                  : "border-white/15 text-white/70 hover:border-white/30"
              }`}
              aria-pressed={p.key === period}
            >
              {p.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 && (
          <p className="text-sm text-white/60">Nenhum clique registrado nesse período.</p>
        )}
        {data.map((item) => (
          <BarRow key={item.id} label={item.label} badge={item.badge} value={item.clicks} max={max} />
        ))}
      </CardContent>
    </Card>
  );
}

function DailyChart({
  partnerSeries,
  productSeries,
}: {
  partnerSeries: ClickSeriesPoint[];
  productSeries: ClickSeriesPoint[];
}) {
  const formatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });

  const merged = partnerSeries.map((p, idx) => {
    const product = productSeries[idx];
    return {
      date: formatter.format(new Date(p.date)).replace(".", ""),
      partner: p.clicks,
      product: product?.clicks ?? 0,
    };
  });

  const limited = merged.slice(-14);
  const max = Math.max(...limited.map((d) => Math.max(d.partner, d.product)), 1);

  return (
    <Card className="border-white/10 bg-black/30 w-full max-w-full">
      <CardHeader>
        <CardDescription className="uppercase tracking-[0.35em] text-xs text-white/50">
          Cliques diários (30 dias)
        </CardDescription>
        <CardTitle className="text-xl text-white">Evolução diária</CardTitle>
        <p className="text-sm text-white/60">
          Barras lado a lado para parceiros (verde) e produtos (roxo).
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-3 max-w-full">
          {limited.map((d) => {
            const pHeight = Math.max(6, Math.round((d.partner / max) * 80));
            const prodHeight = Math.max(6, Math.round((d.product / max) * 80));
            return (
              <div
                key={d.date}
                className="flex min-w-8 max-w-10 flex-col items-center gap-1 text-[10px] text-white/50"
              >
                <div className="flex h-24 w-full items-end justify-center gap-1">
                  <div
                    className="w-2.5 rounded-t-sm bg-lime-300"
                    style={{ height: `${pHeight}%`, minHeight: 6 }}
                  />
                  <div
                    className="w-2.5 rounded-t-sm bg-indigo-300"
                    style={{ height: `${prodHeight}%`, minHeight: 6 }}
                  />
                </div>
                <span className="truncate text-center leading-tight">{d.date}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function BarRow({
  label,
  value,
  max,
  badge,
}: {
  label: string;
  value: number;
  max: number;
  badge?: string | null;
}) {
  const percent = Math.max(6, max > 0 ? Math.round((value / max) * 100) : 0);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm text-white">
        <span className="truncate">{label}</span>
        <span className="text-white/70">{value} cliques</span>
      </div>
      {badge && <Badge variant="outline">{badge}</Badge>}
      <div className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
        <div className="h-full rounded-full bg-lime-300/80" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
