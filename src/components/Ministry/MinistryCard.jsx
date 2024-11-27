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
import ViewMembers from "./ViewMembers";
import useMinistryMembers from "@/hooks/useMinistryMembers"; // Import the custom hook

// Utility function to get initials from a name
const getInitials = (firstName, lastName) => {
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
  return `${firstInitial}${lastInitial}`;
};

const MinistryCard = ({ ministryId, title, description, createdDate }) => {
  const formatDateToUK = (dateString) => {
    const date = new Date(dateString); // Convert the date string to a Date object
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Optional: for 12-hour format with AM/PM
    }).format(date);
  };

  const formattedCreatedDate = formatDateToUK(createdDate);

  const { members, loading, error } = useMinistryMembers(ministryId); // Use the custom hook

  const maxVisible = 4;
  const visibleAvatars = members.slice(0, maxVisible);
  const remainingCount = Math.max(members.length - maxVisible, 0);

  return (
    <Card className="rounded-2xl border text-primary-text">
      <CardHeader className="relative">
        <CardTitle className="font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <p>
          <span className="font-medium">Created: </span>
          {formattedCreatedDate}
        </p>
        <div className="absolute right-5 top-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="transparent" className="h-5 w-5">
                <ThreeDotsIcon className="text-black" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-3 rounded-2xl bg-primary px-5 py-3">
          {loading && <p>Loading members...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex items-center gap-x-6">
            <div className="flex flex-wrap items-center justify-center -space-x-4">
              {visibleAvatars.map((member, index) => {
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
              members={members}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

MinistryCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  createdDate: PropTypes.string.isRequired,
  ministryId: PropTypes.string.isRequired,
};

export default MinistryCard;
