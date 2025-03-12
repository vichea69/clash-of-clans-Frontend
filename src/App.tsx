import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import AppRouter from "./routes/AppRouter";
import "./App.css";
import { Toaster } from "sonner";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
};

export default App;