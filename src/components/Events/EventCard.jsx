import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Description } from "../Title";
import ManualAttendEvents from "./ManualAttendEvents";
// import { AddToCalendarButton } from "add-to-calendar-button-react";

const EventCard = ({
  eventId,
  eventName,
  eventDescription,
  eventDate = "No description available",
  eventTime,
}) => {
  // Calculate end time (1 hour after start time)
  // const calculateEndTime = (startTime) => {
  //   const [hours, minutes] = startTime.split(":");
  //   const date = new Date();
  //   date.setHours(parseInt(hours));
  //   date.setMinutes(parseInt(minutes));
  //   date.setHours(date.getHours() + 1); // Add 1 hour
  //   return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  // };

  // const endTime = calculateEndTime(eventTime);

  return (
    <Card className="border-primary text-primary-text">
      <CardHeader>
        <CardTitle>{eventName}</CardTitle>
      </CardHeader>
      <CardContent>
        <Description>{eventDescription}</Description>
        <Description>
          {new Date(`${eventDate}T${eventTime}`).toDateTime()}
        </Description>
      </CardContent>
      <CardFooter>
        <div>
          <ManualAttendEvents
            eventId={eventId}
            eventName={eventName}
            eventTime={eventTime}
            eventDate={eventDate}
          />
          {/* <AddToCalendarButton
            name={eventName}
            startDate={eventDate}
            startTime={eventTime}
            endTime={endTime}
            options={["Google", "Apple", "Yahoo"]}
            timeZone="UTC"
            trigger="click"
            buttonStyle="3d"
          >
            Add to calendar
          </AddToCalendarButton> */}
        </div>
      </CardFooter>
    </Card>
  );
};

// Add PropTypes validation
EventCard.propTypes = {
  eventId: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired, // Must be a string and required
  eventDescription: PropTypes.string, // Optional string
  eventDate: PropTypes.string.isRequired, // Must be a string in date format
  eventTime: PropTypes.string.isRequired, // Must be a string in time format
};

export default EventCard;
