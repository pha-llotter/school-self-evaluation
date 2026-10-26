import { getSetting, setSetting } from "./db.js";

export interface SchoolInfo {
  schoolName: string;
  emis: string;
  district: string;
  circuit: string;
  /** Evaluation year shown on the forms, e.g. "2027" */
  year: string;
}

const DEFAULTS: SchoolInfo = {
  schoolName: "Protea Heights Academy",
  emis: "0100000355",
  district: "Metro East",
  circuit: "2",
  year: "2027",
};

export function getSchool(): SchoolInfo {
  const stored = getSetting("school");
  return { ...DEFAULTS, ...(stored ? (JSON.parse(stored) as Partial<SchoolInfo>) : {}) };
}

export function saveSchool(info: SchoolInfo) {
  setSetting("school", JSON.stringify(info));
}
