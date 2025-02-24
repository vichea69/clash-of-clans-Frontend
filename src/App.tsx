import { ThemeProvider } from "./components/theme-provider";
import AppRouter from "./routes/AppRouter";
import { BrowserRouter } from "react-router";

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
