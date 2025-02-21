import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ThreeDotsIcon } from "@/assets/icons/icons";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import AddCoordinators from "./AddCoordinators";
import RemoveCoordinator from "./RemoveCoordinator";

const ConfigureMinistry = ({ ministryTitle, ministryDescription }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <ThreeDotsIcon />
      </DialogTrigger>
      <DialogContent className="px-0 text-primary-text">
        <DialogHeader className="px-6">
          <DialogTitle className="font-bold">{ministryTitle}</DialogTitle>
          <DialogDescription>{ministryDescription}</DialogDescription>
        </DialogHeader>
        <div className="border-y border-primary/100">
          <div className="flex flex-col gap-y-4 px-6 py-4">
            <div className="flex items-center justify-between">
              <Label>Coordinators</Label>
              <AddCoordinators />
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-primary p-4">
              <Label className="font-semibold">John Doe</Label>
              <RemoveCoordinator />
            </div>
            <div>
              <Label>Groups</Label>
            </div>
            <div className="rounded-2xl bg-primary/50 p-4 hover:bg-primary">
              <Label className="font-semibold">Group Name</Label>
            </div>
          </div>
        </div>
        <div className="flex rounded-full p-4">
          <Button variant="destructive" className="grow">
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ConfigureMinistry.propTypes = {
  ministryTitle: PropTypes.string.isRequired,
  ministryDescription: PropTypes.string.isRequired,
  //   createdDate: PropTypes.string.isRequired,
  //   ministryId: PropTypes.string.isRequired,
  // coordinators: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     users: PropTypes.shape({
  //       id: PropTypes.string.isRequired,
  //     }).isRequired,
  //   })
  // ).isRequired,
};

export default ConfigureMinistry;
