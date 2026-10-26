/** Rating scale used on every instrument (as on the templates). */
export const RATINGS = [
  { value: 5, label: "5= OUTSTANDING" },
  { value: 4, label: "4= GOOD" },
  { value: 3, label: "3= ACCEPTABLE" },
  { value: 2, label: "2= NEEDS IMPROVEMENT" },
  { value: 1, label: "1= WEAK" },
  { value: 0, label: "0= NOT APPLICABLE (N/A)" },
] as const;

export type Band = "green" | "amber" | "red" | "na";

/** Colour band used in the summaries: green 4–5, amber 3, red 1–2, N/A 0 (matches the templates' totals). */
export function band(rating: number): Band {
  if (rating >= 4) return "green";
  if (rating === 3) return "amber";
  if (rating >= 1) return "red";
  return "na";
}

/** Whole-number percentages that always add up to 100 (largest remainder gets the leftover points). */
function wholePercents(counts: Record<Band, number>, total: number): Record<Band, number> {
  const bands: Band[] = ["green", "amber", "red", "na"];
  const percent = { green: 0, amber: 0, red: 0, na: 0 };
  if (!total) return percent;
  const exact = bands.map((b) => ({ b, value: (counts[b] / total) * 100 }));
  for (const e of exact) percent[e.b] = Math.floor(e.value);
  let left = 100 - bands.reduce((sum, b) => sum + percent[b], 0);
  for (const e of [...exact].sort((x, y) => (y.value % 1) - (x.value % 1))) {
    if (left-- <= 0) break;
    percent[e.b]++;
  }
  return percent;
}

/** Percentages of green/amber/red/N/A among the given ratings. */
export function bandSummary(ratings: number[]) {
  const counts = { green: 0, amber: 0, red: 0, na: 0 };
  for (const r of ratings) counts[band(r)]++;
  const total = ratings.length;
  const rated = ratings.filter((r) => r > 0);
  return {
    total,
    counts,
    percent: wholePercents(counts, total),
    /** Average of the 1–5 ratings (N/A excluded) */
    average: rated.length ? Math.round((rated.reduce((a, b) => a + b, 0) / rated.length) * 10) / 10 : null,
  };
}
