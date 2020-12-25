export function getInitialsFromName(fullName: string) {
  const names = fullName.split(" ");
  if (names.length >= 2) {
    return names[0][0] + names[1][0];
  } else if (names.length === 1) {
    return names[0][0];
  } else {
    return "";
  }
}
