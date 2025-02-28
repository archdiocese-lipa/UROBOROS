import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const MainLayout = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <div className="flex h-[calc(100dvh_-_1rem)] flex-col-reverse bg-primary lg:flex-row">
        <Sidebar />
        <div className="no-scrollbar mb-3 flex-1 overflow-y-scroll rounded-none border-b border-accent/30 bg-white p-4 pb-0 md:m-4 md:rounded-[20px] md:border-none md:p-9">
          <Outlet />
        </div>
      </div>
      <div className="flex h-[1.3rem] w-full items-end justify-center border-t border-accent/30 bg-primary pb-1 md:pl-4 lg:justify-start lg:border-none">
        <p className="font-regular text-[0.7rem] text-primary-text/40 lg:text-[0.8rem]">
          Developed by{" "}
          <a href="http://a2kgroup.org" target="_blank">
            A2K Group Corporation <span> © {currentYear}</span>
          </a>
        </p>
      </div>
    </>
  );
};

export default MainLayout;
