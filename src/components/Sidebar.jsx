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
  return (
    <div className="flex w-full lg:my-9 lg:w-2/12 lg:flex-col">
      <Title className="mb-12 ml-9 hidden max-w-[201px] lg:block">
        Admin Management Centre
      </Title>
      <div className="flex flex-1 justify-between lg:flex-col">
        <ul className="flex w-full justify-evenly gap-2 lg:ml-4 lg:mr-8 lg:flex-col lg:items-start">
          {SIDEBAR_LINKS.map((links, index) => (
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
  const { logout } = useUser(); // Destructure logout and userData
  const navigate = useNavigate(); // Initialize navigate
  const loc = useLocation(); // Initialize loc

  const handleLogout = async () => {
    try {
      await logout(); // Call logout from UserContext
      console.log("User logged out successfully");
      navigate("/", { replace: true, state: { from: loc.pathname || "/" } }); // Redirect to the home page
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="ml-9 hidden h-10 max-w-56 items-center justify-between rounded-[20px] bg-white p-1 lg:flex">
      <div className="flex items-center gap-2">
        <Avatar className="h-7 w-7">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="text-[16px] font-medium">A2K Group</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-7 w-11 items-center justify-center rounded-[18.5px] bg-accent px-2 text-white hover:cursor-pointer">
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
