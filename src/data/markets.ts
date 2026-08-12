import { Market } from '../types';

export const marketsList: Market[] = [
  {
    id: 'us',
    name: 'Estados Unidos',
    code: 'USA',
    gfsi: 78.0,
    importations: 256033,
    lpi: 3.80,
    arancel: 10,
    flag: '🇺🇸'
  },
  {
    id: 'de',
    name: 'Alemania',
    code: 'DEU',
    gfsi: 77.0,
    importations: 127734,
    lpi: 4.10,
    arancel: 0,
    flag: '🇩🇪'
  },
  {
    id: 'ca',
    name: 'Canadá',
    code: 'CAN',
    gfsi: 79.1,
    importations: 110892,
    lpi: 4.00,
    arancel: 0,
    flag: '🇨🇦'
  },
  {
    id: 'uk',
    name: 'Reino Unido',
    code: 'GBR',
    gfsi: 78.8,
    importations: 58857,
    lpi: 3.70,
    arancel: 0,
    flag: '🇬🇧'
  },
  {
    id: 'fr',
    name: 'Francia',
    code: 'FRA',
    gfsi: 80.2,
    importations: 66424,
    lpi: 4.00,
    arancel: 0,
    flag: '🇫🇷'
  },
  {
    id: 'nl',
    name: 'Países Bajos',
    code: 'NLD',
    gfsi: 80.1,
    importations: 33686,
    lpi: 4.10,
    arancel: 0,
    flag: '🇳🇱'
  }
];
