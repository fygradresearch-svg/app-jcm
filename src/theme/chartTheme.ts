/** Publication-quality chart palette (Q1/Q2 scientific figure style) */
export const CHART_PALETTE = {
  navy: '#1a365d',
  slate: '#4a5568',
  steel: '#718096',
  silver: '#a0aec0',
  accent: '#2c7a7b',
  accentLight: '#e6fffa',
  highlight: '#285e61',
  muted: ['#2d3748', '#4a5568', '#718096', '#a0aec0', '#cbd5e0', '#e2e8f0'] as const,
  level: {
    alto: '#2c7a7b',
    medio: '#b7791f',
    bajo: '#9b2c2c',
  },
} as const;

export const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#1a202c',
  color: '#f7fafc',
  borderRadius: '4px',
  border: '1px solid #4a5568',
  fontSize: '11px',
  fontFamily: '"Source Sans 3", system-ui, sans-serif',
  padding: '8px 12px',
};

export const CHART_AXIS_TICK = {
  fill: '#4a5568',
  fontSize: 11,
  fontFamily: '"Source Sans 3", system-ui, sans-serif',
  fontWeight: 500,
};

export const PRODUCT = {
  name: 'Fresa congelada',
  nameEn: 'Frozen strawberry',
  hsCode: '081110',
  origin: 'Junín, Perú',
  fullLabel: 'Fresa congelada (HS 081110) — Junín, Perú',
} as const;
