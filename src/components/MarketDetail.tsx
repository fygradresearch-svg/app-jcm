import React from 'react';
import { Market, TopsisRow } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, X, Shield, BarChart3, Truck, Percent } from 'lucide-react';
import { CHART_PALETTE, CHART_TOOLTIP_STYLE } from '../theme/chartTheme';

interface MarketDetailProps {
  market: Market | null;
  topsisInfo: TopsisRow | null;
  allMarkets: Market[];
  onClose: () => void;
}

export const MarketDetail: React.FC<MarketDetailProps> = ({
  market,
  topsisInfo,
  allMarkets,
  onClose,
}) => {
  if (!market || !topsisInfo) {
    return (
      <div className="academic-panel p-8 flex flex-col items-center justify-center text-center h-full min-h-[350px]">
        <AlertCircle className="w-9 h-9 text-[var(--color-ink-subtle)] mb-3 opacity-50" />
        <h3 className="section-title text-base">Ficha analítica de mercado</h3>
        <p className="text-[var(--color-ink-subtle)] text-xs mt-2 max-w-[220px] leading-relaxed">
          Seleccione un mercado en el mapa o en la tabla de ranking para visualizar sus indicadores empíricos.
        </p>
      </div>
    );
  }

  const maxGfsi = Math.max(...allMarkets.map((m) => m.gfsi));
  const maxImport = Math.max(...allMarkets.map((m) => m.importations));
  const maxLpi = Math.max(...allMarkets.map((m) => m.lpi));
  const maxArancel = Math.max(...allMarkets.map((m) => m.arancel));

  const normalizedData = [
    { name: 'Quality & Safety', raw: market.gfsi, value: parseFloat(((market.gfsi / maxGfsi) * 100).toFixed(1)), color: CHART_PALETTE.navy },
    { name: 'Importaciones', raw: market.importations.toLocaleString(), value: parseFloat(((market.importations / maxImport) * 100).toFixed(1)), color: CHART_PALETTE.slate },
    { name: 'LPI', raw: market.lpi.toFixed(2), value: parseFloat(((market.lpi / maxLpi) * 100).toFixed(1)), color: CHART_PALETTE.steel },
    { name: 'Arancel', raw: `${market.arancel}%`, value: maxArancel === 0 ? 0 : parseFloat(((market.arancel / maxArancel) * 100).toFixed(1)), color: CHART_PALETTE.silver },
  ];

  const getLevelClass = (level: string) => {
    switch (level) {
      case 'Alto': return 'badge-level-alto';
      case 'Medio': return 'badge-level-medio';
      default: return 'badge-level-bajo';
    }
  };

  const indicators = [
    { icon: Shield, code: 'C1', label: 'Quality and Safety — GFSI', value: market.gfsi, source: 'Economist Impact (2022)', unit: '0–100' },
    { icon: BarChart3, code: 'C2', label: 'Importaciones fresa congelada', value: `${market.importations.toLocaleString()} t`, source: 'UN Comtrade / WITS (2023)', unit: 'toneladas' },
    { icon: Truck, code: 'C3', label: 'LPI — Desempeño logístico', value: market.lpi.toFixed(2), source: 'Banco Mundial (2023)', unit: '1–5' },
    { icon: Percent, code: 'C4', label: 'Arancel de referencia (costo)', value: `${market.arancel}%`, source: 'Matriz arancelaria del estudio (oct. 2026)', unit: '%' },
  ];

  return (
    <div className="academic-panel flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[#fafafa]">
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none">{market.flag}</span>
          <div>
            <h3 className="section-title text-lg">{market.name}</h3>
            <p className="text-[var(--color-ink-subtle)] text-[11px] font-mono">ISO {market.code}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] hover:bg-[#edf2f7] p-1.5 rounded border border-[var(--color-border)] no-print"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-5 overflow-y-auto flex-grow">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#f7fafc] p-3 rounded border border-[var(--color-border)] text-center">
            <p className="section-eyebrow">Posición</p>
            <p className="kpi-value text-xl mt-0.5">#{topsisInfo.rank}</p>
          </div>
          <div className="bg-[#f7fafc] p-3 rounded border border-[var(--color-border)] text-center">
            <p className="section-eyebrow">CC</p>
            <p className="kpi-value text-xl mt-0.5">{topsisInfo.cc.toFixed(3)}</p>
          </div>
          <div className="bg-[#f7fafc] p-3 rounded border border-[var(--color-border)] text-center flex flex-col justify-center items-center">
            <p className="section-eyebrow">Nivel</p>
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold mt-1 ${getLevelClass(topsisInfo.level)}`}>
              {topsisInfo.level}
            </span>
          </div>
        </div>

        <div>
          <p className="section-eyebrow mb-2">Indicadores de entrada</p>
          <div className="space-y-2">
            {indicators.map((ind) => {
              const Icon = ind.icon;
              return (
                <div key={ind.code} className="border border-[var(--color-border)] rounded p-3 hover:bg-[#fafafa] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-ink-muted)] flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-[var(--color-ink-subtle)]" />
                      <span className="font-semibold text-[var(--color-navy)]">{ind.code}</span>
                      {ind.label}
                    </span>
                    <span className="kpi-value text-sm">{ind.value}</span>
                  </div>
                  <p className="text-[10px] text-[var(--color-ink-subtle)] mt-1">
                    {ind.source} · {ind.unit}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="section-eyebrow mb-2">Desempeño relativo normalizado</p>
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={normalizedData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" hide />
                <Tooltip
                  formatter={(value, _name, props) => [
                    `${value ?? 0}% del máximo`,
                    `Valor: ${(props as { payload?: { raw?: string | number } }).payload?.raw ?? ''}`,
                  ]}
                  contentStyle={CHART_TOOLTIP_STYLE}
                />
                <Bar dataKey="value" radius={[0, 3, 3, 0]} barSize={10}>
                  {normalizedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 text-[10px] text-[var(--color-ink-muted)]">
            {normalizedData.map((d, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: d.color }} />
                <span>{d.name}:</span>
                <span className="kpi-value">{d.value}%</span>
              </div>
            ))}
          </div>
          <p className="figure-caption mt-3 text-[10px] flex gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            Valores normalizados respecto al máximo del conjunto de alternativas evaluadas.
          </p>
        </div>
      </div>
    </div>
  );
};
export default MarketDetail;
