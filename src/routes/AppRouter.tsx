import MainLayout from "@/layouts/MainLayout";
import About from "@/page/About";
import Home from "@/page/Home";
import NotFound from "@/page/NotFound";
import { Routes, Route } from "react-router";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />}></Route>
        <Route path={"/about"} element={<About />}></Route>
        <Route path={"*"} element={<NotFound />}></Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
