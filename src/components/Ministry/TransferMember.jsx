import { useState } from "react";
import PropTypes from "prop-types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Icon } from "@iconify/react";
import { Label } from "../ui/label";
import { useQuery } from "@tanstack/react-query";
import { transferMembersFetchGroups } from "@/services/groupServices";
import { Loader2 } from "lucide-react";
import useGroups from "@/hooks/useGroups";

const TransferMember = ({
  userId,
  groupId,
  firstName,
  lastName,
  assignedMinistry,
}) => {
  const [selectedGroup, setSelectGroup] = useState({ name: null, id: null });
  const { transferUserToGroupMutation } = useGroups({ groupId });

  const handleGroupSelect = (group) => {
    setSelectGroup({ name: group.name, id: group.id });
  };

  const handleTransfer = () => {
    if (selectedGroup.id) {
      transferUserToGroupMutation.mutate({
        userId,
        currentGroupId: groupId,
        newGroupId: selectedGroup.id,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="hover:text-primary-text">
          <div className="flex items-center gap-x-2">
            <Icon icon="mingcute:transfer-3-line" width={24} />
            <p className="hidden md:block">Transfer</p>
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-x-2">
            <div>
              <Avatar>
                {/* <AvatarImage src={member.avatar_url} /> */}
                <AvatarFallback className="bg-primary-outline/60 text-primary-text">
                  {firstName?.charAt(0)}
                  {lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <AlertDialogTitle>
                Transfer {`${firstName} ${lastName}`}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Move this user to a different ministry group.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogBody>
          <div>
            <Label>Select group to transfer</Label>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {selectedGroup.name ? selectedGroup.name : "Select Group"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Ministries</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {assignedMinistry.map((ministry) => (
                  <MinistrySubMenu
                    key={ministry.id}
                    ministry={ministry}
                    currentGroupId={groupId}
                    onSelectGroup={(group) => handleGroupSelect({ ...group })}
                  />
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={
              !selectedGroup.id || transferUserToGroupMutation.isPending
            }
            onClick={handleTransfer}
          >
            {transferUserToGroupMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transferring...
              </>
            ) : (
              "Transfer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

TransferMember.propTypes = {
  userId: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  assignedMinistry: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      image_url: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      ministry_name: PropTypes.string.isRequired,
      ministry_description: PropTypes.string,
    })
  ),
};

// Ministry submenu
const MinistrySubMenu = ({ ministry, currentGroupId, onSelectGroup }) => {
  // Fetch groups for this specific ministry
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["transferGroups", ministry.id, currentGroupId],
    queryFn: () => transferMembersFetchGroups(ministry.id, currentGroupId),
    enabled: !!ministry.id && !!currentGroupId,
  });

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{ministry.ministry_name}</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {isLoading ? (
            <div className="flex items-center justify-center px-2 py-2">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Loading groups...</span>
            </div>
          ) : groups.length > 0 ? (
            groups.map((group) => (
              <DropdownMenuItem
                key={group.id}
                onClick={() => onSelectGroup(group)}
              >
                {group.name}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>
              No other groups available
            </DropdownMenuItem>
          )}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};

MinistrySubMenu.propTypes = {
  ministry: PropTypes.shape({
    id: PropTypes.string.isRequired,
    ministry_name: PropTypes.string.isRequired,
  }).isRequired,
  currentGroupId: PropTypes.string.isRequired,
  onSelectGroup: PropTypes.func.isRequired,
};

export default TransferMember;
