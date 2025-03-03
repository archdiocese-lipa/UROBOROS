import { Button } from "../ui/button";
import { Label } from "../ui/label";
import GroupAnnouncements from "./GroupAnnouncements";
import MinistryCollapsible from "./MinistryCollapsible";

const CoordinatorViewMinistry = () => {
  return (
    <div className="flex h-full text-primary-text">
      <aside>
        <div>
          <div className="px-8">
            <Label className="text-[20px] font-bold">Your Ministries</Label>
          </div>
        </div>
        <div className="max-w-96">
          <MinistryCollapsible />
        </div>
      </aside>
      <main className="hidden w-full h-full lg:flex lg:flex-col">
        <div className="flex w-full justify-between px-8">
          <div>
            <Label className="text-lg font-bold">Group 1 </Label>
            <p className="text-sm">Group 1 Description</p>
          </div>
          <div className="flex gap-x-2">
            <Button>Announcement</Button>
            <Button variant="outline">Members</Button>
          </div>
        </div>
        {/* Main Content Goes Here */}
        <div className="flex flex-grow place-content-center overflow-y-scroll no-scrollbar bg-primary">
          <GroupAnnouncements/>
        </div>
      </main>
    </div>
  );
};

export default CoordinatorViewMinistry;
