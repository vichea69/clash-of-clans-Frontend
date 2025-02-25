import { Routes, Route } from "react-router";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/page/Home";
import About from "@/page/About";
import Base from "@/components/Base";
import NotFound from "@/page/NotFound";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/base" element={<Base />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
