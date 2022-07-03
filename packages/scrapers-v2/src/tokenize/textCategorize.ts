import { HRow, HRowType } from "./types";
import { StatsLogger as StatsLoggerType } from "../runtime/logger";
import { Err, Ok, Result, ResultType } from "@graduate/common";
import { ensureLength } from "../utils";

type TextRowTypes = HRow & {
  type: HRowType.COMMENT | HRowType.HEADER | HRowType.SUBHEADER;
};
export const categorizeTextRow = (
  row: TextRowTypes,
  stats?: StatsLoggerType
) => {
  // only 8 (~four of each) of the header types match regex
  // ignore headers for now (even the matching ones)
  if (row.type === HRowType.COMMENT) {
    return parseCommentRow(row, stats);
  }
};

const CHOICE_KEYWORD =
  /(complete|choose) ((at least|any|from|a minimum of) )?(?<countString>\w+)/g;

export const parseCommentRow = (row: TextRowTypes, stats?: StatsLoggerType) => {
  const desc = row.description.toLowerCase();
  const m = Array.from(desc.matchAll(CHOICE_KEYWORD));
  // const matches = ensureLengthAtLeast(1, m);
  if (m.length < 1) {
    stats?.recordField("comments not containing keyword", desc);
    stats?.recordField("comments status", "missing keyword");
    return;
  }
  const matches = m;
  // use the first match, ignore the others
  const countString = matches[0].groups?.["countString"];
  const count = parseCountString(countString, stats);
  if (count.type === ResultType.Ok) {
    if (!Number.isInteger(count.ok)) {
      stats?.recordField("comments status", "nan with text: " + countString);
      throw new Error("was nan");
    }
    stats?.recordField("comments status", "obtained count: " + count.ok);
  } else {
    if (row.hour !== 0) {
      stats?.recordField("comments status", "non-matching numeric text");
      stats?.recordField("non-matching numberic text", desc);
    } else {
      // was zero
      stats?.recordField(
        "comments status",
        "hour = 0; non-matching numeric text"
      );
      stats?.recordField("hour = zero + non-matching", desc);
    }
  }

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

const parseCountString = (
  s: unknown,
  stats?: StatsLoggerType
): Result<number, null> => {
  if (!(typeof s === "string")) {
    throw new Error(`received unexpected non-string type: ${typeof s}`);
  }

  if (s in NUMS) {
    // case "one" | "two" | "three" ...
    return Ok(NUMS[s as keyof typeof NUMS]);
  } else if (/\d+/.test(s)) {
    // cases "<n>", "(<n>)", or "<n>sh"
    const [[n]] = ensureLength(1, Array.from(s.matchAll(/\d+/g)));
    return Ok(Number(n));
  }

  stats?.recordField("received non-matching numeric text", s);
  return Err(null);
};
