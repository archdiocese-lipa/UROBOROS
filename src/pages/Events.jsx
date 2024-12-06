import EventCard from "@/components/Events/EventCard";
import QrScannerEvents from "@/components/Events/QRScannerEvents";
import { Description, Title } from "@/components/Title";

import {
  getEventsByCreatorId,
  getEventsCalendar,
} from "@/services/eventService";

import {  useQuery } from "@tanstack/react-query";
import ParishionerDialogCalendar from "@/components/Events/ParishionerDialogCalendar";
import { fetchUserMinistries } from "@/services/ministryService";
import { useUser } from "@/context/useUser";

const Events = () => {

  const { userData } = useUser();

  const { data: ministries } = useQuery({
    queryKey: ["ministries", userData?.id], 
    queryFn: () => fetchUserMinistries(userData?.id), 
    enabled: !!userData?.id, 
  });
  const { data: eventsOwned } = useQuery({
    queryKey: ["events", userData?.id], 
    queryFn: () => getEventsByCreatorId(userData?.id), 
    enabled: !!userData?.id, 
  });


  const ids= ministries?.map((ministry) => ministry.id)

  // Fetch events based on the first ministry's ID
  const { data: Parishionerevents, isLoading } = useQuery({
    queryKey: ["events", ministries], // Access the first ministry's id if available
    queryFn: async () => await getEventsCalendar(ids),
    enabled: !!ministries, // Only fetch events if the first ministry id is available
  });

  // const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
  //   queryKey: ["schedules"],
  //   queryFn: async ({ pageParam }) => {
  //     // Fetch filtered events
  //     const response = await getParishionerEvents({
  //       page: pageParam,
  //       pageSize: 8,
  //     });

  //     return response;
  //   },
  //   initialPageParam: 1,
  //   getNextPageParam: (lastPage) => {
  //     if (lastPage.nextPage) {
  //       return lastPage.currentPage + 1;
  //     }
  //     return undefined;
  //   },
  // });

  // const eventData = data?.pages.flatMap((page) =>
  //   page.items.map((event) => ({
  //     eventId: event.id,
  //     eventName: event.event_name,
  //     eventDescription: event.description,
  //     eventDate: event.event_date,
  //     eventTime: event.event_time,
  //   }))
  // );


  const eventsToDisplay = userData?.role ==="admin" ? eventsOwned : Parishionerevents?.data
  return (
    <>
      <Title>Events</Title>
      <Description>Latest upcoming events at the church</Description>
      <div className="mt-5 flex justify-center gap-x-2 md:justify-start">
        <ParishionerDialogCalendar events={eventsToDisplay}/>
        <QrScannerEvents eventData={eventsToDisplay} />
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          <p>Loading events...</p>  
        ) : (
          eventsToDisplay?.map((event, i) => (
            <EventCard
              key={i}
              eventId={event.id}
              eventName={event.event_name}
              eventDescription={event.description}
              eventDate={event.event_date}
              eventTime={event.event_time}
            />
          ))
        )}
      </div>
      {/* {hasNextPage && (
        <div className="mt-2 text-center md:text-end">
          <Button variant="outline" onClick={() => fetchNextPage()}>
            See more events
          </Button>
        </div>
      )} */}
    </>
  );
};

export default Events;
