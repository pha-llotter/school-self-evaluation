import type { BandSummary, Item, School } from "../../lib/types";

export interface SummaryResponse {
  school: School;
  responses: number;
  overall: BandSummary;
  instruments: ({ number: number; title: string; items: number; respondents: number } & BandSummary)[];
}

export interface InstrumentDetail {
  instrument: { number: number; title: string; purpose: string };
  respondents: number;
  summary: BandSummary;
  items: (Item & {
    rows: ({ part: string; ratingCounts: number[]; situations: { situation: string; count: number }[] } & BandSummary)[];
  })[];
  comments: { name: string; position: string; created_at: string; comment: string }[];
}

export interface ResponseListItem {
  id: string;
  name: string;
  position: string;
  created_at: string;
  overall: BandSummary;
  instruments: ({ number: number } & BandSummary)[];
}

export interface ResponseDetailData {
  response: { id: string; name: string; position: string; created_at: string };
  summary: BandSummary;
  instruments: {
    number: number;
    title: string;
    purpose: string;
    comment: string;
    summary: BandSummary;
    items: (Item & { answers: { part: string; situation: string; rating: number | null }[] })[];
  }[];
}
