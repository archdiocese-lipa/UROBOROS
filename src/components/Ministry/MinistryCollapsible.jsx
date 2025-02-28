import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Label } from "../ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import SheetGroups from "./SheetGroups";
import ConfigureGroup from "./ConfigureGroup";

import { getAssignedMinistries } from "@/services/ministryService";
import { useUser } from "@/context/useUser";
import useGroups from "@/hooks/useGroups";

const useAssignedMinistries = (userId) => {
  return useQuery({
    queryKey: ["assigned-ministries", userId],
    queryFn: () => getAssignedMinistries(userId),
    enabled: !!userId,
  });
};

const MinistryCollapsible = () => {
  const [openMinistryId, setOpenMinistryId] = useState(null);
  const { userData } = useUser();
  const userId = userData?.id;

  // Fetch ministry
  const { data: assignedMinistries, isLoading } = useAssignedMinistries(userId);

  // Fetch groups
  const { groups } = useGroups({
    ministryId: openMinistryId,
  });

  console.log(groups?.data);

  if (isLoading) return <Loader2 />;

  return (
    <>
      {isLoading ? (
        <Loader2 />
      ) : (
        assignedMinistries?.map((ministry) => (
          <div key={ministry?.id} className="w-96 px-5 py-2">
            <Collapsible
              open={openMinistryId === ministry?.id}
              onOpenChange={() => {
                setOpenMinistryId(
                  openMinistryId === ministry.id ? null : ministry.id
                );
              }}
              className="rounded-xl border border-primary-outline p-2 hover:bg-primary"
            >
              <div className="flex items-center justify-between px-4">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {openMinistryId === ministry?.id ? (
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
                        <Label className="font-bold">
                          {ministry.ministry_name}
                        </Label>
                        {/* <p className="text-xs">{`${assignedMinistries.length} groups`}</p> */}
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <ConfigureGroup
                  ministryId={ministry.id}
                  ministryName={ministry.ministry_name}
                  ministryDescription={ministry.ministry_description}
                />
              </div>
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
                <div className="mt-1 pl-16 pr-10">
                  <ul className="border-l-2 border-primary-outline pl-7">
                    {/* <SheetGroups /> Mobile View */}
                    {groups?.data?.length < 1 ? (
                      <p>No Group </p>
                    ) : (
                      groups?.data?.map((group) => (
                        <p key={group.id}>{group.name}</p>
                      ))
                    )}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))
      )}
    </>
  );
};

export default MinistryCollapsible;
