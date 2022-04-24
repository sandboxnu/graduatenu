import { loadHTML } from "../utils";
import { AvailableMajors } from "./types";

export const scrapeYearlyMajorLinks = async (
  url: string
): Promise<AvailableMajors> => {
  try {
    const $ = await loadHTML(url);

    return retrieveAllAvailableMajors($);
  } catch (e) {
    throw e;
  }
};

const retrieveAllAvailableMajors = ($: CheerioStatic): AvailableMajors => {
  throw new Error("Function not implemented.");
};
