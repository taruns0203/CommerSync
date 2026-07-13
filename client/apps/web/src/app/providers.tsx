"use client";
import type { PropsWithChildren } from "react";
import { MuiThemeProvider } from "@client/design-system";

export function Providers({ children }: PropsWithChildren) {
  return <MuiThemeProvider>{children}</MuiThemeProvider>;
}
