import { HRow, HRowType } from "./types";
import { Err, Ok, Result, ResultType } from "@graduate/common";
import { ensureLength } from "../utils";
import { getGlobalStatsLogger } from "../runtime/logger";

type RowPicker<T extends HRowType> = HRow & { type: T };
type CommentRow = RowPicker<HRowType.COMMENT>;
type CommentRowNoHours = RowPicker<HRowType.COMMENT_HOUR>;
type HeaderRow = RowPicker<HRowType.HEADER>;
type SubheaderRow = RowPicker<HRowType.SUBHEADER>;
type ParsedCommentRow = RowPicker<HRowType.COMMENT_COUNT>;
type TextRowTypes = CommentRow | HeaderRow | SubheaderRow | CommentRowNoHours;

export const categorizeTextRow = (row: TextRowTypes) => {
  // only 8 (~four of each) of the header types match regex
  // ignore headers for now (even the matching ones)
  if (row.type === HRowType.COMMENT || row.type === HRowType.COMMENT_HOUR) {
    return categorizeCommentRow(row);
  }
  return row;
};

const CHOICE_KEYWORD =
  /(complete|choose) ((at least|any|from|a minimum of) )?(?<countString>\w+)/g;

export const categorizeCommentRow = (
  row: CommentRow | CommentRowNoHours
): CommentRow | CommentRowNoHours | ParsedCommentRow => {
  // const stats = getGlobalStatsLogger();
  const stats = null as any;
  const desc = row.description.toLowerCase();
  const matches = Array.from(desc.matchAll(CHOICE_KEYWORD));
  if (matches.length < 1) {
    stats?.recordField("comments not containing keyword", desc);
    stats?.recordField("comments status", "missing keyword");
    return row;
  }
  // use the first match, ignore the others
  const countString = matches[0].groups?.["countString"];
  const count = parseCountString(countString);
  if (count.type === ResultType.Ok) {
    if (!Number.isInteger(count.ok)) {
      stats?.recordField("comments status", "nan with text: " + countString);
      throw new Error("was nan");
    }
    stats?.recordField("comments status", "obtained count: " + count.ok);
    return convertToParsedRow(row, count.ok);
  } else {
    if ("hour" in row) {
      stats?.recordField("comments status", "non-matching numeric text");
      stats?.recordField("non-matching numberic text", desc);
    } else {
      // hour was zero
      stats?.recordField(
        "comments status",
        "hour = 0; non-matching numeric text"
      );
      stats?.recordField("hour = zero + non-matching", desc);
    }
    return row;
  }
};

const convertToParsedRow = (
  row: CommentRow | CommentRowNoHours,
  parsedCount: number
): ParsedCommentRow => {
  if ("hour" in row) {
    return { ...row, parsedCount, type: HRowType.COMMENT_COUNT };
  }

  return {
    parsedCount,
    type: HRowType.COMMENT_COUNT,
    description: row.description,
    // possible we don't have an hour, but that's fine just use 0
    // todo: replace with an explicit case for zero hour
    hour: 0,
  };
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
  // at the time of writing, these numbers are not needed
  // can uncomment them in the future if this changes
  // 'thirteen': 13,
  // 'fourteen': 14,
  // 'fifteen': 15,
  // 'sixteen': 16,
  // 'seventeen': 17,
  // 'eighteen': 18,
  // 'nineteen': 19,
};

const parseCountString = (s: unknown): Result<number, null> => {
  const stats = getGlobalStatsLogger();
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
