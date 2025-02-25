import { useState } from "react";
import { Label } from "../ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SheetGroups from "./SheetGroups";
import ConfigureGroup from "./ConfigureGroup";

const MinistryCollapsible = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-96 px-5 py-2">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="rounded-xl border border-primary-outline p-2 hover:bg-primary"
      >
        <div className="flex items-center justify-between px-4">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <div>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <Label className="font-bold">Ministry A</Label>
                  <p className="text-xs">3 Groups</p>
                </div>
              </div>
            </div>
          </CollapsibleTrigger>
          <ConfigureGroup />
        </div>
        <CollapsibleContent>
          <div className="mt-1 pl-16 pr-10">
            <ul className="border-l-2 border-primary-outline pl-7">
              <SheetGroups />
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default MinistryCollapsible;
