import type { Band, BandSummary } from "./types";

/** Same bands as the server: green 4–5, amber 3, red 1–2, N/A 0. */
export function band(rating: number): Band {
  if (rating >= 4) return "green";
  if (rating === 3) return "amber";
  if (rating >= 1) return "red";
  return "na";
}

/** Whole-number percentages that always add up to 100 (same as the server). */
function wholePercents(counts: Record<Band, number>, total: number): Record<Band, number> {
  const bands: Band[] = ["green", "amber", "red", "na"];
  const percent: Record<Band, number> = { green: 0, amber: 0, red: 0, na: 0 };
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

export function bandSummary(ratings: number[]): BandSummary {
  const counts: Record<Band, number> = { green: 0, amber: 0, red: 0, na: 0 };
  for (const r of ratings) counts[band(r)]++;
  const total = ratings.length;
  const rated = ratings.filter((r) => r > 0);
  return {
    total,
    counts,
    percent: wholePercents(counts, total),
    average: rated.length ? Math.round((rated.reduce((a, b) => a + b, 0) / rated.length) * 10) / 10 : null,
  };
}

export const BAND_LABEL: Record<Band, string> = { green: "Green", amber: "Amber", red: "Red", na: "N/A" };
