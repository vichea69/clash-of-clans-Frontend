
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import AppRouter from "./routes/AppRouter";
import "./App.css";

const App = () => {
  return (
    <Router>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <Routes>
          <Route path="/*" element={<AppRouter />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
};

export default App;
