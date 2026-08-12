import React, { useState, useEffect } from 'react';
import { Criterion, Market, TopsisRow } from '../types';
import { adjustWeightsProportionally } from '../utils/normalizeWeights';
import { runTopsis } from '../utils/topsis';
import { RefreshCw, Play, ArrowUp, ArrowDown, Minus, Info } from 'lucide-react';

interface SensitivityAnalysisProps {
  markets: Market[];
  criteria: Criterion[];
  baseRanking: TopsisRow[];
  isSimulationMode: boolean;
  onSetSimulationMode: (val: boolean) => void;
}

export const SensitivityAnalysis: React.FC<SensitivityAnalysisProps> = ({
  markets,
  criteria,
  baseRanking,
  isSimulationMode,
  onSetSimulationMode,
}) => {
  // Current sliders weight state (ranges 0 to 100)
  const [sliderWeights, setSliderWeights] = useState<number[]>(
    criteria.map((c) => c.weight)
  );

  // Recalculated ranking state
  const [simRanking, setSimRanking] = useState<TopsisRow[]>(baseRanking);

  // Synchronize weights if simulation is turned off or if criteria changes
  useEffect(() => {
    if (!isSimulationMode) {
      setSliderWeights(criteria.map((c) => c.weight));
      setSimRanking(baseRanking);
    }
  }, [isSimulationMode, criteria, baseRanking]);

  // Handle slider change for index i
  const handleSliderChange = (index: number, valPercent: number) => {
    if (!isSimulationMode) return;
    const newVal = valPercent / 100;
    const adjusted = adjustWeightsProportionally(index, newVal, sliderWeights);
    setSliderWeights(adjusted);
  };

  // Run TOPSIS calculation on simulated weights
  const handleRecalculate = () => {
    const criteriaTypes = criteria.map((c) => c.type);
    const result = runTopsis(markets, sliderWeights, criteriaTypes);
    setSimRanking(result.ranking);
  };

  // Restore original FAHP weights
  const handleRestoreWeights = () => {
    const originalWeights = criteria.map((c) => c.weight);
    setSliderWeights(originalWeights);
    const criteriaTypes = criteria.map((c) => c.type);
    const result = runTopsis(markets, originalWeights, criteriaTypes);
    setSimRanking(result.ranking);
  };

  const getRankChange = (marketId: string) => {
    const baseRank = baseRanking.find((r) => r.marketId === marketId)?.rank || 0;
    const newRank = simRanking.find((r) => r.marketId === marketId)?.rank || 0;
    const diff = baseRank - newRank; // positive is good (rank decreased/improved: e.g. 3 to 1)
    return diff;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header and Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h3 className="text-slate-900 font-bold text-lg">Análisis de Sensibilidad</h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Simule variaciones en las prioridades de los criterios para analizar la estabilidad del ranking.
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg self-start">
          <button
            onClick={() => onSetSimulationMode(false)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              !isSimulationMode
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Escenario Artículo
          </button>
          <button
            onClick={() => onSetSimulationMode(true)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              isSimulationMode
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Modo Simulación
          </button>
        </div>
      </div>

      {/* Warnings & Scenario Banner */}
      {!isSimulationMode ? (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-lg text-xs flex gap-2">
          <Info className="w-4.5 h-4.5 shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <p className="font-semibold">Escenario base FAHP–TOPSIS (Bloqueado)</p>
            <p className="text-emerald-700 mt-0.5">
              Los pesos corresponden a los calculados originalmente mediante FAHP en la investigación científica. Cambie a Modo Simulación para interactuar.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-100 text-amber-800 p-3 rounded-lg text-xs flex gap-2">
          <Info className="w-4.5 h-4.5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold">Escenario de simulación (Activo)</p>
            <p className="text-amber-700 mt-0.5">
              Ajuste los pesos para simular nuevos escenarios. Este resultado no corresponde al escenario base aprobado en el artículo.
            </p>
          </div>
        </div>
      )}

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {criteria.map((c, i) => {
          const currentPercent = sliderWeights[i] * 100;
          return (
            <div key={c.id} className="space-y-2 border border-slate-100 rounded-lg p-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">
                  {c.code} - {c.name}
                </span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-sm">
                  {currentPercent.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                value={currentPercent}
                disabled={!isSimulationMode}
                onChange={(e) => handleSliderChange(i, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Original: {(c.weight * 100).toFixed(1)}%</span>
                <span>Tipo: {c.type === 'benefit' ? 'Beneficio (+)' : 'Costo (-)'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulation Action Buttons */}
      {isSimulationMode && (
        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={handleRestoreWeights}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Pesos FAHP</span>
          </button>
          <button
            onClick={handleRecalculate}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Recalcular TOPSIS</span>
          </button>
        </div>
      )}

      {/* Comparison Table */}
      <div>
        <h4 className="text-slate-800 font-semibold text-sm mb-3">
          Comparativa de Sensibilidad: Escenario Base vs. Escenario Simulado
        </h4>
        <div className="overflow-x-auto border border-slate-200/60 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-4">Mercado</th>
                <th className="py-2.5 px-4 text-center">Posición Base</th>
                <th className="py-2.5 px-4 text-center">Posición Nueva</th>
                <th className="py-2.5 px-4 text-center">CC Base</th>
                <th className="py-2.5 px-4 text-center">CC Nuevo</th>
                <th className="py-2.5 px-4 text-center w-28">Variación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {markets.map((m) => {
                const baseInfo = baseRanking.find((r) => r.marketId === m.id)!;
                const newInfo = simRanking.find((r) => r.marketId === m.id)!;
                const diff = getRankChange(m.id);

                return (
                  <tr key={m.id} className="hover:bg-slate-50/20">
                    <td className="py-2.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                      <span className="text-base">{m.flag}</span>
                      <span>{m.name}</span>
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono">{baseInfo.rank}</td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold bg-slate-50/40">
                      {newInfo.rank}
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono text-slate-500">
                      {baseInfo.cc.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-800">
                      {newInfo.cc.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {diff > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <ArrowUp className="w-3 h-3" />
                          <span>+{diff} pos</span>
                        </span>
                      ) : diff < 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-100">
                          <ArrowDown className="w-3 h-3" />
                          <span>{diff} pos</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          <Minus className="w-3 h-3" />
                          <span>Sin cambio</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default SensitivityAnalysis;
