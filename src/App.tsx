import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import AppRouter from "./routes/AppRouter";
import "./App.css";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
