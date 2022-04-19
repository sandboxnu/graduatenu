import { extendTheme } from "@chakra-ui/react";

const colors = {
  primary: {
    main: "#eb5756",
    50: "#ffe5e5",
    100: "#fbb9ba",
    200: "#f38d8d",
    300: "#ec605f",
    400: "#e63433",
    500: "#cc1c19",
    600: "#a01413",
    700: "#730c0c",
    800: "#460606",
    900: "#1e0000",
  },
  blue: {
    main: "#6080aa",
    50: "#e5f3ff",
    100: "#c9d7e9",
    200: "#aabdd6",
    300: "#8aa2c2",
    400: "#6988af",
    500: "#506e96",
    600: "#3d5675",
    700: "#2a3d55",
    800: "#172536",
    900: "#030c19",
  },
  gray: {
    main: "#e7ebf1",
    50: "#f9f9fa",
    100: "#eceeef",
    200: "#dfe1e3",
    300: "#d1d3d5",
    400: "#c2c4c6",
    500: "#b2b3b5",
    600: "#9fa0a1",
    700: "#88898a",
    800: "#6b6c6d",
    900: "#3f3f40",
  },
  green: {
    main: "#6ba27d",
    50: "#e6f8ec",
    100: "#cce2d4",
    200: "#afcfb9",
    300: "#90ba9e",
    400: "#72a683",
    500: "#598d6a",
    600: "#446e51",
    700: "#2f4e3a",
    800: "#1a3021",
    900: "#001306",
  },
};

// we only support tablets and up
const breakpoints = {
  desktop: "1280px",
  laptop: "1024px",
  tablet: "640x",
};

/**
 * Default spacing is represented with numbers, we can expand this defnition in
 * either direction (5xs, ..., 5xl) as needed.
 */
const space = {
  "2xs": "0.25rem",
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
};

export const theme = extendTheme({
  colors,
  breakpoints,
  space,
});
