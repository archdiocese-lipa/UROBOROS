import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex h-dvh flex-col-reverse bg-primary lg:flex-row">
      <Sidebar />
      <div className="no-scrollbar mb-3 flex-1 overflow-y-scroll rounded-none border-b border-accent/30 bg-white p-4 pb-0 shadow-lg md:m-4 md:rounded-[20px] md:border-none md:p-9">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
