import { Criterion } from '../types';

export const criteriaList: Criterion[] = [
  {
    id: 'c1',
    code: 'C1',
    name: 'Seguridad alimentaria y cumplimiento normativo',
    indicator: 'Global Food Security Index - GFSI',
    unit: '0-100',
    type: 'benefit',
    weight: 0.517,
    percentage: 51.7
  },
  {
    id: 'c2',
    code: 'C2',
    name: 'Potencial de mercado y estabilidad económica',
    indicator: 'Importaciones de fresa congelada (HS 081110)',
    unit: 't (toneladas)',
    type: 'benefit',
    weight: 0.238,
    percentage: 23.8
  },
  {
    id: 'c3',
    code: 'C3',
    name: 'Desempeño logístico',
    indicator: 'Logistics Performance Index - LPI',
    unit: '1-5',
    type: 'benefit',
    weight: 0.168,
    percentage: 16.8
  },
  {
    id: 'c4',
    code: 'C4',
    name: 'Acceso comercial',
    indicator: 'Arancel efectivo aplicado al Perú',
    unit: '%',
    type: 'cost',
    weight: 0.077,
    percentage: 7.7
  }
];

export const FAHP_CR = 0.0386; // Consistent matrix indicator CR < 0.10
