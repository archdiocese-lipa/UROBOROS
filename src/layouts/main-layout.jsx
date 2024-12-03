import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex h-dvh flex-col-reverse bg-primary lg:flex-row">
      <Sidebar />
      <div className="m-4 flex-1 rounded-[20px] bg-white overflow-y-scroll no-scrollbar p-4 md:p-9">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
