import React from "react";
import { Outlet } from "react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MainLayout: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
