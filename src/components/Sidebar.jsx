import { useLocation } from "react-router-dom";
import SidebarLink from "./sideBarLink";
import { sidebarLinks } from "@/constants/sidebarLinks";
import SidebarProfile from "./SidebarProfile";
import { Title } from "./Title";

export default function Sidebar() {
  const url = useLocation();

  return (
    <div className=" flex w-full lg:flex-col lg:my-9 lg:w-2/12 ">
      <Title className=" hidden lg:block ml-9 max-w-[201px] mb-12">
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
