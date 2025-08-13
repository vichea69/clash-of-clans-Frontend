import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import AppRouter from "./routes/AppRouter";
import "./App.css";
import { Toaster } from "sonner";
import {Analytics} from "@vercel/analytics/react";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <Toaster position="top-right" />
        <Analytics/>
    </ThemeProvider>
  );
};

export default App;