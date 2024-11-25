import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import AssignMembers from "./AssignMembers";

const ViewMembers = ({ title, description, createdDate, members }) => {
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
          <span>{createdDate}</span>
        </DialogHeader>
        <div>
          <div className="flex justify-between text-xl font-medium text-primary-text">
            <p>Members</p>
            <AssignMembers title={title} />
          </div>
          <div className="no-scrollbar mt-2 overflow-scroll">
            <ul className="flex h-64 flex-col gap-y-2 text-primary-text">
              {members.map((member, index) => (
                <li
                  key={index}
                  className="flex items-center gap-x-2 rounded-lg bg-primary p-4"
                >
                  <Avatar className="border-2 border-white">
                    <AvatarImage
                      src={member.src || "https://github.com/shadcn.png"}
                      alt={member.alt || member.name || "Anonymous"}
                    />
                    <AvatarFallback>
                      {member.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.name || "Unnamed Member"}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ViewMembers.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  createdDate: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      src: PropTypes.string, // Optional image source
      alt: PropTypes.string, // Optional alternative text
    })
  ).isRequired,
};

export default ViewMembers;
