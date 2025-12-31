import { Shadows } from "@mui/material/styles";
import { shadowTokens } from "../tokens/shadows";

export const shadows: Shadows = [
  "none", // 0 - no elevation

  shadowTokens.sm, //1 (cards, inputs)
  shadowTokens.sm, //2
  shadowTokens.sm, //3

  shadowTokens.lg, //4
  shadowTokens.lg, //5
  shadowTokens.lg, //6

  shadowTokens.lg, //7
  shadowTokens.lg, //8

  shadowTokens.glow, //9
  shadowTokens.glow, //10

  //higher elevations (rarely used)
  ...Array(14).fill(shadowTokens.lg),
] as Shadows;
