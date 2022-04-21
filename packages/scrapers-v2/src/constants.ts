export const COURSE_REGEX = /([A-Z]{2,4})\s([0-9]{4})/g;

export const RANGE_1_REGEX = /([A-Z]{2,4})\s([0-9]{4}) or higher/;
export const RANGE_2_REGEX =
  /([A-Z]{2,4})\s([0-9]{4})(( to )|(-)|(–))([A-Z]{2,4})\s([0-9]{4})/;
export const RANGE_3_REGEX =
  /((Select from any)|(Complete \w+)) [A-Z]{2,4} courses? numbered [0-9]{4} or above/;
export const RANGE_3_PARSE_REGEX = /([A-Z]{2,4}) courses? numbered ([0-9]{4})/g;
