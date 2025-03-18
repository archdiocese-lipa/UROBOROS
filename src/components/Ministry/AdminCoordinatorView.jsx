import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import useMediaQuery from "@/hooks/use-media-query";

import { getOneMinistryGroup } from "@/services/ministryService";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import GroupAnnouncements from "./GroupAnnouncements";

const AdminCoordinatorView = ({ ministryId, ministryTitle, ministryImage }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Fetch groups
  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ["group-list", ministryId],
    queryFn: () => getOneMinistryGroup(ministryId),
    enabled: !!ministryId,
  });

  const handleClickGroup = useCallback((name, id) => {
    setActiveItem(name);
    setGroupId(id);
  }, []);

  //Update active item when groups data is available
  useEffect(() => {
    if (groups && groups.length > 0) {
      const firstGroupId = groups[0]?.id;
      setGroupId(firstGroupId);
      setActiveItem(groups[0]?.name);
    }
  }, [groups]);

  if (isLoadingGroups) return <Loader2 />;
  console.log(groupId);
  console.log(ministryId);

  return (
    <SidebarProvider>
      <Sidebar
        collapsible={isMobile ? "offcanvas" : "none"}
        className="rounded-2xl"
      >
        <SidebarHeader className="flex flex-row items-center text-primary-text">
          <span>
            <img
              src={ministryImage}
              alt={`${ministryTitle} Picture`}
              className="w-20"
            />
          </span>
          <div>
            <h2 className="text-xl font-bold">{ministryTitle}</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <p>List of Groups</p>
                {groups.map((group) => (
                  <SidebarMenuItem key={group.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={group.name === activeItem}
                      onClick={() => handleClickGroup(group.name, group.id)}
                    >
                      <button>
                        <span>{group.name}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="no-scrollbar h-[40rem] flex-1 overflow-y-scroll md:h-[40rem]">
        <div className="flex items-center justify-start px-6">
          <SidebarTrigger className="mr-4 md:hidden" />
        </div>
        <GroupAnnouncements ministryId={ministryId} groupId={groupId} />
      </main>
    </SidebarProvider>
  );
};

AdminCoordinatorView.propTypes = {
  ministryId: PropTypes.string.isRequired,
  ministryTitle: PropTypes.string.isRequired,
  ministryImage: PropTypes.string.isRequired,
};

export default AdminCoordinatorView;
