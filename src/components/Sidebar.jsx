import { useLocation, Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import { useUser } from "@/context/useUser"; // Adjust the path as needed

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

import { SIDEBAR_LINKS } from "@/constants/sidebarLinks";

import { ChevronUp } from "@/assets/icons/icons";

const Sidebar = () => {
  const url = useLocation();

  const {userData}= useUser()

  return (
    <div className="flex w-full lg:my-9 lg:w-2/12 lg:flex-col">
      <Title className="mb-12 ml-9 hidden max-w-[201px] lg:block">
        Admin Management Centre
      </Title>
      <div className="flex flex-1 justify-between lg:flex-col">
        <ul className="flex w-full justify-evenly gap-2 lg:ml-4 lg:mr-8 lg:flex-col lg:items-start">
        {userData &&
            SIDEBAR_LINKS[userData?.role].map((links, index) => (
              <SidebarLink
                key={index}
                label={links.label}
                link={links.link}
                icon={links.icon}
                selectedIcon={links.selectedIcon}
                isActive={url.pathname === links.link}
              />
            ))}
          <SidebarProfile />
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

const SidebarProfile = () => {
  const { logout } = useUser(); // Destructure logout and userData
  const navigate = useNavigate(); // Initialize navigate
  const loc = useLocation(); // Initialize loc

  const handleLogout = async () => {
    try {
      await logout(); // Call logout from UserContext

      navigate("/", { replace: true, state: { from: loc.pathname || "/" } }); // Redirect to the home page
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className=" flex flex-col justify-center items-center">
    <div className="flex gap-2 lg:mt-14 h-10 max-w-56 items-center justify-between rounded-[20px] bg-white p-1 lg:ml-6">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="lg:hidden  hover:cursor-pointer">
            <Avatar className="h-7 w-7">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Switch to Parishioner</DropdownMenuItem>
            <DropdownMenuItem>Switch to Volunteer</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Avatar className="hidden lg:block h-7 w-7">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        <p className="hidden text-[16px] font-medium lg:block">A2K Group</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="hidden h-7 w-11 items-center justify-center rounded-[18.5px] bg-accent px-2 text-white hover:cursor-pointer lg:flex">
          <ChevronUp className="h-5 w-5 text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Switch to Parishioner</DropdownMenuItem>
          <DropdownMenuItem>Switch to Volunteer</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <p className="hidden md:block text-xs font-semibold lg:hidden">Settings</p>
    </div>
  );
};

const SidebarLink = ({ label, link, icon, selectedIcon, isActive }) => {
  return (
    <div className="w-10 md:w-16 lg:w-fit">
      <li
        className={cn(
          "flex items-center justify-center rounded-3xl p-2 lg:justify-start lg:px-6",
          isActive ? "bg-accent text-primary" : "text-accent"
        )}
      >
        <Link
          to={link}
          className="flex items-center justify-center text-[16px] font-medium lg:gap-2"
        >
          <Icon icon={isActive ? selectedIcon : icon} className="h-6 w-6" />
          <p className="hidden lg:block">{label}</p>
        </Link>
      </li>
      <p className="hidden text-center text-xs font-bold text-accent md:block lg:hidden">
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
