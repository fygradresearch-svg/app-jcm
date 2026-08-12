import React, { useState } from 'react';
import { TopsisStepDetails, Criterion } from '../types';
import { ChevronDown, ChevronUp, Code, Database, Info } from 'lucide-react';

interface TopsisProcessProps {
  topsisDetails: TopsisStepDetails;
  criteria: Criterion[];
}

export const TopsisProcess: React.FC<TopsisProcessProps> = ({
  topsisDetails,
  criteria,
}) => {
  const [openStep, setOpenStep] = useState<number | null>(0); // Step 1 open by default

  const toggleStep = (index: number) => {
    setOpenStep(openStep === index ? null : index);
  };

  const steps = [
    {
      title: '1. Matriz de Decisión Original (X)',
      description: 'Valores empíricos recopilados de los mercados para cada criterio de evaluación.',
      render: () => (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <th className="py-2 px-3">Mercado</th>
              {criteria.map((c) => (
                <th key={c.id} className="py-2 px-3 text-right">
                  {c.code} ({c.unit})
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topsisDetails.decisionMatrix.map((row) => (
              <tr key={row.market} className="hover:bg-slate-50/50">
                <td className="py-2 px-3 font-semibold text-slate-800">{row.market}</td>
                {row.values.map((v, idx) => (
                  <td key={idx} className="py-2 px-3 text-right font-mono">
                    {idx === 1 ? v.toLocaleString() : v.toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      title: '2. Matriz Normalizada (R)',
      description:
        'Normalización vectorial para homogeneizar las unidades de medida: r_ij = x_ij / sqrt(sum_k(x_kj²)).',
      render: () => (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <th className="py-2 px-3">Mercado</th>
              {criteria.map((c) => (
                <th key={c.id} className="py-2 px-3 text-right">
                  {c.code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topsisDetails.normalizedMatrix.map((row) => (
              <tr key={row.market} className="hover:bg-slate-50/50">
                <td className="py-2 px-3 font-semibold text-slate-800">{row.market}</td>
                {row.values.map((v, idx) => (
                  <td key={idx} className="py-2 px-3 text-right font-mono">
                    {v.toFixed(4)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      title: '3. Pesos FAHP Aplicados (W)',
      description: 'Pesos ponderados determinados por el Proceso de Jerarquía Analítica Difusa.',
      render: () => (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <th className="py-2 px-3">Criterio</th>
              <th className="py-2 px-3">Indicador</th>
              <th className="py-2 px-3 text-right">Peso Fracción</th>
              <th className="py-2 px-3 text-right">Porcentaje</th>
              <th className="py-2 px-3 text-center">Naturaleza</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {criteria.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 font-semibold text-slate-800">{c.code}</td>
                <td className="py-2.5 px-3 text-slate-600">{c.name}</td>
                <td className="py-2.5 px-3 text-right font-mono font-semibold">{c.weight.toFixed(3)}</td>
                <td className="py-2.5 px-3 text-right font-mono">{(c.weight * 100).toFixed(1)}%</td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      c.type === 'benefit'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}
                  >
                    {c.type === 'benefit' ? 'Beneficio' : 'Costo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      title: '4. Matriz Ponderada (V)',
      description:
        'Resultado de ponderar la matriz normalizada por los pesos del FAHP: v_ij = w_j × r_ij.',
      render: () => (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <th className="py-2 px-3">Mercado</th>
              {criteria.map((c) => (
                <th key={c.id} className="py-2 px-3 text-right">
                  {c.code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topsisDetails.weightedMatrix.map((row) => (
              <tr key={row.market} className="hover:bg-slate-50/50">
                <td className="py-2 px-3 font-semibold text-slate-800">{row.market}</td>
                {row.values.map((v, idx) => (
                  <td key={idx} className="py-2 px-3 text-right font-mono font-semibold">
                    {v.toFixed(4)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      title: '5. Solución Ideal Positiva (A+)',
      description:
        'Solución de referencia superior. Máximos para criterios de beneficio; mínimos para costos.',
      render: () => (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              {criteria.map((c) => (
                <th key={c.id} className="py-2 px-3 text-right">
                  {c.code} ({c.type === 'benefit' ? 'Max' : 'Min'})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-emerald-50/20 font-mono font-bold text-emerald-800 text-sm">
              {topsisDetails.idealPositive.map((v, idx) => (
                <td key={idx} className="py-3 px-3 text-right">
                  {v.toFixed(4)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      ),
    },
    {
      title: '6. Solución Ideal Negativa (A-)',
      description:
        'Solución de referencia inferior. Mínimos para criterios de beneficio; máximos para costos.',
      render: () => (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              {criteria.map((c) => (
                <th key={c.id} className="py-2 px-3 text-right">
                  {c.code} ({c.type === 'benefit' ? 'Min' : 'Max'})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-rose-50/20 font-mono font-bold text-rose-800 text-sm">
              {topsisDetails.idealNegative.map((v, idx) => (
                <td key={idx} className="py-3 px-3 text-right">
                  {v.toFixed(4)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      ),
    },
    {
      title: '7. Distancias a la Solución Ideal Positiva (D+)',
      description: 'Separación euclidiana de cada mercado con respecto al ideal superior A+.',
      render: () => (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <th className="py-2 px-3">Mercado</th>
              <th className="py-2 px-3 text-right">Distancia D+</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {topsisDetails.distancesPositive.map((row) => (
              <tr key={row.market} className="hover:bg-slate-50/50">
                <td className="py-2 px-3 font-sans font-semibold text-slate-800">{row.market}</td>
                <td className="py-2 px-3 text-right font-bold text-slate-700">
                  {row.value.toFixed(6)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      title: '8. Distancias a la Solución Ideal Negativa (D-)',
      description: 'Separación euclidiana de cada mercado con respecto al ideal inferior A-.',
      render: () => (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <th className="py-2 px-3">Mercado</th>
              <th className="py-2 px-3 text-right">Distancia D-</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {topsisDetails.distancesNegative.map((row) => (
              <tr key={row.market} className="hover:bg-slate-50/50">
                <td className="py-2 px-3 font-sans font-semibold text-slate-800">{row.market}</td>
                <td className="py-2 px-3 text-right font-bold text-slate-700">
                  {row.value.toFixed(6)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      title: '9. Coeficiente de Cercanía Relativa (CC)',
      description:
        'Indicador sintético de prioridad: CC_i = D_i- / (D_i+ + D_i-). Valores cercanos a 1 son mejores.',
      render: () => (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <th className="py-2 px-3">Mercado</th>
              <th className="py-2 px-3 text-right">Fórmula: D- / (D+ + D-)</th>
              <th className="py-2 px-3 text-right">Coeficiente CC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {topsisDetails.coefficients.map((row, idx) => {
              const dPlus = topsisDetails.distancesPositive[idx].value;
              const dMinus = topsisDetails.distancesNegative[idx].value;
              return (
                <tr key={row.market} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">
                    {row.market}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400 text-[10px]">
                    {dMinus.toFixed(4)} / ({dPlus.toFixed(4)} + {dMinus.toFixed(4)})
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-indigo-900 bg-indigo-50/10">
                    {row.value.toFixed(6)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ),
    },
    {
      title: '10. Ordenamiento y Ranking de Priorización',
      description: 'Clasificación final ordenada de mayor a menor coeficiente CC.',
      render: () => (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <th className="py-2 px-3 text-center w-12">Pos</th>
              <th className="py-2 px-3">Mercado</th>
              <th className="py-2 px-3 text-right">Coeficiente CC</th>
              <th className="py-2 px-3 text-center">Clasificación Cualitativa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topsisDetails.ranking.map((row) => (
              <tr
                key={row.marketId}
                className={`hover:bg-slate-50/50 ${
                  row.rank === 1 ? 'bg-emerald-50/10' : ''
                }`}
              >
                <td className="py-2.5 px-3 text-center font-bold font-mono">
                  {row.rank}
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  {row.marketName}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                  {row.cc.toFixed(4)}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                      row.level === 'Alto'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : row.level === 'Medio'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {row.level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div>
        <h3 className="text-slate-900 font-bold text-lg">Procedimiento Matemático TOPSIS</h3>
        <p className="text-slate-500 text-xs mt-0.5">
          Trazabilidad completa paso a paso de los cálculos ejecutados dinámicamente en el navegador.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs text-slate-600 flex gap-2 mb-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-normal">
          Los resultados son de naturaleza puramente determinista y multicriterio. El sistema no hace uso de redes neuronales, predicciones probabilísticas ni algoritmos de caja negra.
        </p>
      </div>

      {/* Accordion list */}
      <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200">
        {steps.map((step, index) => {
          const isOpen = openStep === index;
          return (
            <div key={index} className="flex flex-col">
              <button
                onClick={() => toggleStep(index)}
                className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 text-left font-semibold text-slate-800 text-sm transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-slate-200/80 text-slate-700 flex items-center justify-center font-mono text-xs">
                    {index + 1}
                  </span>
                  {step.title}
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {isOpen && (
                <div className="p-4 border-t border-slate-200/60 bg-white space-y-4 transition-all">
                  <p className="text-slate-500 text-xs">{step.description}</p>
                  <div className="overflow-x-auto border border-slate-100 rounded-lg">
                    {step.render()}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default TopsisProcess;
