import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Calendar from "../Calendar";
import PropTypes from "prop-types";


const ParishionerDialogCalendar = ({events}) => {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Calendar</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-dvh pt-16 overflow-y-scroll no-scrollbar">
        <Calendar events={events} />
      </DialogContent>
    </Dialog>
  );
};

ParishionerDialogCalendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      event_name: PropTypes.string.isRequired,
      event_date: PropTypes.string.isRequired,
      event_time: PropTypes.string.isRequired,
      event_description: PropTypes.string,
      id: PropTypes.number.isRequired,
    })
  ),
};
export default ParishionerDialogCalendar;
