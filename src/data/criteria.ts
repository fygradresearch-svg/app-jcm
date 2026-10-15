import { Criterion } from '../types';

export const criteriaList: Criterion[] = [
  {
    id: 'c1',
    code: 'C1',
    name: 'Seguridad alimentaria y cumplimiento normativo',
    indicator: 'Quality and Safety — GFSI 2022',
    unit: '0-100',
    type: 'benefit',
    weight: 0.30598,
    percentage: 30.6
  },
  {
    id: 'c2',
    code: 'C2',
    name: 'Potencial de mercado y estabilidad económica',
    indicator: 'Importaciones de fresa congelada (HS 081110)',
    unit: 't (toneladas)',
    type: 'benefit',
    weight: 0.32315,
    percentage: 32.32
  },
  {
    id: 'c3',
    code: 'C3',
    name: 'Desempeño logístico',
    indicator: 'Logistics Performance Index - LPI',
    unit: '1-5',
    type: 'benefit',
    weight: 0.21546,
    percentage: 21.55
  },
  {
    id: 'c4',
    code: 'C4',
    name: 'Acceso comercial',
    indicator: 'Arancel efectivo aplicado al Perú',
    unit: '%',
    type: 'cost',
    weight: 0.1554,
    percentage: 15.54
  }
];

export const FAHP_CR = 0.0059; // Consistent matrix indicator CR < 0.10
