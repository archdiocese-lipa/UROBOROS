import PropTypes from "prop-types";
import { Users } from "@/assets/icons/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useMinistry from "@/hooks/useMinistry";
import { Label } from "../ui/label";
import ConfigureMinistry from "./ConfigureMinistry";
import { cn } from "@/lib/utils";

// Utility function to get initials from a name
const getInitials = (firstName, lastName) => {
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
  return `${firstInitial}${lastInitial}`;
};

const MinistryCard = ({ ministryId, title, description, createdDate }) => {
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

  const { coordinators, membersLoading, error } = useMinistry({ ministryId });

  const maxVisible = 4;
  const visibleAvatars = coordinators?.data?.slice(0, maxVisible);
  const remainingCount = Math.max(coordinators?.data?.length - maxVisible, 0);

  return (
    <Card className="max-h-96 rounded-2xl border text-primary-text">
      <CardHeader className="text-pretty">
        <div className="flex items-center justify-between">
          <CardTitle className="font-bold">{title}</CardTitle>
          <ConfigureMinistry
            coordinators={coordinators?.data}
            ministryId={ministryId}
            ministryTitle={title}
            ministryDescription={description}
          />
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
          {!membersLoading && !error && coordinators?.data?.length === 0 && (
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
            <Label className="font-semibold">Coordinators Preview:</Label>

            <div className="flex w-full overflow-hidden text-ellipsis">
              {coordinators?.data?.map((coordinator) => (
                <p
                  key={coordinator.id}
                  className={cn(
                    "text-nowrap text-xs"
                    // index === arr.length - 1
                    //   ? "flex-1 overflow-hidden text-ellipsis"
                    //   : "flex-shrink-0"
                  )}
                >
                  {`${coordinator.users.first_name} ${coordinator.users.last_name}`}
                  <span className="mr-1">,</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Edit Ministry Modal or Component */}
      {/* {isEditDialogOpen && (
        <EditMinistry
          ministryId={ministryId}
          currentName={title}
          // coordinators={coordinators}
          currentDescription={description}
          isOpen={isEditDialogOpen}
          closeDialog={() => setEditDialogOpen(false)}
        />
      )} */}
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
