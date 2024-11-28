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

const EventCard = ({
  eventId,
  eventName,
  eventDescription,
  eventDate = "No description available",
  eventTime,
}) => {
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
        <Description>Organiser</Description>
      </CardContent>
      <CardFooter>
        <ManualAttendEvents eventId={eventId} eventName={eventName} />
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
