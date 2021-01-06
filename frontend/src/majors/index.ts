import {
  supported2018_2019,
  supported2019_2020,
  supported2020_2021,
} from "../../../common/constants";
//Note: major ids for new majors should just be added here for now altough this is not ideal.
//In the future we should probably be able to fetch a list of all major ids from the search backend.
const convertToId = (url: string, year: number) => ({
  year: year,
  majorId: url
    .replace("/#programrequirementstext", "")
    .split("undergraduate/")[1],
});

export const majorIds = supported2020_2021
  .map(url => convertToId(url, 2020))
  .concat(
    supported2019_2020
      .map(url => convertToId(url, 2019))
      .concat(supported2018_2019.map(url => convertToId(url, 2018)))
  );

export const majorMap: Record<string, string> = {
  "computer-information-science/computer-science/bscs":
    "Computer Science, BSCS",
  "science/biochemistry/biochemistry-bs": "Biochemistry, BS",
  "science/mathematics/mathematics-bs": "Mathematics, BS",
  "computer-information-science/computer-information-science-combined-majors/bs":
    "Computer Science and Information Science, BS",
  "computer-information-science/computer-information-science-combined-majors/computer-science-cognitive-psychology-bs":
    "Computer Science and Cognitive Psychology, BS",
  "computer-information-science/computer-information-science-combined-majors/information-science-cognitive-psychology-bs":
    "Information Science and Cognitive Psychology, BS",
  "computer-information-science/computer-information-science-combined-majors/data-science-health-science-bs":
    "Data Science and Health Science, BS",
  "computer-information-science/computer-information-science-combined-majors/computer-science-political-science-bs":
    "Computer Science and Political Science, BS",
  "computer-information-science/computer-information-science-combined-majors/computer-science-linguistics-bs":
    "Computer Science and Linguistics, BS",
  "computer-information-science/computer-information-science-combined-majors/computer-science-mathematics-bs":
    "Computer Science and Mathematics, BS",
  "computer-information-science/computer-information-science-combined-majors/computer-science-communication-studies-bs":
    "Computer Science and Communication Studies, BS",
  "computer-information-science/computer-information-science-combined-majors/computer-science-criminal-justice-bs":
    "Computer Science and Criminal Justice, BS",
  "computer-information-science/computer-information-science-combined-majors/information-science-journalism-bs":
    "Information Science and Journalism, BS",
  "computer-information-science/computer-information-science-combined-majors/computer-science-media-arts-bs":
    "Computer Science and Media Arts, BS",
  "computer-information-science/computer-information-science-combined-majors/computer-science-philosophy-bs":
    "Computer Science and Philosophy, BS",
  "computer-information-science/computer-information-science-combined-majors/cybersecurity-economics-bs":
    "Cybersecurity and Economics, BS",
  "computer-information-science/computer-information-science-combined-majors/economics-bs":
    "Computer Science and Economics, BS",
};
