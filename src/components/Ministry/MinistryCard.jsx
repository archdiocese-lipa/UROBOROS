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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MinistryCard = ({ title, description, createdDate, members }) => {
  const maxVisible = 4; // Set the maximum number of avatars to display
  const visibleAvatars = members.slice(0, maxVisible);
  const remainingCount = Math.max(members.length - maxVisible, 0);

  return (
    <Card className="text-primary-text rounded-2xl border">
      <CardHeader className="relative">
        <CardTitle className="font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <p>
          <span className="font-medium">Created:</span>
          {createdDate}
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
          <div className="flex items-center gap-x-6">
            <div className="flex flex-wrap items-center justify-center -space-x-4">
              {visibleAvatars.map((avatar, index) => (
                <Avatar key={index} className="border-4 border-white">
                  <AvatarImage src={avatar.src} alt={avatar.alt} />
                  <AvatarFallback>{avatar.alt[0]}</AvatarFallback>
                </Avatar>
              ))}
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
          <div className="-space-y-2 text-primary-text">
            <p className="font-bold">Members Preview:</p>
            <p>
              {members
                .slice(0, 2)
                .map((m) => m.alt)
                .join(", ")}
              .
            </p>
          </div>
          <div>
            <Button variant="primary" className="rounded-2xl">
              View Members
            </Button>
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
  members: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MinistryCard;
