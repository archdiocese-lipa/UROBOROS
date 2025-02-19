import PropTypes from "prop-types";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ThreeDotsIcon, CloseIcon } from "@/assets/icons/icons";
import { Button } from "../ui/button";

const ConfigureMinistry = ({ ministryTitle, ministryDescription }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <ThreeDotsIcon />
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl px-0 text-primary-text">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="font-bold">
              {ministryTitle}
            </AlertDialogTitle>
            <AlertDialogCancel className="rounded-full border-none bg-primary hover:bg-primary">
              <CloseIcon className="text-primary-text" />
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription className="font-medium">
            {ministryDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="border-t-[1px] p-6">
          <div className="flex">
            <Button variant="destructive" className="grow rounded-xl">
              Delete
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
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
