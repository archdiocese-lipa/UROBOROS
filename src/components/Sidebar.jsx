import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";

import { Title } from "@/components/Title";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

import { sidebarLinks } from "@/constants/sidebarLinks";
import UpIcon from "@/assets/icons/up-icon.svg";

const Sidebar = () => {
  const url = useLocation();
  return (
    <div className="flex w-full lg:flex-col lg:my-9 lg:w-2/12">
      <Title className="hidden lg:block ml-9 max-w-[201px] mb-12">
        Admin Management Centre
      </Title>
      <div className="flex lg:flex-col justify-between flex-1">
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
        <SidebarProfile />
      </div>
    </div>
  );
};

export default Sidebar;

const SidebarProfile = () => {
  return (
    <div className=" hidden lg:flex justify-between items-center ml-9 bg-white h-10 rounded-[20px] p-1 max-w-56">
      <div className=" flex gap-2 items-center">
        <Avatar className=" w-7 h-7">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className=" font-medium text-[16px]">A2K Group</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="hover:cursor-pointer flex items-center justify-center w-11 h-7 bg-accent text-white rounded-[18.5px] px-2">
          <img src={UpIcon} alt={`up icon`} className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Switch to Parishioner</DropdownMenuItem>
          <DropdownMenuItem>Switch to Volunteer</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile Settings</DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const SidebarLink = ({ label, link, icon, selectedIcon, isActive }) => {
  return (
    <div className=" w-10 md:w-16 lg:w-fit">
      <li
        className={cn(
          "flex lg:px-6 mb-2 items-center justify-center lg:justify-start rounded-3xl p-2",
          isActive ? "bg-accent text-primary" : "text-accent"
        )}
      >
        <Link to={link} className=" font-medium text-[16px]">
          <div className="flex lg:gap-2">
            <img
              src={isActive ? selectedIcon : icon}
              alt={`${label} icon`}
              className="h-5 w-5"
            />
            <p className=" hidden lg:block">{label}</p>
          </div>
        </Link>
      </li>
      <p className=" text-accent font-bold text-center hidden md:block lg:hidden text-xs">
        {label}
      </p>
    </div>
  );
};

SidebarLink.propTypes = {
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  selectedIcon: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export { SidebarLink, SidebarProfile };
