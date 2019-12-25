//Note: major ids for new majors should just be added here for now altough this is not ideal.
//In the future we should probably be able to fetch a list of all major ids from the search backend.
export const majorIds = [
  "computer-information-science/computer-science/bscs",
  "science/biochemistry/biochemistry-bs",
  "science/mathematics/mathematics-bs",
];

export const majorMap: Record<string, string> = {
  "computer-information-science/computer-science/bscs":
    "Computer Science, BSCS",
  "science/biochemistry/biochemistry-bs": "Biochemistry, BS",
  "science/mathematics/mathematics-bs": "Mathematics, BS",
};
