import React from "react";
import { useMemo } from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider } from "@mui/material/styles";
import palette from "./palette";
import shadows from "./shadows";
import typography from "./typography";
import GlobalStyles from "./globalStyles";
import customShadows from "./customShadows";
import componentsOverride from "./overrides";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeOptions = useMemo(
    () => ({
      palette,
      shape: { borderRadius: 6 },
      typography,
      shadows: shadows(),
      customShadows: customShadows()
    }),
    []
  );

  const theme = createTheme(themeOptions as any );
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
