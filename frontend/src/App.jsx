// theme
import ThemeProvider from './theme/index.jsx';
import Router from './routes.jsx'


function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}

export default App;
