import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Title } from "../Title";

const AddCoordinators = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-2xl border-none bg-primary/50 hover:bg-primary"
        >
          Add Coordinators
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="text-primary-text">
        <AlertDialogHeader>
          <AlertDialogTitle>Add Coordinators</AlertDialogTitle>
          <Title>Input the new coordinators</Title>
          <AlertDialogDescription>
            Assign coordinators to this ministry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Done</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddCoordinators;
