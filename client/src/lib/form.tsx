import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "./api";
import { bandSummary } from "./bands";
import type { BandSummary, FormDefinition, Instrument } from "./types";

/** One answer: the chosen "current situation" and rating (either may still be missing). */
export interface Answer {
  situation?: string;
  rating?: number;
}

/** Everything the respondent has entered so far (kept in this browser until they submit). */
export interface Draft {
  name: string;
  position: string;
  /** Instrument numbers they chose to complete */
  selected: number[];
  /** Keyed by `${instrument}|${code}|${part}` */
  answers: Record<string, Answer>;
  comments: Record<number, string>;
}

const EMPTY: Draft = { name: "", position: "", selected: [], answers: {}, comments: {} };
const STORAGE_KEY = "sse-draft-v1";

/** Complete when rated N/A (0), or when both a situation and a rating are chosen. */
export const isAnswered = (a: Answer | undefined) => a?.rating === 0 || (!!a?.situation && a?.rating !== undefined);

export const answerKey =(instrument: number, code: string, part = "") => `${instrument}|${code}|${part}`;

function loadDraft(): Draft {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<Draft>) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

interface FormState {
  def: FormDefinition | null;
  error: string | null;
  draft: Draft;
  update(patch: Partial<Draft>): void;
  setAnswer(instrument: number, code: string, part: string, patch: Answer): void;
  /** Answered and total rows (an item with phases/terrain counts each sub-row) */
  progress(instrument: number): { answered: number; total: number };
  summary(instrument: number): BandSummary;
  instrument(number: number): Instrument | undefined;
  clear(): void;
}

const FormContext = createContext<FormState | null>(null);

export function FormProvider({ children }: { children: ReactNode }) {
  const [def, setDef] = useState<FormDefinition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(loadDraft);

  useEffect(() => {
    api.get<FormDefinition>("/form").then(setDef).catch((e) => setError(e.message));
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* storage unavailable – the form still works for this visit */
    }
  }, [draft]);

  const instrument = useCallback((n: number) => def?.instruments.find((i) => i.number === n), [def]);

  const value = useMemo<FormState>(() => {
    const rows = (inst: Instrument) => inst.items.flatMap((item) => (item.parts ?? [""]).map((part) => answerKey(inst.number, item.code, part)));
    return {
      def,
      error,
      // Every section is compulsory: always work through all instruments, in order.
      draft: def ? { ...draft, selected: def.instruments.map((i) => i.number) } : draft,
      instrument,
      update: (patch) => setDraft((d) => ({ ...d, ...patch })),
      setAnswer: (n, code, part, patch) =>
        setDraft((d) => {
          const key = answerKey(n, code, part);
          return { ...d, answers: { ...d.answers, [key]: { ...d.answers[key], ...patch } } };
        }),
      progress: (n) => {
        const inst = instrument(n);
        if (!inst) return { answered: 0, total: 0 };
        const keys = rows(inst);
        const answered = keys.filter((k) => isAnswered(draft.answers[k])).length;
        return { answered, total: keys.length };
      },
      summary: (n) => {
        const inst = instrument(n);
        const ratings = inst ? rows(inst).map((k) => draft.answers[k]?.rating).filter((r): r is number => r !== undefined) : [];
        return bandSummary(ratings);
      },
      clear: () => setDraft(EMPTY),
    };
  }, [def, error, draft, instrument]);

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useForm(): FormState {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useForm outside FormProvider");
  return ctx;
}
