import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { Label } from "../ui/label";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAssignedMinistries } from "@/services/ministryService";
import { useUser } from "@/context/useUser";
import useGroups from "@/hooks/useGroups";
import ConfigureGroup from "./ConfigureGroup";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import GroupAnnouncements from "./GroupAnnouncements";

const useAssignedMinistries = (userId) => {
  return useQuery({
    queryKey: ["assigned-ministries", userId],
    queryFn: () => getAssignedMinistries(userId),
    enabled: !!userId,
  });
};

const CoordinatorViewMinistry = () => {
  const [expandedMinistries, setExpandedMinistries] = useState(new Set());
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("announcement");

  const [searchParams, setSearchParams] = useSearchParams();

  const { userData } = useUser();
  const { data: assignedMinistries = [], isLoading } = useAssignedMinistries(
    userData?.id
  );

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
    setSelectedGroup(group.id);
    setSelectedGroupDetails(group);
    setSearchParams({ groupId: group.id });
  };

  useEffect(() => {
    const groupIdFromUrl = searchParams.get("group");
    if (groupIdFromUrl) {
      const group = assignedMinistries
        .flatMap((ministry) => ministry.groups || [])
        .find((group) => group.id === groupIdFromUrl);

      if (group) {
        setSelectedGroup(group.id);
        setSelectedGroupDetails(group);
      }
    }
  }, [assignedMinistries, searchParams]);

  return (
    <div className="flex h-full text-primary-text">
      <aside className="w-full max-w-[336px] border-r border-primary-outline/50 pr-4">
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
          ) : assignedMinistries.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              No ministries assigned yet.
            </div>
          ) : (
            assignedMinistries.map((ministry) => (
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
                  {selectedGroupDetails.name}
                </Label>
                <p className="text-muted-foreground text-sm">
                  {selectedGroupDetails.description}
                </p>
              </div>
              <TabsList>
                <TabsTrigger value="announcement">Announcement</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              className="mt-0 flex h-full w-full place-content-center items-center justify-center overflow-y-scroll bg-primary"
              value="announcement"
            >
              <GroupAnnouncements />
            </TabsContent>

            <TabsContent value="members">
              <div className="text-muted-foreground grid h-[70vh] place-content-center">
                Members content will go here
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-muted-foreground grid h-[90vh] place-content-center">
            Select a group from the sidebar
          </div>
        )}
      </main>
    </div>
  );
};

//  MinistryGroups accept pre-fetched groups
const MinistryGroups = ({
  ministryId,
  selectedGroup,
  onSelectGroup,
  groups,
  isLoading,
}) => {
  // If groups aren't passed, fetch them
  const groupsQuery = useGroups({ ministryId });
  const groupsData = groups || groupsQuery.groups?.data || [];
  const loading = isLoading || groupsQuery.isLoading;

  if (loading) {
    return (
      <div className="flex justify-center px-4 pb-4">
        <div className="h-4 w-4 animate-spin rounded-full border border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (groupsData.length === 0) {
    return (
      <div className="text-muted-foreground px-4 pb-4 text-center text-sm">
        No groups created yet.
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      <div className="space-y-1 pl-9">
        {groupsData.map((group) => (
          <div
            key={group.id}
            className={`cursor-pointer rounded-lg px-4 py-2 ${
              selectedGroup === group.id ? "bg-primary" : "hover:bg-primary/5"
            }`}
            onClick={() => onSelectGroup(group)}
          >
            <span
              className={
                selectedGroup === group.id ? "font-bold text-primary-text" : ""
              }
            >
              {group.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

MinistryGroups.propTypes = {
  ministryId: PropTypes.string.isRequired,
  selectedGroup: PropTypes.string,
  onSelectGroup: PropTypes.func.isRequired,
  groups: PropTypes.array,
  isLoading: PropTypes.bool,
};

MinistryGroups.defaultProps = {
  groups: [],
  isLoading: false,
  selectedGroup: null,
};

// Component to display ministry with group count
const MinistryItem = ({
  ministry,
  isExpanded,
  onToggle,
  selectedGroup,
  onSelectGroup,
}) => {
  // Fetch groups
  const {
    groups: { data: groups = [] },
    isLoading: isLoadingGroups,
  } = useGroups({
    ministryId: ministry.id,
  });

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
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              {ministry.ministry_name?.substring(0, 2).toUpperCase() || "MN"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{ministry.ministry_name}</h3>
          <p className="text-muted-foreground text-sm">
            {isLoadingGroups ? (
              <Loader2 className="inline h-3 w-3 animate-spin" />
            ) : (
              `${groups.length} Groups`
            )}
          </p>
        </div>
        <div>
          <ConfigureGroup
            ministryId={ministry.id}
            ministryName={ministry.ministry_name}
            ministryDescription={ministry.ministry_description}
          />
        </div>
      </div>

      {isExpanded && (
        <MinistryGroups
          ministryId={ministry.id}
          selectedGroup={selectedGroup}
          onSelectGroup={onSelectGroup}
          groups={groups}
          isLoading={isLoadingGroups}
        />
      )}
    </div>
  );
};

MinistryItem.propTypes = {
  ministry: PropTypes.shape({
    id: PropTypes.string.isRequired,
    ministry_name: PropTypes.string.isRequired,
    ministry_description: PropTypes.string,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  selectedGroup: PropTypes.string,
  onSelectGroup: PropTypes.func.isRequired,
};

export default CoordinatorViewMinistry;
