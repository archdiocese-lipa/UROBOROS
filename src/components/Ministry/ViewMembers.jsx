import PropTypes from "prop-types";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import AssignMembers from "./AssignMembers";
import { NegativeIcon } from "@/assets/icons/icons";
import useRemoveMinistryVolunteer from "@/hooks/useRemoveMinistryVolunteer";
import { useState } from "react";
// Utility function to get initials from a name
const getInitials = (firstName, lastName) => {
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
  return `${firstInitial}${lastInitial}`;
};

const ViewMembers = ({
  ministryId,
  title,
  description,
  createdDate,
  members,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const formatDateToUK = (dateString) => {
    const date = new Date(dateString); // Convert the date string to a Date object
    return new Intl.DateTimeFormat("en-GB").format(date); // Format it to DD/MM/YYYY
  };

  const formattedCreatedDate = formatDateToUK(createdDate);

  const { removeVolunteer, isLoading } = useRemoveMinistryVolunteer();

  const handleRemoveMember = (id) => {
    // Trigger the mutation to remove the volunteer
    removeVolunteer({ ministryId, memberId: id });
    setOpenDialog(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary" className="rounded-2xl">
          View Members
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl p-10">
        <DialogHeader className="text-primary-text">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <span> {formattedCreatedDate}</span>
        </DialogHeader>
        <div>
          <div className="flex justify-between text-xl font-medium text-primary-text">
            <p>Members</p>
            <AssignMembers
              title={title}
              ministryId={ministryId}
              existingMembers={members}
            />
          </div>
          <div className="no-scrollbar mt-2 overflow-scroll">
            <ul className="flex h-64 flex-col gap-y-2 text-primary-text">
              {members?.map((member, index) => {
                // Extract name from the users object
                const firstName = member.users?.first_name || "";
                const lastName = member.users?.last_name || "";
                const memberId = member?.users?.id || null; // Safely access users.id
                const memberName =
                  firstName && lastName
                    ? `${firstName} ${lastName}`
                    : "Unnamed Member";

                // Generate initials
                const initials = getInitials(firstName, lastName);

                return (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-x-2 rounded-lg bg-primary p-4"
                  >
                    <div className="flex items-center gap-x-2">
                      <Avatar className="border-2 border-white">
                        {/* Use AvatarFallback to display initials */}

                        <AvatarFallback>{initials || "?"}</AvatarFallback>
                      </Avatar>
                      <span>{memberName}</span>
                    </div>
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                      <DialogTrigger asChild>
                        <Button variant="transparent">
                          <NegativeIcon className="text-red-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="text-primary-text">
                        <DialogHeader>
                          <DialogTitle>
                            Are you sure you want to remove?
                          </DialogTitle>
                          <DialogDescription>
                            This action will remove the item from the list.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button
                            onClick={() => handleRemoveMember(memberId)} // Use the safely extracted ID
                            disabled={isLoading} // Disable the button while loading
                          >
                            {isLoading ? "Removing..." : "Yes"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ViewMembers.propTypes = {
  ministryId: PropTypes.string.isRequired, // Add this line to validate ministryId
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  createdDate: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      users: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
      }),
      src: PropTypes.string, // Optional image source
      alt: PropTypes.string, // Optional alternative text
    })
  ).isRequired,
};

export default ViewMembers;
