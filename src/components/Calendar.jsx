import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import PropTypes from "prop-types";
import { useUser } from "@/context/useUser";
import { useQuery } from "@tanstack/react-query";
import { fetchMeetingByCreatorId } from "@/services/meetingService";
import EventInfoDialog from "./Schedule/EventInfoDialog";
import { Button } from "./ui/button";
import { useState } from "react";
import useRoleSwitcher from "@/hooks/useRoleSwitcher";
import { getAllEvents } from "@/services/eventService";
import { Loader2 } from "lucide-react";

// Fetch all Events
const useCalendarEvents = (userId) => {
  return useQuery({
    queryKey: ["calendarevents", userId],
    queryFn: () => getAllEvents(userId),
    enabled: !!userId,
  });
};

// Fetch meeting
const useFetchMeetings = (userId) => {
  return useQuery({
    queryKey: ["meetings", userId],
    queryFn: () => fetchMeetingByCreatorId(userId),
    enabled: !!userId,
  });
};

const Calendar = ({ events }) => {
  const [selectedShowCalendar, setSelectedShowCalendar] = useState("Events");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { userData } = useUser();

  const temporaryRole = useRoleSwitcher();
  const { data: calendarEvents = [], isLoading: calendarEventsLoading } =
    useCalendarEvents(userData?.id);

  const { data: meetings = [], isLoading: meetingsLoading } = useFetchMeetings(
    userData?.id
  );

  // Make sure getEvents is available and is an array
  const eventArray = Array.isArray(calendarEvents?.data)
    ? calendarEvents.data
    : [];
  const safeMeetings = Array.isArray(meetings) ? meetings : [];

  const eventData = events
    ? events.map((item) => ({
        title: item.event_name,
        start: `${item.event_date}T${item.event_time}`,
        description: item.event_description,
        id: item.id,
      }))
    : eventArray.map((item) => ({
        title: item.event_name,
        start: `${item.event_date}T${item.event_time}`,
        description: item.event_description,
        id: item.id,
      }));

  const meetingData = safeMeetings.map((meeting) => ({
    title: meeting.meeting_name,
    start: `${meeting.meeting_date}T${meeting.start_time}`,
    description: meeting.meeting_description,
    id: meeting.id,
  }));

  // Event click handler
  const handleEventClick = (info) => {
    const { title, startStr: start, id, extendedProps } = info.event;
    setSelectedEvent({
      title,
      start,
      description: extendedProps.description,
      id,
    });
    setDialogOpen(true);
  };

  return (
    <div className="h-full w-full">
      {calendarEventsLoading || meetingsLoading ? (
        <div className="grid h-full place-content-center">
          <Loader2 />
        </div>
      ) : (
        <>
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
            eventClick={handleEventClick}
            eventContent={(arg) => (
              <div className="truncate text-sm">{arg.event.title}</div>
            )}
            displayEventTime={false}
          />
          <EventInfoDialog
            open={dialogOpen}
            event={selectedEvent}
            onClose={() => setDialogOpen(false)}
            temporaryRole={temporaryRole?.temporaryRole}
          />
        </>
      )}
    </div>
  );
};

Calendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      event_name: PropTypes.string.isRequired,
      event_date: PropTypes.string.isRequired,
      event_time: PropTypes.string.isRequired,
      event_description: PropTypes.string,
    })
  ),
};

export default Calendar;
