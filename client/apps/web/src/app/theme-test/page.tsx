"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function ThemeDebugPage() {
  const theme = useTheme();

  // eslint-disable-next-line no-console
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
