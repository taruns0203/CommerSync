import { createTheme } from "@mui/material/styles";
import { PALETTE_COLORS } from "./palette";
import { typography } from "./typography";
import { components } from "./components";
import { breakpoints } from "./breakpoints";
import { shadows } from "./shadows";
import { shape } from "./shape";

export const theme = createTheme({
  palette: PALETTE_COLORS,
  typography,
  components,
  breakpoints,
  shadows,
  shape,
});
