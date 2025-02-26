import { Button } from "../ui/button";
import { Label } from "../ui/label";
import MinistryCollapsible from "./MinistryCollapsible";

const CoordinatorViewMinistry = () => {
  return (
    <div className="flex text-primary-text">
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
      <main className="hidden w-full lg:block">
        <div className="flex justify-between px-8">
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
        <div className="grid h-dvh place-content-center">
          Announcement Content
        </div>
      </main>
    </div>
  );
};

export default CoordinatorViewMinistry;
