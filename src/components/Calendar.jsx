import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useGetEvents } from "@/hooks/useGetAllEvents";

const Calendar = () => {
  const { data: getEvents } = useGetEvents();

  // Make sure getEvents is available and is an array
  const eventArray = Array.isArray(getEvents?.data) ? getEvents.data : [];

  // Map the event data to the format FullCalendar expects
  const eventData = eventArray.map((item) => ({
    title: item.event_name,
    start: `${item.event_date}T${item.event_time}`, // Combine event date and time for the start
    description: item.event_description, // If there's any description
    id: item.id, // Use the event id if needed
  }));

  return (
    <div className="">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={eventData}
        height="100%"
        contentHeight="auto"
      />
    </div>
  );
};
export default Calendar;
