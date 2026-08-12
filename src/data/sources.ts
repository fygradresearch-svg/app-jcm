import { Source } from '../types';

export const sourcesList: Source[] = [
  {
    indicator: 'Global Food Security Index - GFSI',
    sourceName: 'Economist Impact',
    year: '2022',
    unit: 'Índice (0 - 100)',
    nature: 'benefit',
    weight: 0.517
  },
  {
    indicator: 'Importaciones de fresa congelada (HS 081110)',
    sourceName: 'UN Comtrade / WITS',
    year: '2022',
    unit: 'Toneladas (t)',
    nature: 'benefit',
    weight: 0.238
  },
  {
    indicator: 'Logistics Performance Index - LPI',
    sourceName: 'Banco Mundial',
    year: '2023',
    unit: 'Índice (1 - 5)',
    nature: 'benefit',
    weight: 0.168
  },
  {
    indicator: 'Arancel efectivo aplicado al Perú',
    sourceName: 'MINCETUR / PROMPERÚ',
    year: '2025-2026',
    unit: 'Porcentaje (%)',
    nature: 'cost',
    weight: 0.077
  }
];
