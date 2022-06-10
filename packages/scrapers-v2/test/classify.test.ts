import { addTypeToUrl } from "../src/classify/classify";
import {
  ACCEL_DEG_PROG_CAMD,
  ACCEL_DEG_PROG_COS,
  ACCEL_DEG_PROG_KHOURY,
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

  // ending is in uppercase
  new URL(
    "https://catalog.northeastern.edu/undergraduate/science/behavioral-neuroscience/behavioral-neuroscience-philosophy-bs/"
  ),
];

const CONCENTRATIONS = [
  FINTECH_CONCENTRATION,

  // no tabs
  GLOBAL_BUS_STRATEGY_MINOR,

  // no comma in title
  new URL(
    "https://catalog.northeastern.edu/undergraduate/business/concentrations/accounting"
  ),
  // 'https://catalog.northeastern.edu/undergraduate/business/concentrations/brand-management',
  // 'https://catalog.northeastern.edu/undergraduate/business/concentrations/business-analytics',
  // 'https://catalog.northeastern.edu/undergraduate/business/concentrations/corporate-innovation-venture',
  // 'https://catalog.northeastern.edu/undergraduate/business/concentrations/entrepreneurial-startups',
  // 'https://catalog.northeastern.edu/undergraduate/business/concentrations/family-business',
  // 'https://catalog.northeastern.edu/undergraduate/business/concentrations/fintech',
  // 'https://catalog.northeastern.edu/undergraduate/business/concentrations/finance',
  // 'https://catalog.northeastern.edu/undergraduate/business/concentrations/international-business',
  // 'https://catalog.northeastern.edu/undergraduate/business/concentrations/healthcare-management-consulting',
  // 'https://catalog.northeastern.edu/undergraduate/business/concentrations/management',
  // 'https://catalog.northeastern.edu/undergraduate/business/concentrations/management-information-systems',
  // 'https://catalog.northeastern.edu/undergraduate/business/concentrations/marketing',
  // 'https://catalog.northeastern.edu/undergraduate/business/concentrations/marketing-analytics',
  // 'https://catalog.northeastern.edu/undergraduate/business/concentrations/social-innovation-entrepreneurship',
  // 'https://catalog.northeastern.edu/undergraduate/business/concentrations/supply-chain-management'
];

const MINORS = [
  ACCOUNTING_MINOR,
  ARCHITECTURE_MINOR,
  AEROSPACE_MINOR,
  WOMEN_GENDER_SEXUALITY_MINOR,

  // no tabs
  DIGITAL_METHODS_HUMANITIES_MINOR,

  // has tabs, but with second tab text "program requirements" (not "minor requirements")
  new URL(
    "https://catalog.northeastern.edu/undergraduate/arts-media-design/communication-studies/sports-media-communication-minor"
  ),
  new URL(
    "https://catalog.northeastern.edu/undergraduate/arts-media-design/theatre/performing-arts-minor"
  ),
  new URL(
    "https://catalog.northeastern.edu/undergraduate/business/interdisciplinary-minors/corporate-innovation-venture-minor"
  ),
  // "https://catalog.northeastern.edu/undergraduate/business/interdisciplinary-minors/consulting-minor",
  // "https://catalog.northeastern.edu/undergraduate/business/interdisciplinary-minors/entrepreneurial-startups-minor",
  // "https://catalog.northeastern.edu/undergraduate/business/interdisciplinary-minors/family-business-minor",
  // "https://catalog.northeastern.edu/undergraduate/business/interdisciplinary-minors/social-innovation-entrepreneurship-minor",
  // "https://catalog.northeastern.edu/undergraduate/business/interdisciplinary-minors/strategy-minor",
  // "https://catalog.northeastern.edu/undergraduate/engineering/electrical-computer/robotics-minor",
  // "https://catalog.northeastern.edu/undergraduate/health-sciences/clinical-rehabilitation-sciences/human-movement-science-minor",
  // "https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/cultures-societies-global-studies/german-minor",
];

const UNKNOWN = [
  // no tabs
  // no elem w id ending in "requirementstextcontainer"
  ACCEL_DEG_PROG_KHOURY,
  ACCEL_DEG_PROG_CAMD,
  ACCEL_DEG_PROG_COS,
  // ACCEL_DEG_PROG_BUSINESS,
  // ACCEL_DEG_PROG_ENG,
  // ACCEL_DEG_PROG_CSSH,
  // ACCEL_DEG_PROG_CSSH,
];

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
