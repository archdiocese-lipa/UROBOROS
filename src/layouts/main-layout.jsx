import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex h-dvh flex-col-reverse bg-primary lg:flex-row">
      <Sidebar />
      <div className=" mb-3 md:m-4 flex-1 rounded-none md:rounded-[20px] bg-white overflow-y-scroll no-scrollbar border-b border-accent/30 md:border-none p-4 pb-0 md:p-9">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
