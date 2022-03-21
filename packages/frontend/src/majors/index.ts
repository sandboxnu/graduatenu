import {
  supported2018_2019,
  supported2019_2020,
  supported2020_2021,
} from "@graduate/common";
//Note: major ids for new majors should just be added here for now altough this is not ideal.
//In the future we should probably be able to fetch a list of all major ids from the search backend.
const convertToId = (url: string, year: number) => ({
  year: year,
  majorId: url
    .replace("/#programrequirementstext", "")
    .split("undergraduate/")[1],
});

export const majorIds = supported2020_2021
  .map((url) => convertToId(url, 2020))
  .concat(
    supported2019_2020
      .map((url) => convertToId(url, 2019))
      .concat(supported2018_2019.map((url) => convertToId(url, 2018)))
  );
