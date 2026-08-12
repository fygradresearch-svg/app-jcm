import React, { useState, useEffect } from 'react';
import { marketsList } from './data/markets';
import { criteriaList } from './data/criteria';
import { sourcesList } from './data/sources';
import { runTopsis } from './utils/topsis';
import { exportRankingToCsv, exportRankingToXlsx } from './utils/exportResults';

// Components
import { Dashboard } from './components/Dashboard';
import { MarketMap } from './components/MarketMap';
import { MarketRanking } from './components/MarketRanking';
import { MarketDetail } from './components/MarketDetail';
import { FahpWeights } from './components/FahpWeights';
import { SensitivityAnalysis } from './components/SensitivityAnalysis';
import { TopsisProcess } from './components/TopsisProcess';
import { SourcesTable } from './components/SourcesTable';
import { PublicationView } from './components/PublicationView';
import { Methodology } from './components/Methodology';
import { ResultsArticle } from './components/ResultsArticle';

// Icons
import {
  LayoutDashboard,
  TrendingUp,
  Map as MapIcon,
  Globe,
  FileText,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation Menu state
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  
  // Selected Market state (for details card)
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>('us');
  
  // Simulation vs Article mode state
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  const [isPublicationView, setIsPublicationView] = useState<boolean>(false);

  // Mobile navigation drawer toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Weights state: either base FAHP weights or simulated weights
  const [weights, setWeights] = useState<number[]>(criteriaList.map(c => c.weight));

  // Calculated TOPSIS result
  const criteriaTypes = criteriaList.map(c => c.type);
  const topsisDetails = runTopsis(marketsList, weights, criteriaTypes);
  const currentRanking = topsisDetails.ranking;

  // BASE ranking (calculated once on start)
  const baseTopsis = runTopsis(marketsList, criteriaList.map(c => c.weight), criteriaTypes);
  const baseRanking = baseTopsis.ranking;

  // Validation Status state
  const [validationReport, setValidationReport] = useState<{
    isValid: boolean;
    message: string;
    details: any[];
  } | null>(null);

  // Run automatic verification on app start
  useEffect(() => {
    // Expected order and values
    const expected = [
      { id: 'us', cc: 0.680 },
      { id: 'de', cc: 0.522 },
      { id: 'ca', cc: 0.472 },
      { id: 'fr', cc: 0.367 },
      { id: 'uk', cc: 0.352 },
      { id: 'nl', cc: 0.321 }
    ];

    const results = baseRanking;
    let isValid = true;
    const details = [];

    for (let i = 0; i < expected.length; i++) {
      const exp = expected[i];
      const match = results.find(r => r.marketId === exp.id);
      
      if (!match) {
        isValid = false;
        details.push(`Mercado '${exp.id}' faltante en resultados.`);
        continue;
      }

      if (match.rank !== i + 1) {
        isValid = false;
        details.push(`Orden erróneo para ${match.marketName}: esperado #${i + 1}, obtenido #${match.rank}`);
      }

      // Check approximate CC values
      const diff = Math.abs(match.cc - exp.cc);
      if (diff > 0.005) {
        isValid = false;
        details.push(`CC desviado para ${match.marketName}: esperado ~${exp.cc}, obtenido ${match.cc.toFixed(3)}`);
      } else {
        details.push(`${match.marketName}: OK (CC: ${match.cc.toFixed(3)})`);
      }
    }

    setValidationReport({
      isValid,
      message: isValid 
        ? 'Validación Matemática Exitosa: El algoritmo TOPSIS reprodujo con precisión de 3 decimales los resultados del artículo.'
        : 'Discrepancia detectada en la reproducción de resultados base.',
      details
    });

    // Console logging
    console.log('=== VALIDACIÓN DE TOPSIS FRONTEND ===');
    console.log(isValid ? '✓ ÉXITO: Los resultados coinciden con el modelo' : '✗ DISCREPANCIA DETECTADA');
    results.forEach(r => {
      console.log(`${r.rank}. ${r.marketName} (CC: ${r.cc.toFixed(4)}) - Nivel: ${r.level}`);
    });
    console.log('======================================');
  }, []);

  // Update weights when switching back to article mode
  useEffect(() => {
    if (!isSimulationMode) {
      setWeights(criteriaList.map(c => c.weight));
    }
  }, [isSimulationMode]);

  // Export handlers
  const handleExportCsv = () => {
    exportRankingToCsv(currentRanking, marketsList);
  };

  const handleExportXlsx = () => {
    exportRankingToXlsx(currentRanking, marketsList, criteriaList);
  };

  // Switch to simulation if user changes weights in Sensitivity screen
  const handleSetWeightsInSimulation = (newWeights: number[]) => {
    setWeights(newWeights);
    if (!isSimulationMode) {
      setIsSimulationMode(true);
    }
  };

  // Nav items configuration
  const navItems = [
    { id: 'dashboard', label: 'Panel principal', icon: LayoutDashboard },
    { id: 'ranking', label: 'Ranking', icon: TrendingUp },
    { id: 'map', label: 'Geovisualización', icon: MapIcon },
    { id: 'markets', label: 'Fichas de mercado', icon: Globe },
    { id: 'results', label: 'Resultados', icon: FileText },
  ];

  // Render active content screen
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <Dashboard
            markets={marketsList}
            criteria={criteriaList}
            ranking={currentRanking}
            selectedMarketId={selectedMarketId}
            onSelectMarket={setSelectedMarketId}
          />
        );
      case 'ranking':
        return (
          <div className="max-w-4xl mx-auto">
            <MarketRanking
              ranking={currentRanking}
              markets={marketsList}
              selectedMarketId={selectedMarketId}
              onSelectMarket={setSelectedMarketId}
            />
          </div>
        );
      case 'map':
        return (
          <div className="space-y-6">
            <div className="h-[550px]">
              <MarketMap
                ranking={currentRanking}
                selectedMarketId={selectedMarketId}
                onSelectMarket={setSelectedMarketId}
              />
            </div>
            {selectedMarketId && (
              <div className="max-w-4xl mx-auto">
                <MarketDetail
                  market={marketsList.find(m => m.id === selectedMarketId) || null}
                  topsisInfo={currentRanking.find(r => r.marketId === selectedMarketId) || null}
                  allMarkets={marketsList}
                  onClose={() => setSelectedMarketId(null)}
                />
              </div>
            )}
          </div>
        );
      case 'markets':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 academic-panel p-4 space-y-1 h-fit">
              <h3 className="section-eyebrow border-b border-[var(--color-border)] pb-2 mb-3">
                Seleccionar mercado
              </h3>
              {marketsList.map((m) => {
                const isSelected = selectedMarketId === m.id;
                const tops = currentRanking.find((r) => r.marketId === m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMarketId(m.id)}
                    className={`w-full flex items-center justify-between p-3 rounded text-xs font-medium transition-all border ${
                      isSelected
                        ? 'bg-[var(--color-navy)] border-[var(--color-navy)] text-white'
                        : 'bg-white border-[var(--color-border)] text-[var(--color-ink-muted)] hover:bg-[#f7fafc]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base leading-none">{m.flag}</span>
                      <span>{m.name}</span>
                    </span>
                    {tops && (
                      <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] ${
                        isSelected ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        Pos #{tops.rank}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="lg:col-span-2">
              <MarketDetail
                market={marketsList.find(m => m.id === selectedMarketId) || null}
                topsisInfo={currentRanking.find(r => r.marketId === selectedMarketId) || null}
                allMarkets={marketsList}
                onClose={() => setSelectedMarketId(null)}
              />
            </div>
          </div>
        );
      case 'methodology':
        return <Methodology />;
      case 'sensitivity':
        return (
          <SensitivityAnalysis
            markets={marketsList}
            criteria={criteriaList}
            baseRanking={baseRanking}
            isSimulationMode={isSimulationMode}
            onSetSimulationMode={setIsSimulationMode}
          />
        );
      case 'topsis':
        return <TopsisProcess topsisDetails={topsisDetails} criteria={criteriaList} />;
      case 'sources':
        return <SourcesTable sources={sourcesList} />;
      case 'results':
        return <ResultsArticle ranking={currentRanking} markets={marketsList} />;
      default:
        return <div>Pantalla no encontrada.</div>;
    }
  };

  // If Publication view is active, hijack layout
  if (isPublicationView) {
    return (
      <PublicationView
        markets={marketsList}
        criteria={criteriaList}
        baseRanking={baseRanking}
        onExit={() => setIsPublicationView(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-[1000] px-4 md:px-8 py-3 flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] p-1 rounded-md"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[var(--color-navy)] text-white flex items-center justify-center text-[10px] font-bold tracking-tight shrink-0">
                FC
              </div>
              <div>
                <span className="font-semibold text-[var(--color-navy)] text-sm block leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                  Recomendación de Mercados — Fresa Congelada
                </span>
                <span className="text-[10px] text-[var(--color-ink-subtle)] hidden sm:block">
                  FAHP-TOPSIS · Junín, Perú · HS 081110
                </span>
              </div>
            </div>
          </div>
        </div>

        {validationReport && validationReport.isValid && (
          <div
            title={validationReport.message}
            className="hidden md:flex items-center gap-1.5 bg-[var(--color-accent-muted)] text-[#234e52] text-[11px] px-3 py-1 rounded border border-[#b2f5ea] font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Validación TOPSIS reproducida</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase font-semibold tracking-wide px-2 py-0.5 rounded border hidden sm:inline-block ${
            isSimulationMode
              ? 'bg-[#fffbeb] text-[#744210] border-[#fbd38d]'
              : 'bg-[var(--color-accent-muted)] text-[#234e52] border-[#b2f5ea]'
          }`}>
            {isSimulationMode ? 'Simulación' : 'Escenario base'}
          </span>

          <button
            onClick={() => setIsPublicationView(true)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 border border-[var(--color-border)] bg-white hover:bg-[#f7fafc] text-[var(--color-ink-muted)] rounded transition-all"
            title="Vista limpia para figuras de artículo científico"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vista publicación</span>
          </button>

          <div className="flex bg-[#edf2f7] p-0.5 rounded border border-[var(--color-border)]">
            <button
              onClick={handleExportCsv}
              className="p-1.5 text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] rounded hover:bg-white transition-all"
              title="Exportar a CSV"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleExportXlsx}
              className="p-1.5 text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] rounded hover:bg-white transition-all"
              title="Exportar a Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-grow flex">
        {/* Desktop Sidebar Navigation */}
        <aside className="w-60 bg-white border-r border-[var(--color-border)] shrink-0 hidden lg:flex flex-col py-6 no-print">
          <nav className="space-y-0.5 px-3 flex-grow">
            <p className="section-eyebrow px-3 mb-3">Navegación</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[var(--color-navy)] text-white'
                      : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[#f7fafc]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white/90' : 'text-[var(--color-ink-subtle)]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="px-5 pt-4 mt-4 border-t border-[var(--color-border)] text-[10px] text-[var(--color-ink-subtle)] leading-relaxed">
            <p className="font-semibold text-[var(--color-ink-muted)]">Fresa congelada · Junín</p>
            <p className="mt-0.5">HS 081110 · v1.0</p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-[var(--color-navy)]/30 backdrop-blur-xs z-[2000] lg:hidden no-print">
            <div className="w-60 bg-white h-full flex flex-col py-6 border-r border-[var(--color-border)] animate-slide-in relative">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="px-5 mb-6">
                <p className="section-eyebrow">Fresa congelada</p>
                <span className="font-semibold text-[var(--color-navy)] text-sm" style={{ fontFamily: 'var(--font-serif)' }}>
                  FAHP-TOPSIS
                </span>
              </div>
              <nav className="space-y-0.5 px-3 flex-grow">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveMenu(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[var(--color-navy)] text-white'
                          : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[#f7fafc]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white/90' : 'text-[var(--color-ink-subtle)]'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-grow p-4 md:p-8 max-w-[1440px] mx-auto w-full">
          {/* Validation Report Banner - show if discrepancies arise */}
          {validationReport && !validationReport.isValid && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs space-y-1 mb-6">
              <p className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Error de Validación Matemática</span>
              </p>
              <p className="text-red-700">
                El algoritmo TOPSIS calculado en el frontend difiere de los resultados originales. Reporte de diferencias:
              </p>
              <ul className="list-disc pl-5 mt-1.5 space-y-0.5 text-red-600">
                {validationReport.details.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            </div>
          )}

          {renderContent()}
        </main>
      </div>
    </div>
  );
};
export default App;
