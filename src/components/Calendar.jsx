import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useGetEvents } from "@/hooks/useGetAllEvents";
import PropTypes from "prop-types";

const Calendar = ({events}) => {
  const { data: getEvents } = useGetEvents();

  console.log("eventsdata2", events)

  // Make sure getEvents is available and is an array
  const eventArray = Array.isArray(getEvents?.data) ? getEvents.data : [];

  // Map the event data to the format FullCalendar expects
  let eventData = []
  if(events){
     eventData = events?.map((item) => ({
      title: item.event_name,
      start: `${item.event_date}T${item.event_time}`, // Combine event date and time for the start
      description: item.event_description, // If there's any description
      id: item.id, // Use the event id if needed
    }));
  }else{
    eventData = eventArray.map((item) => ({
      title: item.event_name,
      start: `${item.event_date}T${item.event_time}`, // Combine event date and time for the start
      description: item.event_description, // If there's any description
      id: item.id, // Use the event id if needed
    }));
  }


  return (
    <div className=" h-full w-full">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={ eventData}
        height="100%"
        contentHeight="auto"
      />
    </div>
  );
};
Calendar.propTypes = {
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
export default Calendar;
