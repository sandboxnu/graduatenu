export const COURSE_REGEX = /([A-Z]{2,4})\s([0-9]{4})/g;

export const RANGE_LOWER_BOUNDED_MAYBE_EXCEPTIONS_1 =
  /([A-Z]{2,4})\s([0-9]{4}) or higher/;
export const RANGE_LOWER_BOUNDED_MAYBE_EXCEPTIONS_2 =
  /((Select from any)|(Complete \w+)) [A-Z]{2,4} courses? numbered [0-9]{4} or above/;
export const RANGE_LOWER_BOUNDED_PARSE =
  /([A-Z]{2,4})(( courses? numbered )|(\s))([0-9]{4})/g;

export const RANGE_BOUNDED =
  /([A-Z]{2,4})\s([0-9]{4})(( to )|(-)|(–))([A-Z]{2,4})\s([0-9]{4})/;

export const RANGE_UNBOUNDED = /([A-Z]{2,4}, ){2,}((and)|(or)) ([A-Z]{2,4})/;
export const SUBJECT_REGEX = /([A-Z]{2,4})/g;
