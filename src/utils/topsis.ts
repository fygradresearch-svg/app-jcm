import { Market, TopsisRow, TopsisStepDetails } from '../types';

/**
 * Runs the TOPSIS algorithm on a set of markets with custom criteria weights.
 * @param markets List of evaluated markets
 * @param weights Weights for C1, C2, C3, C4. Must sum to 1.
 * @param criteriaTypes 'benefit' or 'cost' for C1, C2, C3, C4
 */
export function runTopsis(
  markets: Market[],
  weights: number[], // [w1, w2, w3, w4]
  criteriaTypes: ('benefit' | 'cost')[] // [t1, t2, t3, t4]
): TopsisStepDetails {
  const n = criteriaTypes.length;
  const m = markets.length;

  // Step 1: Decision Matrix X
  // Rows: Markets, Columns: [C1, C2, C3, C4]
  const decisionMatrix = markets.map((market) => ({
    market: market.name,
    marketId: market.id,
    values: [market.gfsi, market.importations, market.lpi, market.arancel],
  }));

  // Step 2: Vector Normalization
  // r_ij = x_ij / sqrt(sum_k(x_kj^2))
  const normFactors = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sumSq = 0;
    for (let i = 0; i < m; i++) {
      sumSq += Math.pow(decisionMatrix[i].values[j], 2);
    }
    normFactors[j] = Math.sqrt(sumSq);
  }

  const normalizedMatrix = decisionMatrix.map((row) => ({
    market: row.market,
    marketId: row.marketId,
    values: row.values.map((val, j) => (normFactors[j] === 0 ? 0 : val / normFactors[j])),
  }));

  // Step 3: Weighted Normalization
  // v_ij = w_j * r_ij
  const weightedMatrix = normalizedMatrix.map((row) => ({
    market: row.market,
    marketId: row.marketId,
    values: row.values.map((val, j) => val * weights[j]),
  }));

  // Step 4: Ideal Positive (A+) and Negative (A-) Solutions
  const idealPositive = Array(n).fill(0);
  const idealNegative = Array(n).fill(0);

  for (let j = 0; j < n; j++) {
    const colValues = weightedMatrix.map((row) => row.values[j]);
    if (criteriaTypes[j] === 'benefit') {
      idealPositive[j] = Math.max(...colValues);
      idealNegative[j] = Math.min(...colValues);
    } else {
      // Cost criterion: A+ is min, A- is max
      idealPositive[j] = Math.min(...colValues);
      idealNegative[j] = Math.max(...colValues);
    }
  }

  // Step 5: Distances to Ideal Positive (D+) and Negative (D-) Solutions
  // D_i+ = sqrt(sum_j((v_ij - A_j+)^2))
  // D_i- = sqrt(sum_j((v_ij - A_j-)^2))
  const distancesPositive = weightedMatrix.map((row) => {
    let sumSq = 0;
    for (let j = 0; j < n; j++) {
      sumSq += Math.pow(row.values[j] - idealPositive[j], 2);
    }
    return { market: row.market, marketId: row.marketId, value: Math.sqrt(sumSq) };
  });

  const distancesNegative = weightedMatrix.map((row) => {
    let sumSq = 0;
    for (let j = 0; j < n; j++) {
      sumSq += Math.pow(row.values[j] - idealNegative[j], 2);
    }
    return { market: row.market, marketId: row.marketId, value: Math.sqrt(sumSq) };
  });

  // Step 6: Relative Closeness Coefficient (CC_i)
  // CC_i = D_i- / (D_i+ + D_i-)
  const coefficients = weightedMatrix.map((row, i) => {
    const dPlus = distancesPositive[i].value;
    const dMinus = distancesNegative[i].value;
    const cc = dPlus + dMinus === 0 ? 0 : dMinus / (dPlus + dMinus);
    return { market: row.market, marketId: row.marketId, value: cc };
  });

  // Sort and assign ranks
  const sortedCoefficients = [...coefficients].sort((a, b) => b.value - a.value);

  const ranking: TopsisRow[] = sortedCoefficients.map((item, index) => {
    const cc = item.value;
    // Determine level dynamically based on approved thresholds
    let level: 'Alto' | 'Medio' | 'Bajo' = 'Bajo';
    if (cc >= 0.60) {
      level = 'Alto';
    } else if (cc >= 0.40) {
      level = 'Medio';
    }

    return {
      marketId: item.marketId,
      marketName: item.market,
      cc: parseFloat(cc.toFixed(6)), // Maintain precision but avoid float issues
      rank: index + 1,
      level,
    };
  });

  // Return step details as well for the procedure view
  return {
    decisionMatrix: decisionMatrix.map(row => ({ market: row.market, values: row.values })),
    normalizedMatrix: normalizedMatrix.map(row => ({ market: row.market, values: row.values })),
    weightedMatrix: weightedMatrix.map(row => ({ market: row.market, values: row.values })),
    idealPositive,
    idealNegative,
    distancesPositive: distancesPositive.map(d => ({ market: d.market, value: d.value })),
    distancesNegative: distancesNegative.map(d => ({ market: d.market, value: d.value })),
    coefficients: coefficients.map(c => ({ market: c.market, value: c.value })),
    ranking,
  };
}
