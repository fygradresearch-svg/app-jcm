import React from 'react';
import { TopsisRow, Market } from '../types';
import { ArrowRight, Award } from 'lucide-react';
import { CHART_PALETTE } from '../theme/chartTheme';

interface MarketRankingProps {
  ranking: TopsisRow[];
  markets: Market[];
  selectedMarketId: string | null;
  onSelectMarket: (id: string) => void;
}

export const MarketRanking: React.FC<MarketRankingProps> = ({
  ranking,
  markets,
  selectedMarketId,
  onSelectMarket,
}) => {
  const getBadgeClass = (level: string) => {
    switch (level) {
      case 'Alto':
        return 'badge-level-alto';
      case 'Medio':
        return 'badge-level-medio';
      case 'Bajo':
      default:
        return 'badge-level-bajo';
    }
  };

  const maxCc = ranking.length > 0 ? Math.max(...ranking.map((r) => r.cc)) : 1;

  return (
    <div className="academic-panel overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[#fafafa]">
        <div>
          <h3 className="section-title text-base">Ranking de mercados destino</h3>
          <p className="text-[var(--color-ink-subtle)] text-xs mt-0.5">
            Ordenamiento por coeficiente de cercanía relativa (CC)
          </p>
        </div>
        {ranking.length > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 bg-[var(--color-accent-muted)] text-[#234e52] text-[11px] px-3 py-1 rounded border border-[#b2f5ea] font-medium">
            <Award className="w-3.5 h-3.5" />
            <span>{ranking[0].marketName}</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left border-collapse scientific-table">
          <thead>
            <tr>
              <th className="text-center w-14">Pos.</th>
              <th>Mercado</th>
              <th>CC</th>
              <th className="w-28 text-center">Nivel</th>
              <th className="text-right w-24 no-print">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {ranking.map((row, index) => {
              const isFirst = index === 0;
              const isSelected = selectedMarketId === row.marketId;
              const marketObj = markets.find((m) => m.id === row.marketId);

              return (
                <tr
                  key={row.marketId}
                  className={`transition-colors ${
                    isFirst ? 'bg-[#f0fff4]/40' : 'hover:bg-[#f7fafc]'
                  } ${isSelected ? 'bg-[#edf2f7]' : ''}`}
                >
                  <td className="text-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-semibold kpi-value ${
                        isFirst
                          ? 'bg-[var(--color-accent)] text-white'
                          : index === 1
                          ? 'bg-[var(--color-navy)] text-white'
                          : index === 2
                          ? 'bg-[var(--color-navy-light)] text-white'
                          : 'bg-[#edf2f7] text-[var(--color-ink-muted)]'
                      }`}
                    >
                      {row.rank}
                    </span>
                  </td>

                  <td className="font-medium">
                    <span className="flex items-center gap-2">
                      <span className="text-base leading-none">{marketObj?.flag}</span>
                      <span>{row.marketName}</span>
                      {isFirst && (
                        <span className="text-[9px] text-[#234e52] bg-[var(--color-accent-muted)] px-1.5 py-0.5 rounded font-semibold tracking-wide uppercase border border-[#b2f5ea]">
                          Óptimo
                        </span>
                      )}
                    </span>
                  </td>

                  <td>
                    <div className="flex items-center gap-3">
                      <span className="kpi-value text-sm w-12">{row.cc.toFixed(3)}</span>
                      <div className="w-28 bg-[#edf2f7] h-1.5 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(row.cc / maxCc) * 100}%`,
                            backgroundColor: isFirst ? CHART_PALETTE.accent : CHART_PALETTE.steel,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${getBadgeClass(row.level)}`}>
                      {row.level}
                    </span>
                  </td>

                  <td className="text-right no-print">
                    <button
                      onClick={() => onSelectMarket(row.marketId)}
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded transition-all border ${
                        isSelected
                          ? 'text-[var(--color-navy)] bg-[#edf2f7] border-[var(--color-border-strong)]'
                          : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] bg-white border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
                      }`}
                    >
                      <span>Ficha</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default MarketRanking;
