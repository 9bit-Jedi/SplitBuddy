
import { useContext } from 'react';
import { ThemeContext } from './theme/ThemeProvider';
import Router from './routes.jsx'
import {Button} from '@mui/material';

export default function Main() {
  const { toggleTheme, themeMode } = useContext(ThemeContext);
  return (
    <>
      <Button onClick={toggleTheme}>
        Toggle Theme: {themeMode}
      </Button>
      <Router />
    </>
  );
}
