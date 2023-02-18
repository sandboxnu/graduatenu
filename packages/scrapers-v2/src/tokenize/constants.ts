// matches subject and courseId, ex: XXXX<space>9999
export const COURSE_REGEX = /([A-Z]{2,4})\s(\d{4})/g;

// just subject
export const SUBJECT_REGEX = /([A-Z]{2,4})/g;

// Range regexes, used to match on text to determine range type
// For full documentation, see notion doc

// Case 1
export const RANGE_LOWER_BOUNDED_MAYBE_EXCEPTIONS_1 =
  /([A-Z]{2,4})\s(\d{4}) or higher/;

// Case 2
export const RANGE_LOWER_BOUNDED_MAYBE_EXCEPTIONS_2 =
  /((Select from any)|(Complete \w+)) [A-Z]{2,4} courses? numbered \d{4} or above/;

// for parsing the text of the above (to pull out course info)
export const RANGE_LOWER_BOUNDED_PARSE =
  /([A-Z]{2,4})(( courses? numbered )|(\s))([0-9]{4})/g;

// Case 3 and 4
export const RANGE_BOUNDED_MAYBE_EXCEPTIONS =
  /([A-Z]{2,4})\s(\d{4})(( to )|(-)|(–))([A-Z]{2,4})\s(\d{4})/;

// Case 5 and 6
export const RANGE_UNBOUNDED = /([A-Z]{2,4}, ){2,}and ([A-Z]{2,4})/;

export const XOM_REGEX_CREDITS = /^complete (\d+) credits.+choose courses within the following ranges:$/
export const XOM_REGEX_NUMBER = /^complete (one|two|three|four|five|six|seven|eight|nine|ten) of the following courses not already taken:$/