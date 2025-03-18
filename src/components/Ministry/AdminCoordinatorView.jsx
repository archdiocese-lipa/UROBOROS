import { useState, useEffect } from "react";
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
  const [groupId, setGroupId] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Fetch groups
  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ["group-list", ministryId],
    queryFn: () => getOneMinistryGroup(ministryId),
    enabled: !!ministryId,
  });

  const handleClickGroup = (name, id) => {
    setActiveItem(name);
    setGroupId(id);
  };

  //Update active item when groups data is available
  useEffect(() => {
    if (groups && groups.length > 0) {
      setGroupId(groups[0].id);
      setActiveItem(groups[0]?.name);
    }
  }, [groups]);

  if (isLoadingGroups) return <Loader2 />;

  return (
    <SidebarProvider>
      <Sidebar
        collapsible={isMobile ? "offcanvas" : "none"}
        className="h-[650px] rounded-2xl"
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

      <main className="flex-1">
        <div className="mb-6 flex items-center justify-start px-6">
          <SidebarTrigger className="mr-4 md:hidden" />
          <h2 className="text-xl font-semibold text-primary-text">
            {activeItem}
          </h2>
        </div>
        <div>
          <GroupAnnouncements ministryId={ministryId} groupId={groupId} />
        </div>
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
