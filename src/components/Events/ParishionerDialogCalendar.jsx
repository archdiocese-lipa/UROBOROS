import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Calendar from "../Calendar";

const ParishionerDialogCalendar = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Calendar</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl pt-16">
        <DialogHeader className="sr-only">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <Calendar />
      </DialogContent>
    </Dialog>
  );
};

export default ParishionerDialogCalendar;
