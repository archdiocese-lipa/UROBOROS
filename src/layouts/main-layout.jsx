import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

// Layout component that conditionally renders Sidebar
const MainLayout = () => {
  return (
    <div className="flex bg-primary h-dvh flex-col-reverse lg:flex-row">
      <Sidebar />
      <div className="bg-white rounded-[20px] flex-1 p-9 m-4 overflow-y-scroll no-scrollbar">
        {/* Use Outlet here to render the child route */}
        {/* dito lagay yung protected route */}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
