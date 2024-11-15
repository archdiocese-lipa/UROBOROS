import { useLocation } from "react-router-dom";
import SidebarLink from "./sideBarLink";
import { sidebarLinks } from "@/constants/sidebarLinks";
import Title from "./Title";
import SidebarProfile from "./SidebarProfile";

export default function Sidebar() {
  const url = useLocation();

  return (
    <div className=" flex w-full lg:flex-col lg:my-9 lg:w-2/12 text-accent">
      <Title className=" hidden lg:block ml-9 text-[26px] w-[201px] font-bold mb-12">
        Admin Management Centre
      </Title>
      <div className=" flex lg:flex-col justify-between flex-1">
        <ul className="lg:ml-4 flex justify-evenly w-full lg:flex-col lg:items-start lg:mr-8">
          {sidebarLinks.map((links, index) => (
            <SidebarLink
              key={index}
              label={links.label}
              link={links.link}
              icon={links.icon}
              selectedIcon={links.selectedIcon}
              isActive={url.pathname === links.link}
            />
          ))}
        </ul>
       <SidebarProfile/>
      </div>
    </div>
  );
}
