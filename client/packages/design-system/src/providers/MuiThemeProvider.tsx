"use client";

import { PropsWithChildren } from "react";

import { CssBaseline, ThemeProvider } from "@mui/material";

import { theme } from "../theme";

export function MuiThemeProvider(props: PropsWithChildren) {
  const { children } = props;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
