import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Criterion } from '../types';
import { FAHP_CR } from '../data/criteria';
import { CHART_PALETTE, CHART_TOOLTIP_STYLE } from '../theme/chartTheme';

interface FahpWeightsProps {
  criteria: Criterion[];
}

const COLORS = [
  CHART_PALETTE.navy,
  CHART_PALETTE.slate,
  CHART_PALETTE.steel,
  CHART_PALETTE.silver,
];

export const FahpWeights: React.FC<FahpWeightsProps> = ({ criteria }) => {
  const chartData = criteria.map((c) => ({
    name: c.code,
    fullName: c.name,
    value: parseFloat((c.weight * 100).toFixed(1)),
  }));

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  return (
    <div className="academic-panel p-6 flex flex-col h-full">
      <div className="border-b border-[var(--color-border)] pb-3 mb-4">
        <p className="section-eyebrow">Ponderación FAHP</p>
        <h3 className="section-title text-base flex items-center justify-between">
          <span>Pesos de criterios</span>
          <span className="text-[11px] font-normal text-[var(--color-ink-subtle)] bg-[#edf2f7] px-2 py-0.5 rounded font-mono">
            Σ = {(totalWeight * 100).toFixed(0)}%
          </span>
        </h3>
        <p className="text-[var(--color-ink-subtle)] text-xs mt-1">
          Importancia relativa por comparación pareada difusa
        </p>
      </div>

      <div className="h-40 w-full flex items-center justify-center mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, _name, props) => [
                `${value ?? 0}%`,
                (props as { payload?: { fullName?: string } }).payload?.fullName ?? '',
              ]}
              contentStyle={CHART_TOOLTIP_STYLE}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 flex-grow">
        {criteria.map((c, index) => (
          <div key={c.id}>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-sm inline-block shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-semibold text-[var(--color-navy)]">{c.code}</span>
                <span className="text-[var(--color-ink-muted)] truncate" title={c.name}>
                  {c.name}
                </span>
              </span>
              <span className="kpi-value text-xs shrink-0 ml-2">{(c.weight * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-[#edf2f7] h-1 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${c.weight * 100}%`,
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex items-center justify-between bg-[#fafafa] -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
        <div>
          <p className="section-eyebrow">Índice de consistencia</p>
          <p className="kpi-value text-sm mt-0.5">CR = {FAHP_CR.toFixed(4)}</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium badge-level-alto">
            CR &lt; 0,10
          </span>
          <p className="text-[10px] text-[var(--color-ink-subtle)] mt-1">Matriz consistente</p>
        </div>
      </div>
    </div>
  );
};
export default FahpWeights;
