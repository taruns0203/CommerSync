"use client";

import { useTheme } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";

export default function ThemeDebugPage() {
  const theme = useTheme();

  console.log("Theme from design-system → web:", theme);

  return (
    <>
      <Typography variant="h1">Space Grotesk Heading</Typography>

      <Typography variant="body1" color="brand.secondary">
        Lato body text example
      </Typography>

      <Box sx={{ boxShadow: 9 }}>
        <Typography variant="body2" color="brand.tertiary">
          Lato body text example
        </Typography>
      </Box>
    </>
  );
}
