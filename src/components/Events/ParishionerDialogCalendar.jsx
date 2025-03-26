import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Calendar from "../Calendar";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

const ParishionerDialogCalendar = ({ events }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <div className="flex items-center gap-x-2">
            <Icon icon="mingcute:calendar-2-line" width={24} />
            <p>Calendar</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="no-scrollbar max-h-dvh max-w-7xl overflow-y-scroll pt-16">
        <Calendar events={events} />
      </DialogContent>
    </Dialog>
  );
};

ParishionerDialogCalendar.propTypes = {
  events: PropTypes.array,
};
export default ParishionerDialogCalendar;
