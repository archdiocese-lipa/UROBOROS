import { Label } from "../ui/label";
import MinistryCollapsible from "./MinistryCollapsible";

const CoordinatorViewMinistry = () => {
  return (
    <div className="p-0 text-primary-text">
      <div className="border-divider border-b border-primary-text py-4">
        <Label className="text-[20px] font-bold">Your Ministries</Label>
      </div>
      <MinistryCollapsible />
      <MinistryCollapsible />
    </div>
  );
};

export default CoordinatorViewMinistry;
