import { Major } from "graduate-common";

/**
 * Finds a major from the given list of majors with the given name.
 * @param name    the name of the major being searched
 * @param majors  the list of majors to filter through
 */
export function findMajorFromName(
  name: string,
  majors: Major[]
): Major | undefined {
  let major: Major | undefined = majors.find(major => major.name === name);
  if (!major) {
    return undefined;
  }
  return major;
}
