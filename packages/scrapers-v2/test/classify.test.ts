import { addTypeToUrl } from "../src/classify/classify";
import {
  ACCELERATED_DEGREE_PROGRAM,
  ACCOUNTING_MINOR,
  AEROSPACE_MINOR,
  ARCH_ENGLISH,
  ARCHITECTURE_MINOR,
  BSCS,
  BUSINESS,
  CHEMICAL_ENG,
  CS_GAME_DEV,
  CS_HISTORY,
  CS_MUSIC_WITH_TECH_MAJOR,
  DIGITAL_METHODS_HUMANITIES_MINOR,
  FINTECH_CONCENTRATION,
  GLOBAL_BUS_STRATEGY_MINOR,
  MATH_POLYSCI,
  MEDIA_SCREEN_STUDIES_HISTORY,
  WOMEN_GENDER_SEXUALITY_MINOR,
} from "./testUrls";
import { CatalogEntryType } from "../src/classify/types";

const MAJORS = [
  BSCS,
  CS_HISTORY,
  MEDIA_SCREEN_STUDIES_HISTORY,
  CS_MUSIC_WITH_TECH_MAJOR,
  BUSINESS,
  CHEMICAL_ENG,
  CS_GAME_DEV,

  // no tabs
  MATH_POLYSCI,
  ARCH_ENGLISH,
];

const CONCENTRATIONS = [
  FINTECH_CONCENTRATION,

  // no tabs
  GLOBAL_BUS_STRATEGY_MINOR,
];

const MINORS = [
  ACCOUNTING_MINOR,
  ARCHITECTURE_MINOR,
  AEROSPACE_MINOR,
  WOMEN_GENDER_SEXUALITY_MINOR,

  // no tabs
  DIGITAL_METHODS_HUMANITIES_MINOR,
];

const UNKNOWN = [ACCELERATED_DEGREE_PROGRAM];

const testUrlsMatchType = (type: CatalogEntryType, urls: URL[]) => {
  describe(type, () => {
    for (const url of urls) {
      test(url.href, async () => {
        const { type } = await addTypeToUrl(url);
        expect(type).toBe(type);
      });
    }
  });
};

describe("classify", () => {
  testUrlsMatchType(CatalogEntryType.Unknown, UNKNOWN);
  testUrlsMatchType(CatalogEntryType.Major, MAJORS);
  testUrlsMatchType(CatalogEntryType.Minor, MINORS);
  testUrlsMatchType(CatalogEntryType.Concentration, CONCENTRATIONS);
});
