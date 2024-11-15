import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UpIcon from "@/assets/icons/up-icon.svg";

export default function SidebarProfile() {
  return (
    <div className=" hidden lg:flex justify-between items-center ml-9 bg-white h-10 rounded-[20px] p-1 max-w-56">
      <div className=" flex gap-2 items-center">
        <Avatar className=" w-7 h-7">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <p className=" font-medium text-[16px]">A2K Group</p>
      </div>
      <div className=" hover:cursor-pointer flex items-center justify-center w-11 h-7 bg-accent text-white rounded-[18.5px] px-2">
        <img src={UpIcon} alt={`up icon`} className="h-5 w-5" />
      </div>
    </div>
  );
}
