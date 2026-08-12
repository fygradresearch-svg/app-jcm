import React from 'react';
import { Source } from '../types';
import { sourcesList } from '../data/sources';
import { Table, Database, ExternalLink, Calendar, HelpCircle } from 'lucide-react';

interface SourcesTableProps {
  sources: Source[];
}

export const SourcesTable: React.FC<SourcesTableProps> = ({ sources }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div>
        <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
          <Database className="w-5 h-5 text-slate-500" />
          Fuentes de Información y Trazabilidad de Datos
        </h3>
        <p className="text-slate-500 text-xs mt-0.5">
          Ficha técnica detallada que describe el origen de los indicadores utilizados en este estudio.
        </p>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4">Indicador</th>
              <th className="py-3 px-4">Fuente / Institución</th>
              <th className="py-3 px-4 text-center">Año de Publicación</th>
              <th className="py-3 px-4">Unidad de Medida</th>
              <th className="py-3 px-4 text-center">Naturaleza en TOPSIS</th>
              <th className="py-3 px-4 text-right">Peso FAHP Base</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {sources.map((s, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-4 font-semibold text-slate-800">
                  {s.indicator}
                </td>
                <td className="py-4 px-4 font-medium text-slate-600">
                  {s.sourceName}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {s.year}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {s.unit}
                </td>
                <td className="py-4 px-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      s.nature === 'benefit'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}
                  >
                    {s.nature === 'benefit' ? 'Beneficio (+)' : 'Costo (-)'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">
                  {s.weight.toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Methodological details */}
      <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-lg text-xs space-y-3">
        <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          Anotaciones Metodológicas de los Indicadores
        </h4>
        <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-relaxed">
          <li>
            <strong>GFSI (Global Food Security Index):</strong> Publicado por Economist Impact, evalúa la asequibilidad, disponibilidad, calidad e inocuidad de los alimentos, así como la sostenibilidad y adaptación de recursos en 113 países.
          </li>
          <li>
            <strong>Importaciones de fresa congelada (HS 081110):</strong> Volumen anual importado por cada país destino en el año comercial 2022, obtenido de UN Comtrade y procesado mediante WITS (World Integrated Trade Solution). El código arancelario HS 081110 corresponde a fresas sin cocer o cocidas al vapor o en agua hirviendo, congeladas.
          </li>
          <li>
            <strong>LPI (Logistics Performance Index):</strong> Índice multidimensional del Banco Mundial que mide la eficiencia de las aduanas, la calidad de la infraestructura de transporte y la facilidad de organizar embarques internacionales competitivos.
          </li>
          <li>
            <strong>Arancel efectivo aplicado:</strong> Tasas arancelarias preferenciales o ad valorem aplicadas de forma directa a las importaciones peruanas bajo los Acuerdos Comerciales vigentes entre el Perú y cada mercado de destino para el periodo fiscal 2025-2026.
          </li>
        </ul>
      </div>
    </div>
  );
};
export default SourcesTable;
