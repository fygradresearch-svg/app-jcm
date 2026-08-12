import React from 'react';
import { ArrowDown, HelpCircle, Layers, Award, Target, Map } from 'lucide-react';

export const Methodology: React.FC = () => {
  const steps = [
    {
      title: 'Delphi Fuzzy',
      subtitle: 'Validación de criterios',
      description: 'Consulta y consenso de expertos internacionales para filtrar y consolidar los criterios de decisión comercial más relevantes bajo un entorno lingüístico difuso.',
      icon: HelpCircle,
      color: 'bg-slate-100 border-slate-200 text-slate-800'
    },
    {
      title: 'FAHP (Fuzzy AHP)',
      subtitle: 'Ponderación de criterios',
      description: 'Cálculo de la importancia relativa de cada criterio mediante matrices de comparación pareada difusa. Permite capturar la subjetividad experta asegurando consistencia matemática (CR = 0.0386 < 0.10).',
      icon: Layers,
      color: 'bg-slate-900 border-slate-800 text-white shadow-sm'
    },
    {
      title: 'Pesos de Criterios',
      subtitle: 'Pesos relativos (W)',
      description: 'Vector final de ponderación: GFSI (51.7%), Importaciones (23.8%), LPI (16.8%) y Arancel (7.7%). Constituye la base paramétrica del modelo de recomendación.',
      icon: Award,
      color: 'bg-slate-100 border-slate-200 text-slate-800'
    },
    {
      title: 'Matriz de Mercados',
      subtitle: 'Datos empíricos',
      description: 'Estructuración de la matriz de decisión con datos empíricos de fuentes oficiales (BM, Economist, WITS) para los 6 mercados destino de fresa congelada evaluados.',
      icon: Target,
      color: 'bg-slate-100 border-slate-200 text-slate-800'
    },
    {
      title: 'Algoritmo TOPSIS',
      subtitle: 'Priorización matemática',
      description: 'Ejecución del algoritmo en el frontend: normalización vectorial, ponderación por pesos FAHP, cálculo de distancias euclidianas a los ideales positivo (A+) y negativo (A-), y determinación de coeficientes de cercanía.',
      icon: Target,
      color: 'bg-indigo-900 border-indigo-800 text-white shadow-sm'
    },
    {
      title: 'Geovisualización & Ranking',
      subtitle: 'Representación espacial y ordenamiento',
      description: 'Ordenamiento decreciente del coeficiente CC para establecer el ranking de recomendación y mapeo geoespacial interactivo del nivel de idoneidad (Alto / Medio / Bajo).',
      icon: Map,
      color: 'bg-slate-100 border-slate-200 text-slate-800'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div>
        <h3 className="text-slate-900 font-bold text-lg">Metodología Científica del Modelo</h3>
        <p className="text-slate-500 text-xs mt-0.5 font-medium">
          Arquitectura metodológica híbrida FAHP-TOPSIS para la selección inteligente de mercados internacionales.
        </p>
      </div>

      {/* Visual Flowchart */}
      <div className="flex flex-col items-center max-w-xl mx-auto space-y-3 py-4">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          return (
            <React.Fragment key={idx}>
              {/* Card */}
              <div className={`w-full border p-4 rounded-xl flex items-start gap-4 transition-all hover:scale-[1.01] ${step.color}`}>
                <div className="p-2 bg-white/10 rounded-lg shrink-0 flex items-center justify-center border border-white/10">
                  <StepIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-wide flex items-center gap-2">
                    <span>{step.title}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                      Paso {idx + 1}
                    </span>
                  </h4>
                  <p className="text-xs font-semibold uppercase opacity-85 mt-0.5 tracking-wider">{step.subtitle}</p>
                  <p className="text-[11px] leading-relaxed mt-2 opacity-80">{step.description}</p>
                </div>
              </div>
              {/* Arrow */}
              {idx < steps.length - 1 && (
                <div className="flex items-center justify-center p-1">
                  <ArrowDown className="w-5 h-5 text-slate-400 stroke-[1.5]" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
export default Methodology;
