import { IPCR, IPCRMajorFunction, RatingCalculation } from '../types';

/**
 * Calculate A4 (Average) from Q1, E2, T3
 * Must be implemented exactly as specified
 */
export function calculateA4(q1: number, e2: number, t3: number): number {
  return parseFloat(((q1 + e2 + t3) / 3).toFixed(2));
}

/**
 * Calculate average rating for a major function
 */
function calculateMajorFunctionAverage(mf: IPCRMajorFunction | undefined): number {
  if (!mf || mf.targets.length === 0) return 0;
  const sum = mf.targets.reduce((acc, t) => acc + (t.a4Rating || 0), 0);
  return sum / mf.targets.length;
}

/**
 * Calculate final rating and adjectival rating for an IPCR
 */
export function calculateFinalRating(ipcr: IPCR): RatingCalculation {
  const strategic = ipcr.majorFunctions.find(m => m.category === 'STRATEGIC');
  const core = ipcr.majorFunctions.find(m => m.category === 'CORE');
  const support = ipcr.majorFunctions.find(m => m.category === 'SUPPORT');

  const strategicAvg = calculateMajorFunctionAverage(strategic);
  const coreAvg = calculateMajorFunctionAverage(core);
  const supportAvg = calculateMajorFunctionAverage(support);

  const strategicWeighted = strategicAvg * 0.45;
  const coreWeighted = coreAvg * 0.45;
  const supportWeighted = supportAvg * 0.10;

  const final = parseFloat(
    (strategicWeighted + coreWeighted + supportWeighted).toFixed(2)
  );

  let adjectival = 'Poor';
  if (final >= 4.8) adjectival = 'Outstanding';
  else if (final >= 4.0) adjectival = 'Very Satisfactory';
  else if (final >= 3.0) adjectival = 'Satisfactory';
  else if (final >= 2.0) adjectival = 'Unsatisfactory';

  return {
    strategicAvg,
    coreAvg,
    supportAvg,
    strategicWeighted,
    coreWeighted,
    supportWeighted,
    final,
    adjectival,
  };
}

/**
 * Clamp rating value between 1.0 and 5.0
 */
export function clampRating(value: number): number {
  return Math.max(1.0, Math.min(5.0, value));
}

/**
 * Validate rating input
 */
export function isValidRating(value: string): boolean {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 1.0 && num <= 5.0;
}

/**
 * Count linked IPCRs for an OPCR success indicator
 */
export function countLinkedIPCRs(indicatorId: string, ipcrs: IPCR[]): number {
  let count = 0;
  ipcrs.forEach(ipcr => {
    ipcr.majorFunctions.forEach(mf => {
      mf.targets.forEach(target => {
        if (target.parentOpIndicatorId === indicatorId) {
          count++;
        }
      });
    });
  });
  return count;
}
