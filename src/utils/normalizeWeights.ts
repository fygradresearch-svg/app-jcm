/**
 * Adjusts the weights proportionally when one of them is modified.
 * The sum of all weights will remain exactly 1.0 (or 100% when scaled).
 * 
 * @param changedIndex The index of the weight that was modified (0 to 3)
 * @param newValue The new value for the modified weight (between 0 and 1)
 * @param currentWeights The current weights list
 */
export function adjustWeightsProportionally(
  changedIndex: number,
  newValue: number,
  currentWeights: number[]
): number[] {
  const n = currentWeights.length;
  const updatedWeights = [...currentWeights];
  
  // Set the new value for the changed index, clamping to [0, 1]
  const targetVal = Math.max(0, Math.min(1, newValue));
  updatedWeights[changedIndex] = targetVal;
  
  // If there's only one weight, it must be 1.0
  if (n <= 1) {
    return [1.0];
  }

  // Calculate the sum of the other weights
  let sumOthers = 0;
  for (let i = 0; i < n; i++) {
    if (i !== changedIndex) {
      sumOthers += currentWeights[i];
    }
  }

  const remaining = 1.0 - targetVal;

  if (sumOthers > 0) {
    // Distribute the remaining weight proportionally
    for (let i = 0; i < n; i++) {
      if (i !== changedIndex) {
        updatedWeights[i] = (currentWeights[i] / sumOthers) * remaining;
      }
    }
  } else {
    // If sum of others was 0, distribute the remaining weight equally
    const equalShare = remaining / (n - 1);
    for (let i = 0; i < n; i++) {
      if (i !== changedIndex) {
        updatedWeights[i] = equalShare;
      }
    }
  }

  // Double check and fix any floating point precision errors to ensure sum is exactly 1.0
  let totalSum = updatedWeights.reduce((a, b) => a + b, 0);
  if (Math.abs(totalSum - 1.0) > 1e-9) {
    // Find the largest weight index that is not the changedIndex, and adjust it by the difference
    let adjustIndex = (changedIndex + 1) % n;
    let maxVal = -1;
    for (let i = 0; i < n; i++) {
      if (i !== changedIndex && updatedWeights[i] > maxVal) {
        maxVal = updatedWeights[i];
        adjustIndex = i;
      }
    }
    updatedWeights[adjustIndex] += (1.0 - totalSum);
  }

  return updatedWeights;
}
export function formatWeightPercent(val: number): string {
  return (val * 100).toFixed(1) + '%';
}
export function percentToWeight(percent: number): number {
  return percent / 100;
}
