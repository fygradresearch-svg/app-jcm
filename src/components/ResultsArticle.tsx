import React from 'react';
import { TopsisRow, Market } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList, CartesianGrid } from 'recharts';
import { Award, FileText } from 'lucide-react';
import { CHART_PALETTE, CHART_TOOLTIP_STYLE, CHART_AXIS_TICK, PRODUCT } from '../theme/chartTheme';

interface ResultsArticleProps {
  ranking: TopsisRow[];
  markets: Market[];
}

export const ResultsArticle: React.FC<ResultsArticleProps> = ({ ranking, markets }) => {
  const chartData = [...ranking]
    .sort((a, b) => a.cc - b.cc)
    .map((r) => ({
      name: r.marketName,
      cc: parseFloat(r.cc.toFixed(3)),
      isTop: r.rank === 1,
    }));

  const recommendedMarket = ranking.find((r) => r.rank === 1);
  const recommendedMarketObj = recommendedMarket
    ? markets.find((m) => m.id === recommendedMarket.marketId)
    : null;

  return (
    <div className="space-y-8">
      <header className="academic-panel px-6 py-5 border-l-[3px] border-l-[var(--color-navy)]">
        <p className="section-eyebrow">Sección de resultados</p>
        <h2 className="section-title text-xl flex items-center gap-2">
          <FileText className="w-5 h-5 text-[var(--color-ink-subtle)]" />
          Priorización de mercados mediante TOPSIS
        </h2>
        <p className="text-sm text-[var(--color-ink-muted)] mt-2 max-w-3xl leading-relaxed">
          Coeficientes de cercanía relativa (CC) y clasificación cualitativa de las alternativas
          evaluadas para la exportación de {PRODUCT.name} (<span className="font-mono text-xs">HS {PRODUCT.hsCode}</span>).
        </p>
      </header>

      {recommendedMarket && (
        <div className="academic-panel p-6 border-l-[3px] border-l-[var(--color-accent)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[var(--color-accent)] text-white rounded flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--color-ink)] text-sm" style={{ fontFamily: 'var(--font-serif)' }}>
                Alternativa óptima identificada
              </h3>
              <p className="text-sm text-[var(--color-ink-muted)]">
                <strong className="text-[var(--color-ink)]">{recommendedMarket.marketName}</strong>{' '}
                {recommendedMarketObj?.flag} obtuvo el mayor coeficiente de cercanía relativa (
                <span className="kpi-value">CC = {recommendedMarket.cc.toFixed(3)}</span>),
                posicionándose en primer lugar del ranking.
              </p>
              <blockquote className="figure-caption border-l-2 border-[var(--color-border-strong)] pl-4 mt-3 not-italic text-[var(--color-ink-muted)]">
                «{recommendedMarket.marketName} presentó el mayor coeficiente de cercanía relativa (CC = {recommendedMarket.cc.toFixed(3)})
                en el análisis de mercados para {PRODUCT.name}, consolidando su posición como destino prioritario
                para la cadena de valor exportadora de {PRODUCT.origin}.»
              </blockquote>
            </div>
          </div>
        </div>
      )}

      <section>
        <p className="section-eyebrow mb-1">Figura 2</p>
        <h3 className="section-title text-base mb-3">
          Coeficiente de cercanía relativa (CC) por mercado
        </h3>
        <div className="academic-panel p-6">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 50, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 0.8]}
                  tick={CHART_AXIS_TICK}
                  axisLine={{ stroke: '#cbd5e0' }}
                  tickLine={false}
                  tickFormatter={(v) => v.toFixed(2)}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={CHART_AXIS_TICK}
                  width={115}
                />
                <Tooltip
                  formatter={(value) => [`CC = ${value ?? 0}`, 'Coeficiente']}
                  contentStyle={CHART_TOOLTIP_STYLE}
                />
                <Bar dataKey="cc" radius={[0, 3, 3, 0]} barSize={18}>
                  <LabelList
                    dataKey="cc"
                    position="right"
                    fill={CHART_PALETTE.navy}
                    fontWeight={600}
                    fontFamily="IBM Plex Mono, monospace"
                    fontSize={11}
                    offset={8}
                  />
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isTop ? CHART_PALETTE.accent : CHART_PALETTE.muted[index % CHART_PALETTE.muted.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="figure-caption mt-3 text-center">
            Figura 2. Distribución del coeficiente de cercanía relativa (CC) para mercados de {PRODUCT.name}.
            La barra resaltada corresponde a la alternativa óptima.
          </p>
        </div>
      </section>

      <section>
        <p className="section-eyebrow mb-1">Tabla 2</p>
        <h3 className="section-title text-base mb-3">Ranking consolidado de alternativas</h3>
        <div className="academic-panel overflow-hidden">
          <table className="w-full scientific-table">
            <thead>
              <tr>
                <th className="text-center w-16">Pos.</th>
                <th>Mercado evaluado</th>
                <th className="text-center">CC</th>
                <th className="text-center">Clasificación</th>
                <th>Interpretación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {ranking.map((row) => {
                const isTop = row.rank === 1;
                const marketObj = markets.find((m) => m.id === row.marketId);

                return (
                  <tr key={row.marketId} className={isTop ? 'bg-[#f0fff4]/30' : ''}>
                    <td className="text-center kpi-value">{row.rank}</td>
                    <td className="font-medium">
                      <span className="flex items-center gap-1.5">
                        <span>{marketObj?.flag}</span>
                        <span>{row.marketName}</span>
                      </span>
                    </td>
                    <td className="text-center kpi-value">{row.cc.toFixed(3)}</td>
                    <td className="text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                        row.level === 'Alto' ? 'badge-level-alto' : row.level === 'Medio' ? 'badge-level-medio' : 'badge-level-bajo'
                      }`}>
                        {row.level}
                      </span>
                    </td>
                    <td className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      {isTop
                        ? 'Destino prioritario: combina alto potencial de importación de producto congelado, logística eficiente y marco normativo favorable.'
                        : row.level === 'Medio'
                        ? 'Mercado viable con desempeño intermedio; requiere estrategia diferenciada frente al líder.'
                        : 'Potencial limitado por barreras arancelarias o menor escala de mercado para fresa congelada.'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
export default ResultsArticle;
