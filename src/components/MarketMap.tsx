import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { TopsisRow } from '../types';
import { CHART_PALETTE } from '../theme/chartTheme';

interface MarketMapProps {
  ranking: TopsisRow[];
  selectedMarketId: string | null;
  onSelectMarket: (id: string) => void;
}

const countryCentroids: Record<string, { lat: number; lng: number }> = {
  us: { lat: 38.0902, lng: -95.7129 },
  de: { lat: 51.1657, lng: 10.4515 },
  ca: { lat: 56.1304, lng: -106.3468 },
  uk: { lat: 54.3781, lng: -3.4360 },
  fr: { lat: 46.2276, lng: 2.2137 },
  nl: { lat: 52.1326, lng: 5.2913 },
};

export const MarketMap: React.FC<MarketMapProps> = ({
  ranking,
  selectedMarketId,
  onSelectMarket,
}) => {
  const mapCenter: [number, number] = [48, -40];
  const defaultZoom = 2;

  const getColor = (level: string) => {
    switch (level) {
      case 'Alto':
        return CHART_PALETTE.level.alto;
      case 'Medio':
        return CHART_PALETTE.level.medio;
      case 'Bajo':
      default:
        return CHART_PALETTE.level.bajo;
    }
  };

  return (
    <div className="academic-panel overflow-hidden h-full flex flex-col relative min-h-[400px]">
      <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[#fafafa]">
        <p className="section-eyebrow">Mapa de idoneidad</p>
        <h3 className="text-sm font-semibold text-[var(--color-ink)]" style={{ fontFamily: 'var(--font-serif)' }}>
          Distribución geográfica de mercados evaluados
        </h3>
      </div>

      <div className="absolute bottom-4 left-4 z-[999] bg-white/95 backdrop-blur-sm p-3 rounded border border-[var(--color-border)] text-[11px] space-y-1.5 no-print shadow-sm">
        <p className="font-semibold text-[var(--color-ink)] mb-1">Clasificación TOPSIS</p>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: CHART_PALETTE.level.alto }} />
          <span className="text-[var(--color-ink-muted)]">Alto (CC ≥ 0,60)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: CHART_PALETTE.level.medio }} />
          <span className="text-[var(--color-ink-muted)]">Medio (0,40 ≤ CC &lt; 0,60)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: CHART_PALETTE.level.bajo }} />
          <span className="text-[var(--color-ink-muted)]">Bajo (CC &lt; 0,40)</span>
        </div>
      </div>

      <div className="flex-grow w-full relative z-[1]">
        <MapContainer
          center={mapCenter}
          zoom={defaultZoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', minHeight: '360px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {ranking.map((row) => {
            const centroid = countryCentroids[row.marketId];
            if (!centroid) return null;

            const isSelected = selectedMarketId === row.marketId;
            const color = getColor(row.level);

            return (
              <CircleMarker
                key={row.marketId}
                center={[centroid.lat, centroid.lng]}
                radius={isSelected ? 16 : 11}
                fillColor={color}
                color={isSelected ? CHART_PALETTE.navy : '#ffffff'}
                weight={isSelected ? 2.5 : 1.5}
                fillOpacity={0.85}
                eventHandlers={{
                  click: () => onSelectMarket(row.marketId),
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  <div className="p-1 text-xs space-y-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                    <p className="font-semibold text-[var(--color-ink)] border-b border-[var(--color-border)] pb-1 mb-1">
                      {row.marketName}
                    </p>
                    <p className="text-[var(--color-ink-muted)]">
                      Posición: <span className="font-semibold kpi-value">#{row.rank}</span>
                    </p>
                    <p className="text-[var(--color-ink-muted)]">
                      CC: <span className="font-semibold kpi-value">{row.cc.toFixed(3)}</span>
                    </p>
                    <p className="text-[var(--color-ink-muted)] flex items-center gap-1.5">
                      Nivel:
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {row.level}
                      </span>
                    </p>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
export default MarketMap;
