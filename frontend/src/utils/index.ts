export function convertTermIdToSeason(termId: number): string {
  const seasonId = termId % 100;

  if (seasonId === 10) {
    return "fall";
  }
  if (seasonId === 30) {
    return "spring";
  }
  if (seasonId === 40) {
    return "summer1";
  }
  return "summer2";
}

export function convertTermIdToYear(termId: number): number {
  return Math.trunc(termId / 100);
}
