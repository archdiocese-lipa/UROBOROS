import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { Label } from "../ui/label";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getMinistryGroups } from "@/services/ministryService";
import { useUser } from "@/context/useUser";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import GroupAnnouncements from "./GroupAnnouncements";

const useUserGroups = (userId) => {
  return useQuery({
    queryKey: ["user-groups", userId],
    queryFn: () => getMinistryGroups(userId),
    enabled: !!userId,
  });
};

const UserViewMinistry = () => {
  const [expandedMinistries, setExpandedMinistries] = useState(new Set());
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("announcement");

  const [searchParams, setSearchParams] = useSearchParams();

  const { userData } = useUser();
  const { data: ministries = [], isLoading } = useUserGroups(userData?.id);

  const toggleMinistry = (ministryId) => {
    setExpandedMinistries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ministryId)) {
        newSet.delete(ministryId);
      } else {
        newSet.add(ministryId);
      }
      return newSet;
    });
  };

  const selectGroup = (group) => {
    setSelectedGroup(group.group_id); // Updated to match data
    setSelectedGroupDetails(group);
    setSearchParams({ groupId: group.group_id }); // Updated to match data
  };

  useEffect(() => {
    const groupIdFromUrl = searchParams.get("groupId");
    if (groupIdFromUrl && ministries.length > 0) {
      for (const ministry of ministries) {
        const foundGroup = ministry.groups.find(
          (g) => g.group_id === groupIdFromUrl
        );
        if (foundGroup) {
          setSelectedGroup(foundGroup.group_id);
          setSelectedGroupDetails(foundGroup);
          setExpandedMinistries(
            (prev) => new Set([...prev, ministry.ministry_id])
          );
          break;
        }
      }
    }
  }, [ministries, searchParams]);

  return (
    <div className="flex h-full text-primary-text">
      <aside className="w-full max-w-[25rem] border-r border-primary-outline/50 pr-4">
        <div className="mb-4">
          <div className="px-8 py-4">
            <Label className="text-[20px] font-bold">Your Ministries</Label>
          </div>
        </div>

        <div className="space-y-3 px-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : ministries.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              No ministries assigned yet.
            </div>
          ) : (
            ministries.map((ministry) => (
              <MinistryItem
                key={ministry.id}
                ministry={ministry}
                isExpanded={expandedMinistries.has(ministry.id)}
                onToggle={() => toggleMinistry(ministry.id)}
                selectedGroup={selectedGroup}
                onSelectGroup={selectGroup}
              />
            ))
          )}
        </div>
      </aside>

      <main className="hidden w-full lg:block">
        {selectedGroupDetails ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex h-full w-full flex-col overflow-hidden"
          >
            <div className="flex justify-between border-b border-primary-outline/50 px-8 py-4">
              <div>
                <Label className="text-lg font-bold">
                  {selectedGroupDetails.group_name}
                </Label>
                <p className="text-muted-foreground text-sm">
                  {selectedGroupDetails.description}
                </p>
              </div>
              <TabsList>
                <TabsTrigger value="announcement">Announcement</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              className="no-scrollbar mt-0 h-full w-full overflow-y-auto bg-primary"
              value="announcement"
            >
              <div>
                <GroupAnnouncements />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-muted-foreground grid h-[90vh] place-content-center">
            Select a group
          </div>
        )}
      </main>
    </div>
  );
};

//  MinistryGroups accept pre-fetched groups
const MinistryGroups = ({
  selectedGroup,
  onSelectGroup,
  groups,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center px-4 pb-4">
        <div className="h-4 w-4 animate-spin rounded-full border border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-muted-foreground px-4 pb-4 text-center text-sm">
        No groups created yet.
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      <div className="space-y-1 pl-9">
        {groups.map((group) => (
          <div
            key={group.group_id}
            className={`cursor-pointer rounded-lg px-4 py-2 ${
              selectedGroup === group.group_id
                ? "bg-primary"
                : "hover:bg-primary/5"
            }`}
            onClick={() => onSelectGroup(group)}
          >
            <span
              className={
                selectedGroup === group.group_id
                  ? "font-bold text-primary-text"
                  : ""
              }
            >
              {group.group_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

MinistryGroups.propTypes = {
  selectedGroup: PropTypes.string,
  onSelectGroup: PropTypes.func.isRequired,
  groups: PropTypes.array,
  isLoading: PropTypes.bool,
};

// Component to display ministry with group count
const MinistryItem = ({
  ministry,
  isExpanded,
  onToggle,
  selectedGroup,
  onSelectGroup,
}) => {
  return (
    <div className="overflow-hidden rounded-lg border border-primary-outline">
      <div
        className="flex cursor-pointer items-center p-4 hover:bg-primary/5"
        onClick={onToggle}
      >
        <div className="mr-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-primary-text" />
          ) : (
            <ChevronRight className="h-4 w-4 text-primary-text" />
          )}
        </div>
        <div className="mr-3">
          <Avatar>
            <AvatarFallback>
              {ministry.ministry_name?.substring(0, 2).toUpperCase() || "MN"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{ministry.ministry_name}</h3>
          <p className="text-muted-foreground text-sm">
            {ministry.groups.length} Groups
          </p>
        </div>
      </div>

      {isExpanded && (
        <MinistryGroups
          selectedGroup={selectedGroup}
          onSelectGroup={onSelectGroup}
          groups={ministry.groups}
        />
      )}
    </div>
  );
};

MinistryItem.propTypes = {
  ministry: PropTypes.shape({
    ministry_id: PropTypes.string.isRequired,
    ministry_name: PropTypes.string.isRequired,
    groups: PropTypes.array.isRequired,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  selectedGroup: PropTypes.string,
  onSelectGroup: PropTypes.func.isRequired,
};

export default UserViewMinistry;
