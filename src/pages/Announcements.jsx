import { Title } from "@/components/Title";
import AnnouncementsIconSelected from "@/assets/icons/announcements-icon-selected.svg";
import { Button } from "@/components/ui/button";
import Announcement from "@/components/Announcements/Announcement";
import GlobeIcon from "@/assets/icons/globe-icon.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Filter from "@/components/Announcements/Filter";

export default function Announcements() {
  return (
    <div className=" flex gap-8 w-full px-12">
      <div className=" flex flex-col w-3/4 ">
        <div className=" flex justify-between items-end mb-6 ">
          <div className="">
            <Title>Announcements</Title>
            {/* <Description>Announce announcements to announce.</Description> */}
          </div>
          <Button className=" rounded-[15px]" variant="uroboros">
            <img
              className="w-5 h-5"
              src={AnnouncementsIconSelected}
              alt="icon"
            />
            Create Announcement
          </Button>
        </div>
        <div className="w-full flex-1 bg-primary rounded-2xl py-6 px-9 border border-primary-outline overflow-y-scroll no-scrollbar">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-[10px] border border-primary-outline mb-3 pt-5 pb-6 px-8"
            >
              <Announcement />
            </div>
          ))}
        </div>
      </div>
      <div className=" w-1/4 py-6 px-8 border border-primary-outline mt-[64px] rounded-[15px] overflow-y-scroll no-scrollbar">
        <p className=" mb-3 text-accent font-bold">Filter by your groups.</p>
        <div className=" rounded-xl bg-accent">
          <div className="  py-3 px-[18px] ">
            <div className="flex justify-between">
              <h3 className=" text-white font-bold">All</h3>
              <div className="hover:cursor-pointer flex items-center justify-center h-7  bg-white text-accent rounded-[18.5px] py-3 px-3">
                <img
                  src={GlobeIcon}
                  alt={`up icon`}
                  className="h-5 w-5 bg-pr"
                />
              </div>
            </div>
            <p className=" pb-1 text-white font-medium text-[13px] opacity-60">
              This shows all group announcements
            </p>
            <div className="flex justify-start relative w-full h-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    left: `${i * 20}px`,
                    zIndex: 999 - i,
                  }}
                  className={`absolute p-[3px] bg-accent  rounded-full`}
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-gray my-3" />
        <div className=" mb-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Filter key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
