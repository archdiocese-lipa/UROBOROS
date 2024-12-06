import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getEventsCalendar } from "@/services/eventService";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useUser } from "@/context/useUser";
import { fetchUserMinistries } from "@/services/ministryService";
import { fetchCalendarMeetings } from "@/services/meetingService";

const VolunteerDialogCalendar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventVisibility, setEventVisibility] = useState("public");
  const [eventType, setEventType] = useState("event"); // Default to "event"
  const [selectedEvent, setSelectedEvent] = useState(null); // Track selected event
  const [isEventModalOpen, setIsEventModalOpen] = useState(false); // Separate state for event modal

  const { userData } = useUser();

  const { data: meetingResponse } = useQuery({
    queryKey: ["meetings", userData.id],
    queryFn: () => fetchCalendarMeetings(userData.id),
    enabled: !!userData.id,
  });

  // Destructure the data from the response
  const myMeetings = meetingResponse?.data;

  const { data: myMinistries } = useQuery({
    queryKey: ["ministries", userData.id],
    queryFn: () => fetchUserMinistries(userData.id),
    enabled: !!userData.id,
  });

  const ministryIds = myMinistries?.map((ministry) => ministry.id) || [];

  const { data: events } = useQuery({
    queryKey: ["events", ministryIds],
    queryFn: () => getEventsCalendar(ministryIds), // Get all events, private and public
    keepPreviousData: true,
  });

  const formattedEvents =
    events?.data && Array.isArray(events.data)
      ? [
          // Map Events to calendar events
          ...events.data
            .filter((event) =>
              // Filter by event visibility
              eventVisibility === "all"
                ? true
                : event.event_visibility === eventVisibility
            )
            .filter((event) =>
              // If "Events" is selected, show all events, else filter by event type
              eventType === "all" || eventType === "event"
                ? true
                : event.event_type === eventType
            )
            .map((event) => {
              const startDateTime = `${event.event_date}T${event.event_time}`;
              const endDateTime = `${event.event_date}T${event.event_time}`;

              return {
                title: event.event_name,
                start: startDateTime,
                end: endDateTime,
                backgroundColor:
                  event.event_visibility === "private" ? "#FF5733" : "#33FF57",
                borderColor:
                  event.event_visibility === "private" ? "#FF5733" : "#33FF57",
                textColor: "#FFFFFF",
                extendedProps: { ...event },
              };
            }),

          // Map Meetings to calendar events (only if "meeting" type is selected)
          ...(eventType === "meeting" || eventType === "all"
            ? (myMeetings || []).map((meeting) => {
                const startDateTime = `${meeting.meeting_date}T${meeting.start_time}`;
                const endDateTime = `${meeting.meeting_date}T${meeting.end_time}`;

                return {
                  title: meeting.meeting_name,
                  start: startDateTime,
                  end: endDateTime,
                  backgroundColor: "#FF5733", // Customize for meetings
                  borderColor: "#FF5733",
                  textColor: "#FFFFFF",
                  extendedProps: { ...meeting },
                };
              })
            : []), // Empty array when "meeting" type is not selected
        ]
      : [];

  // Handle event click
  const handleEventClick = (info) => {
    setSelectedEvent(info.event); // Set selected event data
    setIsEventModalOpen(true); // Open the event details modal
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpen(true)}>Calendar</Button>
        </DialogTrigger>
        <DialogContent className="max-w-7xl pt-16">
          <DialogHeader className="sr-only">
            <DialogTitle>Volunteer Calendar</DialogTitle>
            <DialogDescription>
              View the event schedule for your selected time.
            </DialogDescription>
          </DialogHeader>

          {/* Event Type Filter (Above Public/Private) */}
          <div className="mb-4 flex space-x-2">
            {/* Event Type Filter */}
            <Button
              variant={eventType === "event" ? "primary" : "secondary"}
              onClick={() => setEventType("event")}
            >
              Events
            </Button>
            <Button
              variant={eventType === "meeting" ? "primary" : "secondary"}
              onClick={() => setEventType("meeting")}
            >
              Meetings
            </Button>
          </div>

          {/* Event Visibility Filters */}

          <div className="mb-4 flex space-x-2">
            {/* All Events Button */}
            <Button
              variant={eventVisibility === "all" ? "primary" : "secondary"}
              onClick={() => setEventVisibility("all")}
            >
              All Events
            </Button>

            {/* Public Events Button */}
            <Button
              variant={eventVisibility === "public" ? "primary" : "secondary"}
              onClick={() => setEventVisibility("public")}
            >
              Public Events
            </Button>
            {/* Private Events Button */}
            <Button
              variant={eventVisibility === "private" ? "primary" : "secondary"}
              onClick={() => setEventVisibility("private")}
            >
              Private Events
            </Button>
          </div>

          {/* FullCalendar */}
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            events={formattedEvents || []}
            height="100%"
            contentHeight="auto"
            eventClick={handleEventClick} // Handle event click
          />
        </DialogContent>
      </Dialog>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Dialog
          open={isEventModalOpen}
          onOpenChange={(open) => setIsEventModalOpen(open)}
        >
          <DialogContent className="max-w-xl pt-16">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <DialogDescription>
                <p>Date: {selectedEvent.start.toLocaleDateString()}</p>
                <p>Time: {selectedEvent.start.toLocaleTimeString()}</p>
                <p>
                  Description: {selectedEvent.extendedProps.event_description}
                </p>
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => setIsEventModalOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default VolunteerDialogCalendar;
