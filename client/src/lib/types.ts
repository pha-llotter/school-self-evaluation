export interface Item {
  code: string;
  heading: string;
  indicator: string;
  options: string[];
  parts?: string[];
  partsLabel?: string;
}

export interface Instrument {
  number: number;
  title: string;
  purpose: string;
  items: Item[];
}

export interface School {
  schoolName: string;
  emis: string;
  district: string;
  circuit: string;
  year: string;
}

export interface Rating {
  value: number;
  label: string;
}

export interface FormDefinition {
  school: School;
  ratings: Rating[];
  instruments: Instrument[];
}

export type Band = "green" | "amber" | "red" | "na";

export interface BandSummary {
  total: number;
  counts: Record<Band, number>;
  percent: Record<Band, number>;
  average: number | null;
}
