import { TypographyOptions } from "@mui/material/styles/createTypography";
import { fontFamilies } from "../tokens/typography";

export const typography: TypographyOptions = {
  fontFamily: fontFamilies.body,

  h1: {
    fontSize: "3rem",
    fontWeight: 700,
    lineHeight: 1.2,
    fontFamily: fontFamilies.heading,
  },
  h2: {
    fontSize: "2.25rem",
    fontWeight: 600,
    fontFamily: fontFamilies.heading,
  },
  h3: {
    fontSize: "1.875rem",
    fontWeight: 600,
    fontFamily: fontFamilies.heading,
  },
  body1: {
    fontSize: "1rem",
    lineHeight: 1.6,
    fontFamily: fontFamilies.body,
  },
  body2: {
    fontSize: "0.875rem",
    fontFamily: fontFamilies.body,
  },
  button: {
    textTransform: "none",
    fontWeight: 600,
    fontFamily: fontFamilies.body,
  },
};
