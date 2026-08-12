import React from 'react';
import { Market, TopsisRow, Criterion } from '../types';
import { MarketMap } from './MarketMap';
import { MarketRanking } from './MarketRanking';
import { MarketDetail } from './MarketDetail';
import { FahpWeights } from './FahpWeights';
import { Globe, BarChart2, Award, Sigma } from 'lucide-react';
import { PRODUCT } from '../theme/chartTheme';

interface DashboardProps {
  markets: Market[];
  criteria: Criterion[];
  ranking: TopsisRow[];
  selectedMarketId: string | null;
  onSelectMarket: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  markets,
  criteria,
  ranking,
  selectedMarketId,
  onSelectMarket,
}) => {
  const recommendedMarket = ranking.length > 0 ? ranking[0] : null;
  const recommendedMarketObj = recommendedMarket
    ? markets.find((m) => m.id === recommendedMarket.marketId)
    : null;

  const selectedMarketObj = selectedMarketId
    ? markets.find((m) => m.id === selectedMarketId)
    : null;
  const selectedTopsisObj = selectedMarketId
    ? ranking.find((r) => r.marketId === selectedMarketId)
    : null;

  return (
    <div className="space-y-8">
      {/* Hero — academic paper style */}
      <header className="academic-panel overflow-hidden">
        <div className="border-b border-[var(--color-border)] bg-[#f7fafc] px-6 py-4 md:px-8 md:py-5">
          <p className="section-eyebrow">Estudio multicriterio · FAHP-TOPSIS</p>
          <h1 className="text-xl md:text-2xl font-semibold text-[var(--color-navy)] mt-1 leading-snug">
            Sistema de Recomendación de Mercados de Exportación
          </h1>
          <p className="text-sm text-[var(--color-ink-muted)] mt-2 max-w-3xl leading-relaxed">
            Plataforma de apoyo a la decisión para la priorización de mercados internacionales de{' '}
            <strong className="font-medium text-[var(--color-ink)]">{PRODUCT.name}</strong>{' '}
            (<span className="font-mono text-xs">HS {PRODUCT.hsCode}</span>) originada en{' '}
            {PRODUCT.origin}. Los resultados se obtienen mediante el método híbrido FAHP–TOPSIS
            con validación de consistencia (CR &lt; 0,10).
          </p>
        </div>
        <div className="px-6 py-3 md:px-8 flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-[var(--color-ink-subtle)] border-b border-[var(--color-border)]">
          <span><strong className="text-[var(--color-ink-muted)]">Producto:</strong> {PRODUCT.fullLabel}</span>
          <span><strong className="text-[var(--color-ink-muted)]">Metodología:</strong> Delphi Fuzzy → FAHP → TOPSIS</span>
          <span><strong className="text-[var(--color-ink-muted)]">Alternativas:</strong> {markets.length} mercados destino</span>
        </div>
      </header>

      {/* KPI row */}
      <section aria-label="Indicadores resumen">
        <p className="section-eyebrow mb-3">Resumen ejecutivo</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="academic-panel p-5 flex items-start gap-4">
            <div className="w-9 h-9 rounded-md bg-[#edf2f7] flex items-center justify-center text-[var(--color-navy)] shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="section-eyebrow">Mercados evaluados</p>
              <p className="kpi-value text-2xl mt-0.5">{markets.length}</p>
            </div>
          </div>

          <div className="academic-panel p-5 flex items-start gap-4">
            <div className="w-9 h-9 rounded-md bg-[#edf2f7] flex items-center justify-center text-[var(--color-navy)] shrink-0">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <p className="section-eyebrow">Criterios (FAHP)</p>
              <p className="kpi-value text-2xl mt-0.5">{criteria.length}</p>
            </div>
          </div>

          <div className="academic-panel p-5 flex items-start gap-4 border-l-[3px] border-l-[var(--color-accent)]">
            <div className="w-9 h-9 rounded-md bg-[var(--color-accent-muted)] flex items-center justify-center text-[var(--color-accent)] shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="section-eyebrow">Mercado recomendado</p>
              <p className="text-sm font-semibold text-[var(--color-ink)] mt-0.5 flex items-center gap-1.5 truncate">
                <span>{recommendedMarketObj?.flag}</span>
                <span>{recommendedMarketObj?.name}</span>
              </p>
            </div>
          </div>

          <div className="academic-panel p-5 flex items-start gap-4">
            <div className="w-9 h-9 rounded-md bg-[#edf2f7] flex items-center justify-center text-[var(--color-navy)] shrink-0">
              <Sigma className="w-4 h-4" />
            </div>
            <div>
              <p className="section-eyebrow">Coeficiente CC máximo</p>
              <p className="kpi-value text-2xl mt-0.5">{recommendedMarket?.cc.toFixed(3)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map + weights */}
      <section aria-label="Geovisualización y ponderación">
        <div className="flex items-baseline justify-between mb-3">
          <div>

            <h2 className="section-title">Geovisualización y ponderación de criterios</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 h-[460px]">
            <MarketMap
              ranking={ranking}
              selectedMarketId={selectedMarketId}
              onSelectMarket={onSelectMarket}
            />
          </div>
          <div>
            <FahpWeights criteria={criteria} />
          </div>
        </div>
        <p className="figure-caption mt-2">
          Distribución espacial de mercados según el coeficiente de cercanía relativa (CC) y pesos FAHP del escenario base.
        </p>
      </section>

      {/* Ranking + detail */}
      <section aria-label="Ranking y ficha de mercado">
        <div className="mb-3">
          <p className="section-eyebrow">Tabla 1</p>
          <h2 className="section-title">Ranking de mercados y ficha analítica</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <MarketRanking
              ranking={ranking}
              markets={markets}
              selectedMarketId={selectedMarketId}
              onSelectMarket={onSelectMarket}
            />
          </div>
          <div>
            <MarketDetail
              market={selectedMarketObj || null}
              topsisInfo={selectedTopsisObj || null}
              allMarkets={markets}
              onClose={() => onSelectMarket('')}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
export default Dashboard;
