import PropTypes from "prop-types";
import { ThreeDotsIcon, Users } from "@/assets/icons/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ViewMembers from "./ViewMembers";
import { useState } from "react";
import EditMinistry from "./EditMinistry";
import useMinistry from "@/hooks/useMinistry";

// Utility function to get initials from a name
const getInitials = (firstName, lastName) => {
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
  return `${firstInitial}${lastInitial}`;
};

const MinistryCard = ({
  ministryId,
  title,
  description,
  // coordinators,
  createdDate,
}) => {
  const formatDateToUK = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formattedCreatedDate = formatDateToUK(createdDate);

  // const { members, loading, error } = useMinistryMembers(ministryId);
  const { ministryMembers, membersLoading, deleteMutation, error } =
    useMinistry({ ministryId });
  // const { mutate: deleteMinistry, isLoading: isDeleting } = useDeleteMinistry();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const handleDelete = () => {
    deleteMutation.mutate(ministryId);
    setDeleteDialogOpen(false);
  };

  const handleEdit = () => {
    setEditDialogOpen(true); // Open the Edit Ministry dialog or form
  };

  const maxVisible = 4;
  const visibleAvatars = ministryMembers?.slice(0, maxVisible);
  const remainingCount = Math.max(ministryMembers?.length - maxVisible, 0);

  return (
    <Card className="max-h-96 rounded-2xl border text-primary-text">
      <CardHeader className="text-pretty">
        <div className="flex items-center justify-between">
          <CardTitle className="font-bold">{title}</CardTitle>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="transparent" className="h-5 w-5">
                  <ThreeDotsIcon className="text-black" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEdit}>
                  Edit
                </DropdownMenuItem>{" "}
                {/* Trigger Edit */}
                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(event) => {
                        event.preventDefault(); // Prevent the dropdown from closing
                        setDeleteDialogOpen(true); // Open the delete confirmation dialog
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="rounded-xl p-6 text-primary-text">
                    <DialogHeader>
                      <DialogTitle>Confirm Delete</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this ministry? This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription className="break-words">{description}</CardDescription>
        <p>
          <span className="font-medium">Created: </span>
          {formattedCreatedDate}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-3 rounded-2xl bg-primary px-5 py-3">
          {membersLoading && <p>Loading members...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!membersLoading && !error && ministryMembers?.length === 0 && (
            <p className="text-gray-500">No members</p>
          )}
          <div className="flex items-center gap-x-6">
            <div className="flex flex-wrap items-center justify-center -space-x-4">
              {visibleAvatars?.map((member, index) => {
                const initials = getInitials(
                  member.users?.first_name,
                  member.users?.last_name
                );

                return (
                  <Avatar key={index} className="border-4 border-white">
                    <AvatarFallback>{initials || "?"}</AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
            {remainingCount > 0 && (
              <div className="bg-muted text-muted-foreground -ml-2 flex h-10 w-10 justify-center rounded-full text-sm font-medium">
                <div className="inline-flex h-[19px] items-center justify-center gap-1 rounded-[10px] bg-white px-2 py-0.5">
                  <span className="text-primary-text">+{remainingCount}</span>
                  <Users className="text-primary-text" />
                </div>
              </div>
            )}
          </div>
          <div>
            <ViewMembers
              title={title}
              ministryId={ministryId}
              description={description}
              createdDate={createdDate}
              members={ministryMembers}
            />
          </div>
        </div>
      </CardContent>

      {/* Edit Ministry Modal or Component */}
      {isEditDialogOpen && (
        <EditMinistry
          ministryId={ministryId}
          currentName={title}
          // coordinators={coordinators}
          currentDescription={description}
          isOpen={isEditDialogOpen} // Pass the state here
          closeDialog={() => setEditDialogOpen(false)} // Pass the function to close the dialog
        />
      )}
    </Card>
  );
};

MinistryCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  createdDate: PropTypes.string.isRequired,
  ministryId: PropTypes.string.isRequired,
  // coordinators: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     users: PropTypes.shape({
  //       id: PropTypes.string.isRequired,
  //     }).isRequired,
  //   })
  // ).isRequired,
};

export default MinistryCard;
