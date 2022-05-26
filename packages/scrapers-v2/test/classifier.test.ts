import { classifyCatalogEntries } from "../src/classifier/classifier";
import {
  ACCELERATED_DEGREE_PROGRAM,
  ACCOUNTING_MINOR,
  AEROSPACE_MINOR,
  ARCHITECTURE_MINOR,
  BSCS,
  BUSINESS,
  CHEMICAL_ENG,
  CS_GAME_DEV,
  CS_HISTORY,
  CS_MUSIC_WITH_TECH_MAJOR,
  FINTECH_CONCENTRATION,
  MEDIA_SCREEN_STUDIES_HISTORY,
  WOMEN_GENDER_SEXUALITY_MINOR,
} from "./testUrls";

const inputs = [
  BSCS,
  CS_HISTORY,
  MEDIA_SCREEN_STUDIES_HISTORY,
  ACCOUNTING_MINOR,
  ARCHITECTURE_MINOR,
  FINTECH_CONCENTRATION,
  AEROSPACE_MINOR,
  ACCELERATED_DEGREE_PROGRAM,
  CS_MUSIC_WITH_TECH_MAJOR,
  WOMEN_GENDER_SEXUALITY_MINOR,
  BUSINESS,
  CHEMICAL_ENG,
  CS_GAME_DEV,
];

describe("Filters work", () => {
  for (const url of inputs) {
    test(url, async () => {
      expect(await classifyCatalogEntries([url])).toMatchSnapshot();
    });
  }
});
