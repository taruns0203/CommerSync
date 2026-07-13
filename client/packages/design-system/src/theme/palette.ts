import {
  PaletteOptions,
  SimplePaletteColorOptions,
} from "@mui/material/styles";
import {
  BG_MAIN,
  BG_SECONDARY,
  GLASS_MAIN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_MUTED,
  ACCENT_PRIMARY,
  ACCENT_SECONDARY,
  ACCENT_TERTIARY,
} from "../tokens/colors";

declare module "@mui/material/styles" {
  interface PaletteColor {
    secondary?: string;
    tertiary?: string;
  }

  interface SimplePaletteColorOptions {
    secondary?: string;
    tertiary?: string;
  }
  interface Palette {
    brand: Palette["primary"];
  }

  interface PaletteOptions {
    brand?: PaletteOptions["primary"];
  }
}

const COLOR_PRIMARY: SimplePaletteColorOptions = {
  main: BG_MAIN,
  contrastText: BG_SECONDARY,
  light: GLASS_MAIN,
};

const COLOR_SECONDARY: SimplePaletteColorOptions = {
  main: TEXT_PRIMARY,
  contrastText: TEXT_SECONDARY,
  light: TEXT_MUTED,
};

export const PALETTE_COLORS: Partial<PaletteOptions> = {
  mode: "light",
  primary: COLOR_PRIMARY,
  secondary: COLOR_SECONDARY,
  brand: {
    main: ACCENT_PRIMARY,
    secondary: ACCENT_SECONDARY,
    tertiary: ACCENT_TERTIARY,
  },
};
