import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Description } from "../Title";

const EventCard = ({ eventName, eventDescription, eventDate, eventTime }) => {
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
        <Button>Attend</Button>
      </CardFooter>
    </Card>
  );
};

// Add PropTypes validation
EventCard.propTypes = {
  eventName: PropTypes.string.isRequired, // Must be a string and required
  eventDescription: PropTypes.string, // Optional string
  eventDate: PropTypes.string.isRequired, // Must be a string in date format
  eventTime: PropTypes.string.isRequired, // Must be a string in time format
};

// Provide default values for optional props
EventCard.defaultProps = {
  eventDescription: "No description available", // Default text for description
};

export default EventCard;
