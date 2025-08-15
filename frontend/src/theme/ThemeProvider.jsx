import { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import lightPalette from './palette';
import darkPalette from './darkPalette';
import typography from './typography';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';

export const ThemeContext = createContext({
  toggleTheme: () => {},
});

export default function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState('light');

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const themeOptions = useMemo(
    () => ({
      palette: themeMode === 'light' ? lightPalette : darkPalette,
      shape: { borderRadius: 8 },
      typography,
      shadows,
      customShadows,
    }),
    [themeMode],
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeContext.Provider value={{ toggleTheme, themeMode }}>
        <MUIThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MUIThemeProvider>
      </ThemeContext.Provider>
    </StyledEngineProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
