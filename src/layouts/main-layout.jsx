import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex h-dvh flex-col-reverse bg-primary lg:flex-row">
      <Sidebar />
      <div className="no-scrollbar m-4 flex-1 overflow-y-scroll rounded-[20px] bg-white p-9">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
