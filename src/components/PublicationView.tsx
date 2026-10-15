import React, { useState } from 'react';
import { Market, Criterion, TopsisRow } from '../types';
import { exportElementToPng, triggerPrint } from '../utils/exportResults';
import { MarketMap } from './MarketMap';
import { MarketRanking } from './MarketRanking';
import { FahpWeights } from './FahpWeights';
import { ArrowLeft, Download, Printer, Shield, BarChart3, Truck, Percent } from 'lucide-react';
import { PRODUCT } from '../theme/chartTheme';

interface PublicationViewProps {
  markets: Market[];
  criteria: Criterion[];
  baseRanking: TopsisRow[];
  onExit: () => void;
}

export const PublicationView: React.FC<PublicationViewProps> = ({
  markets,
  criteria,
  baseRanking,
  onExit,
}) => {
  const [selectedFigure, setSelectedFigure] = useState<'fig1' | 'fig2'>('fig1');
  const [activeMarketId, setActiveMarketId] = useState<string>('us');

  const activeMarket = markets.find(m => m.id === activeMarketId) || markets[0];
  const activeTopsis = baseRanking.find(r => r.marketId === activeMarketId) || baseRanking[0];
  const topMarket = baseRanking[0];
  const topMarketObj = markets.find(m => m.id === topMarket?.marketId);

  const handleExportPNG = async () => {
    const elementId = selectedFigure === 'fig1' ? 'figure-1-container' : 'figure-2-container';
    const fileName = selectedFigure === 'fig1'
      ? 'Fig1_Dashboard_Fresa_Congelada_TOPSIS'
      : 'Fig2_Geovisualizacion_Fresa_Congelada';
    await exportElementToPng(elementId, fileName);
  };

  return (
    <div className="min-h-screen bg-[#edf2f7] p-6 flex flex-col space-y-6">
      <div className="academic-panel p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-1 text-xs font-medium px-3 py-2 border border-[var(--color-border)] rounded hover:bg-[#f7fafc] text-[var(--color-ink-muted)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
          <div className="h-6 w-px bg-[var(--color-border)]" />

        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-[#edf2f7] p-1 rounded flex text-xs font-medium border border-[var(--color-border)]">
            <button
              onClick={() => setSelectedFigure('fig1')}
              className={`px-3 py-1.5 rounded transition-all ${
                selectedFigure === 'fig1' ? 'bg-white text-[var(--color-navy)] shadow-sm' : 'text-[var(--color-ink-subtle)]'
              }`}
            >
             Dashboard
            </button>
            <button
              onClick={() => setSelectedFigure('fig2')}
              className={`px-3 py-1.5 rounded transition-all ${
                selectedFigure === 'fig2' ? 'bg-white text-[var(--color-navy)] shadow-sm' : 'text-[var(--color-ink-subtle)]'
              }`}
            >
             Mapa
            </button>
          </div>

          {/*<button*/}
          {/*  onClick={handleExportPNG}*/}
          {/*  className="inline-flex items-center gap-1.5 px-3 py-2 bg-[var(--color-navy)] hover:bg-[var(--color-navy-light)] text-white rounded text-xs font-medium"*/}
          {/*>*/}
          {/*  <Download className="w-3.5 h-3.5" />*/}
          {/*  <span>PNG</span>*/}
          {/*</button>*/}

          {/*<button*/}
          {/*  onClick={triggerPrint}*/}
          {/*  className="inline-flex items-center gap-1.5 px-3 py-2 border border-[var(--color-border)] text-[var(--color-ink-muted)] hover:bg-[#f7fafc] bg-white rounded text-xs font-medium"*/}
          {/*>*/}
          {/*  <Printer className="w-3.5 h-3.5" />*/}
          {/*  <span>PDF</span>*/}
          {/*</button>*/}
        </div>
      </div>

      {selectedFigure === 'fig1' && (
        <div
          id="figure-1-container"
          className="bg-white p-8 md:p-10 border border-[var(--color-border-strong)] max-w-[1440px] mx-auto w-full space-y-6 text-[var(--color-ink)]"
        >
          <div className="border-b border-[var(--color-border)] pb-4 text-center">

            <h2 className="text-lg font-semibold text-[var(--color-navy)] mt-1" style={{ fontFamily: 'var(--font-serif)' }}>
              Interfaz del sistema de recomendación y ranking de mercados
            </h2>
            <p className="figure-caption mt-2">
              Resultados de priorización para {PRODUCT.name} ({PRODUCT.origin}) mediante FAHP–TOPSIS
              con pesos del escenario base (HS {PRODUCT.hsCode}).
            </p>
          </div>

          <div className="bg-[#f7fafc] p-4 rounded border border-[var(--color-border)] flex justify-between items-center">
            <div>
              <h1 className="text-[var(--color-navy)] font-semibold text-base" style={{ fontFamily: 'var(--font-serif)' }}>
                Sistema de Recomendación de Mercados de Exportación
              </h1>
              <p className="text-[var(--color-ink-muted)] text-xs mt-0.5">
                {PRODUCT.fullLabel} · FAHP–TOPSIS
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="border border-[var(--color-border)] p-3 rounded text-center">
              <p className="section-eyebrow">Mercados</p>
              <p className="kpi-value text-xl mt-0.5">{markets.length}</p>
            </div>
            <div className="border border-[var(--color-border)] p-3 rounded text-center">
              <p className="section-eyebrow">Criterios</p>
              <p className="kpi-value text-xl mt-0.5">{criteria.length}</p>
            </div>
            <div className="border border-[#b2f5ea] p-3 rounded text-center bg-[var(--color-accent-muted)]">
              <p className="section-eyebrow text-[#234e52]">Recomendado</p>
              <p className="text-sm font-semibold text-[#234e52] mt-0.5">{topMarketObj?.name}</p>
            </div>
            <div className="border border-[var(--color-border)] p-3 rounded text-center bg-[#f7fafc]">
              <p className="section-eyebrow">CC máximo</p>
              <p className="kpi-value text-xl mt-0.5">{topMarket?.cc.toFixed(3)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 h-[420px]">
              <MarketMap
                ranking={baseRanking}
                selectedMarketId={activeMarketId}
                onSelectMarket={setActiveMarketId}
              />
            </div>
            <div>
              <FahpWeights criteria={criteria} />
            </div>
          </div>

          <MarketRanking
            ranking={baseRanking}
            markets={markets}
            selectedMarketId={activeMarketId}
            onSelectMarket={setActiveMarketId}
          />
        </div>
      )}

      {selectedFigure === 'fig2' && (
        <div
          id="figure-2-container"
          className="bg-white p-8 md:p-10 border border-[var(--color-border-strong)] max-w-[1440px] mx-auto w-full space-y-6"
        >
          <div className="border-b border-[var(--color-border)] pb-4 text-center">

            <h2 className="text-lg font-semibold text-[var(--color-navy)] mt-1" style={{ fontFamily: 'var(--font-serif)' }}>
              Geovisualización de mercados evaluados
            </h2>
            <p className="figure-caption mt-2">
              Clasificación espacial por nivel de idoneidad TOPSIS — {activeMarket.name} seleccionado.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 h-[480px]">
              <MarketMap
                ranking={baseRanking}
                selectedMarketId={activeMarketId}
                onSelectMarket={setActiveMarketId}
              />
            </div>

            <div className="bg-[#f7fafc] border border-[var(--color-border)] rounded p-5 flex flex-col">
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4 mb-4">
                <span className="text-3xl">{activeMarket.flag}</span>
                <div>
                  <h3 className="font-semibold text-[var(--color-navy)] text-lg" style={{ fontFamily: 'var(--font-serif)' }}>
                    {activeMarket.name}
                  </h3>
                  <p className="text-[var(--color-ink-subtle)] text-[11px] font-mono">ISO {activeMarket.code}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white p-3 rounded border border-[var(--color-border)] text-center">
                  <p className="section-eyebrow">Ranking</p>
                  <p className="kpi-value text-lg mt-0.5">#{activeTopsis.rank}</p>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--color-border)] text-center">
                  <p className="section-eyebrow">CC</p>
                  <p className="kpi-value text-lg mt-0.5">{activeTopsis.cc.toFixed(3)}</p>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--color-border)] text-center col-span-2">
                  <p className="section-eyebrow">Nivel</p>
                  <p className="text-sm font-semibold text-[var(--color-navy)] mt-1 uppercase">{activeTopsis.level}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="section-eyebrow">Datos de entrada</p>
                {[
                  { icon: Shield, label: 'Quality & Safety', value: activeMarket.gfsi.toFixed(1) },
                  { icon: BarChart3, label: 'Importación', value: `${activeMarket.importations.toLocaleString()} t` },
                  { icon: Truck, label: 'LPI', value: activeMarket.lpi.toFixed(2) },
                  { icon: Percent, label: 'Arancel', value: `${activeMarket.arancel}%` },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex justify-between items-center text-xs">
                      <span className="text-[var(--color-ink-muted)] flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-[var(--color-ink-subtle)]" />
                        {item.label}
                      </span>
                      <span className="kpi-value">{item.value}</span>
                    </div>
                  );
                })}
              </div>

              <p className="figure-caption mt-6 pt-4 border-t border-[var(--color-border)] text-[10px]">
                Indicadores empíricos indexados al escenario base del modelo FAHP-TOPSIS para {PRODUCT.name}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PublicationView;
