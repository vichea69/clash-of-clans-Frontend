import { Outlet } from "react-router";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
