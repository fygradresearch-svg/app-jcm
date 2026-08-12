export interface Market {
  id: string;
  name: string;
  code: string;
  gfsi: number;        // Safety (C1)
  importations: number; // Potential (C2)
  lpi: number;         // Logistics (C3)
  arancel: number;     // Tariff (C4)
  flag: string;        // Country flag (emoji or small URL)
}

export type CriterionType = 'benefit' | 'cost';

export interface Criterion {
  id: string;
  code: string;
  name: string;
  indicator: string;
  unit: string;
  type: CriterionType;
  weight: number;      // Original weight
  percentage: number;  // Original percentage (0-100)
}

export interface Source {
  indicator: string;
  sourceName: string;
  year: string;
  unit: string;
  nature: CriterionType;
  weight: number;
}

export interface TopsisRow {
  marketId: string;
  marketName: string;
  cc: number;
  rank: number;
  level: 'Alto' | 'Medio' | 'Bajo';
}

export interface TopsisStepDetails {
  decisionMatrix: { market: string; values: number[] }[];
  normalizedMatrix: { market: string; values: number[] }[];
  weightedMatrix: { market: string; values: number[] }[];
  idealPositive: number[];
  idealNegative: number[];
  distancesPositive: { market: string; value: number }[];
  distancesNegative: { market: string; value: number }[];
  coefficients: { market: string; value: number }[];
  ranking: TopsisRow[];
}
