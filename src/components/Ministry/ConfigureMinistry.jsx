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
import useMinistry from "@/hooks/useMinistry";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const ConfigureMinistry = ({
  coordinators,
  ministryId,
  ministryTitle,
  ministryDescription,
}) => {
  const { deleteMutation } = useMinistry({ ministryId });

  const handleDeleteMinistry = () => {
    deleteMutation.mutate(ministryId);
  };
  return (
    <Dialog>
      <DialogTrigger>
        <ThreeDotsIcon />
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-3xl px-0 text-primary-text">
        <DialogHeader className="px-6">
          <DialogTitle className="font-bold">{ministryTitle}</DialogTitle>
          <DialogDescription>{ministryDescription}</DialogDescription>
        </DialogHeader>
        <div className="border-y border-primary/100">
          <div className="flex flex-col gap-y-4 px-6 py-4">
            <div className="flex items-center justify-between">
              <Label>Coordinators</Label>
              <AddCoordinators ministryId={ministryId} />
            </div>
            <div className="no-scrollbar max-h-32 space-y-2 overflow-y-scroll">
              {coordinators?.map((coordinator) => (
                <div
                  key={coordinator.id}
                  className="flex items-center justify-between rounded-2xl bg-primary p-4"
                >
                  <Label className="font-semibold">
                    {coordinator.users.first_name} {coordinator.users.last_name}
                  </Label>
                  <RemoveCoordinator
                    ministryId={ministryId}
                    coordinator_id={coordinator.id}
                  />
                </div>
              ))}
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="grow">
                Delete Ministry
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Ministry</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this minstry? This action
                  cannot be undone.
                </AlertDialogDescription>

                <div className="flex justify-end gap-x-2">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    onClick={handleDeleteMinistry}
                    variant={"destructive"}
                  >
                    Confirm
                  </Button>
                </div>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ConfigureMinistry.propTypes = {
  ministryTitle: PropTypes.string.isRequired,
  ministryDescription: PropTypes.string.isRequired,
  ministryId: PropTypes.string.isRequired,
  coordinators: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      users: PropTypes.shape({
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default ConfigureMinistry;
