import axios from "axios";
import * as cheerio from "cheerio";

export const loadHTML = async (url: string): Promise<CheerioStatic> => {
  try {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  } catch (error) {
    throw error;
  }
};
