export enum College {
  ARTS_MEDIA_DESIGN = "undergraduate/arts-media-design/",
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

export type MajorPath = {
  // base: https://catalog.northeastern.edu/archive/2018-2019/undergraduate/
  college: string;
  // college: arts-media-design
  path: Array<string>;
  // "architecture"
  // "architecture", "architecture-bs"
}