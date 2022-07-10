import { HRow, HRowType } from "./types";
import { StatsLogger as StatsLoggerType } from "../runtime/logger";
import { ensureLength } from "../utils";

type TextRowTypes = HRow & {
  type: HRowType.COMMENT | HRowType.HEADER | HRowType.SUBHEADER;
};
export const categorizeTextRow = (
  row: TextRowTypes,
  stats: StatsLoggerType
) => {
  if (row.type === HRowType.HEADER || row.type === HRowType.SUBHEADER) {
    if (includesChoiceKeyword(row.description)) {
      return parseCommentRow(row, stats);
    }
  } else {
    return parseCommentRow(row, stats);
  }
};

const includesChoiceKeyword = (s: string) => {
  return CHOICE_KEYWORD.test(s);
};

const CHOICE_KEYWORD = /(complete|choose)\s(\w+)/g;

export const parseCommentRow = (row: TextRowTypes, stats: StatsLoggerType) => {
  const desc = row.description.toLowerCase();
  const matches = ensureLength(1, Array.from(desc.matchAll(CHOICE_KEYWORD)));
  const [[, , countString]] = matches;
  const count = parseCountString(countString, stats);

  return; // ok
};

const NUMS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  // 'thirteen': 13,
  // 'fourteen': 14,
  // 'fifteen': 15,
  // 'sixteen': 16,
  // 'seventeen': 17,
  // 'eighteen': 18,
  // 'nineteen': 19,
};

const parseCountString = (s: unknown, stats: StatsLoggerType) => {
  if (!(typeof s === "string")) {
    throw new Error(`received unexpected non-string type: ${typeof s}`);
  }

  if (s in NUMS) {
    // case "one" | "two" | "three" ...
    return NUMS[s as keyof typeof NUMS];
  } else if (/\d+/.test(s)) {
    // case "<n>"
    return Number(s);
  } else if (/\d+sh/.test(s)) {
    // case "<n>sh"
    return Number(s.slice(0, -2));
  } else if (/\(\d+\)/.test(s)) {
    // case "(<n>)"
    return Number(s.slice(1, -1));
  }

  throw new Error(`received non-matching numeric text: ${s}`);
};
