import { Components } from "@mui/material";

export const components: Components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        fontFamily: "var(--font-lato), system-ui, sans-serif",
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 32, // absurd on purpose
        backgroundColor: "#ff00ff",
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
};
