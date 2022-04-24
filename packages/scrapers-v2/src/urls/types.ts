export enum College {
  ARTS_MEDIA_DESIGN = "arts-media-design",
  BUSINESS = "business",
  KHOURY = "computer-information-science",
  ENGINEERING = "engineering",
  HEALTH_SCIENCES = "health-sciences",
  SCIENCE = "science",
  SOCIAL_SCIENCES_HUMANITIES = "social-sciences-humanities",
}

type CollegeKeys = keyof typeof College;

export type AvailableMajors = {
  [key in CollegeKeys]: Array<string>;
};
