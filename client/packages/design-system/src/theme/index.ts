import { createTheme } from "@mui/material/styles";

import { breakpoints } from "./breakpoints";
import { components } from "./components";
import { PALETTE_COLORS } from "./palette";
import { shadows } from "./shadows";
import { shape } from "./shape";
import { typography } from "./typography";

export const theme = createTheme({
  palette: PALETTE_COLORS,
  typography,
  components,
  breakpoints,
  shadows,
  shape,
});
