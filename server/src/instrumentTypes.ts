/** One evaluation instrument (e.g. "Basic Functionality"), transcribed from the school self-evaluation templates. */
export interface Instrument {
  /** Instrument number as on the template, e.g. 1 */
  number: number;
  title: string;
  purpose: string;
  items: Item[];
}

/** One row of an instrument: answered with a "current situation" and a rating. */
export interface Item {
  /** e.g. "1.1.1.1" */
  code: string;
  /** DOCUMENT / CRITERIA column (may be "" when the template leaves it blank) */
  heading: string;
  /** CORE INDICATORS column (may be "" for document checklists) */
  indicator: string;
  /** CURRENT SITUATION choices, in order from best to worst ("PLEASE SELECT" is added by the app) */
  options: string[];
  /** Sub-rows answered separately, e.g. phases ["FP","IP","SP","FET"] or terrain ["Walls", ...] */
  parts?: string[];
  /** Column title for the sub-rows, e.g. "Phase" or "Terrain" */
  partsLabel?: string;
}
