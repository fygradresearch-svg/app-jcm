import { Source } from '../types';

export const sourcesList: Source[] = [
  {
    indicator: 'Quality and Safety — GFSI',
    sourceName: 'Economist Impact',
    year: '2022',
    unit: 'Índice (0 - 100)',
    nature: 'benefit',
    weight: 0.30598
  },
  {
    indicator: 'Importaciones de fresa congelada (HS 081110)',
    sourceName: 'UN Comtrade / WITS',
    year: '2023',
    unit: 'Toneladas (t)',
    nature: 'benefit',
    weight: 0.32315
  },
  {
    indicator: 'Logistics Performance Index - LPI',
    sourceName: 'Banco Mundial',
    year: '2023',
    unit: 'Índice (1 - 5)',
    nature: 'benefit',
    weight: 0.21546
  },
  {
    indicator: 'Arancel efectivo aplicado al Perú',
    sourceName: 'Matriz arancelaria del estudio',
    year: 'Octubre 2026',
    unit: 'Porcentaje (%)',
    nature: 'cost',
    weight: 0.1554
  }
];
