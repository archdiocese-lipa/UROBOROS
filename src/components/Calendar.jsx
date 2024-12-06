import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useGetEvents } from "@/hooks/useGetAllEvents";
import PropTypes from "prop-types";
import { useUser } from "@/context/useUser";
import { useQuery } from "@tanstack/react-query";
import { fetchMeetingByCreatorId } from "@/services/meetingService";
import { Button } from "./ui/button";
import { useState } from "react";

const Calendar = ({ events }) => {
  const { data: getEvents } = useGetEvents();
  const [selectedShowCalendar, setSelectedShowCalendar] = useState("Events");

  const { userData } = useUser();

  const { data: meetings } = useQuery({
    queryKey: ["meetings", userData?.id],
    queryFn: () => fetchMeetingByCreatorId(userData?.id),
    enabled: !!userData?.id,
  });

  // Make sure getEvents is available and is an array
  const eventArray = Array.isArray(getEvents?.data) ? getEvents.data : [];

  // Map the event data to the format FullCalendar expects
  let eventData = [];
  if (events) {
    eventData = events?.map((item) => ({
      title: item.event_name,
      start: `${item.event_date}T${item.event_time}`,
      description: item.event_description,
      id: item.id,
    }));
  } else {
    eventData = eventArray.map((item) => ({
      title: item.event_name,
      start: `${item.event_date}T${item.event_time}`,
      description: item.event_description,
      id: item.id,
    }));
  }
  const meetingData = meetings?.map((meeting) => ({
    title: meeting.meeting_name,
    start: `${meeting.meeting_date}T${meeting.start_time}`,
    description: meeting.meeting_description,
    id: meeting.id,
  }));
  return (
    <div className="h-full w-full">
      {userData?.role === "admin" && (
        <div className="flex gap-2">
          <Button
            onClick={() => setSelectedShowCalendar("Events")}
            variant={"outline"}
          >
            Events
          </Button>
          <Button
            onClick={() => setSelectedShowCalendar("Meetings")}
            variant={"outline"}
          >
            Meetings
          </Button>
        </div>
      )}
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={selectedShowCalendar === "Events" ? eventData : meetingData}
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
