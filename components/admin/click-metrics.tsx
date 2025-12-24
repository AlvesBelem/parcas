"use client";

import { useState } from "react";

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

  const partnerData = partnerStats[period] ?? [];
  const productData = productStats[period] ?? [];
  const currentPeriod = periods.find((p) => p.key === period) ?? periods[1];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center space-y-4">
      <div className="w-[90vw] max-w-6xl sm:w-full">
        <div className="rounded-2xl border border-[#b02a20]/15 bg-white/85 p-4 shadow-sm">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Visão rápida</p>
              <p className="text-lg font-semibold text-[#2d1c16]">Métricas de cliques</p>
              <p className="text-sm text-neutral-600">Escolha o período e veja os destaques.</p>
            </div>
            <div className="hidden flex-nowrap gap-2 overflow-x-auto rounded-full border border-[#b02a20]/20 bg-[#fff7f2] p-1 sm:flex">
              {periods.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPeriod(p.key)}
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition ${
                    p.key === period
                      ? "bg-[#b02a20] text-white shadow-[0_0_0_1px_rgba(176,42,32,0.35)]"
                      : "text-[#b02a20] hover:bg-[#fff0e6]"
                  }`}
                  aria-pressed={p.key === period}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:justify-center lg:grid-cols-2 lg:items-start">
        <div className="mx-auto w-[90vw] max-w-[720px] sm:w-full">
          <MetricCard
            title="Cliques em parceiros"
            helper="Engajamento dos links de saída."
            data={partnerData}
            periodLabel={currentPeriod.helper}
          />
        </div>
        <div className="mx-auto w-[90vw] max-w-[720px] sm:w-full">
          <MetricCard
            title="Cliques em produtos"
            helper="Saídas para ofertas e afiliados."
            data={productData}
            periodLabel={currentPeriod.helper}
          />
        </div>
        <div className="mx-auto w-[95vw] max-w-[900px] sm:w-full lg:col-span-2">
          <DailyChart partnerSeries={partnerSeries} productSeries={productSeries} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  helper,
  data,
  periodLabel,
}: {
  title: string;
  helper: string;
  data: ClickStatEntry[];
  periodLabel: string;
}) {
  const max = data[0]?.clicks ?? 1;
  return (
    <Card className="h-full border-[#b02a20]/10 bg-white">
      <CardHeader>
        <CardDescription className="uppercase tracking-[0.35em] text-xs text-neutral-500">
          Métricas de cliques
        </CardDescription>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-xl text-[#2d1c16]">{title}</CardTitle>
          <span className="rounded-full border border-[#b02a20]/20 bg-[#fff4ee] px-3 py-1 text-[11px] font-semibold text-[#b02a20]">
            {periodLabel}
          </span>
        </div>
        <p className="text-sm text-neutral-600">{helper}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 && (
          <p className="text-sm text-neutral-600">Nenhum clique registrado nesse período.</p>
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
    <Card className="w-full max-w-full border-[#b02a20]/10 bg-white">
      <CardHeader>
        <CardDescription className="uppercase tracking-[0.35em] text-xs text-neutral-500">
          Cliques diários (30 dias)
        </CardDescription>
        <CardTitle className="text-xl text-[#2d1c16]">Evolução diária</CardTitle>
        <p className="text-sm text-neutral-600">
          Barras lado a lado para parceiros (vermelho) e produtos (dourado).
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {limited.length === 0 ? (
          <p className="text-sm text-neutral-600">Sem cliques registrados neste período.</p>
        ) : (
          <>
            <div className="flex items-center gap-3 text-xs text-neutral-600">
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-[#b02a20]" />
                Parceiros
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-[#f3c56b]" />
                Produtos
              </span>
            </div>
            <div className="max-w-full overflow-x-auto rounded-xl border border-[#b02a20]/10 bg-[#fff7f2] p-3">
              <div className="flex items-end gap-2">
                {limited.map((d) => {
                  const pHeight = Math.max(6, Math.round((d.partner / max) * 80));
                  const prodHeight = Math.max(6, Math.round((d.product / max) * 80));
                  return (
                    <div
                      key={d.date}
                      className="flex min-w-14 flex-col items-center gap-1 text-[10px] text-neutral-600"
                    >
                      <div className="flex h-24 w-full items-end justify-center gap-1">
                        <div
                          className="w-2.5 rounded-t-sm bg-[#b02a20]"
                          style={{ height: `${pHeight}%`, minHeight: 6 }}
                        />
                        <div
                          className="w-2.5 rounded-t-sm bg-[#f3c56b]"
                          style={{ height: `${prodHeight}%`, minHeight: 6 }}
                        />
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
}: {
  label: string;
  value: number;
  max: number;
  badge?: string | null;
}) {
  const percent = Math.max(6, max > 0 ? Math.round((value / max) * 100) : 0);
  return (
    <div className="space-y-2 rounded-xl border border-[#b02a20]/10 bg-[#fff7f2] p-3">
      <div className="flex items-center justify-between gap-2 text-sm text-[#2d1c16]">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-medium">{label}</span>
          {badge && (
            <Badge variant="outline" className="shrink-0 border-[#b02a20]/30 text-[11px] text-[#b02a20]">
              {badge}
            </Badge>
          )}
        </div>
        <span className="text-neutral-600">{value} cliques</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#b02a20] via-[#c64934] to-[#f3c56b]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
