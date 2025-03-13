import EventCard from "@/components/Events/EventCard";
import QrScannerEvents from "@/components/Events/QRScannerEvents";
import { Description, Title } from "@/components/Title";

import { getEventsCalendar } from "@/services/eventService";

import { useQuery } from "@tanstack/react-query";
import ParishionerDialogCalendar from "@/components/Events/ParishionerDialogCalendar";
import { useUser } from "@/context/useUser";
import Loading from "@/components/Loading";
import { fetchUserMinistryIds } from "@/services/ministryService";

const Events = () => {
  const { userData } = useUser();

  const { data: ministryIds } = useQuery({
    queryKey: ["ministries", userData?.id],
    queryFn: () => fetchUserMinistryIds(userData?.id),
    enabled: !!userData?.id,
  });

  console.log(ministryIds);
  // const { data: eventsOwned } = useQuery({
  //   queryKey: ["events", userData?.id],
  //   queryFn: () => getEventsByCreatorId(userData?.id),
  //   enabled: !!userData?.id,
  // });

  // Fetch events based on the ministry's ID
  const { data: parishionerEvents, isLoading } = useQuery({
    queryKey: ["events", ministryIds],
    queryFn: async () => await getEventsCalendar(ministryIds),
    enabled: !!ministryIds,
  });

  console.log(parishionerEvents);

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

  // Filter out events that have already ended
  // const filterEvents = (events) => {
  //   return events.filter((event) => {
  //     const eventDateTime = new Date(`${event.event_date}T${event.event_time}`);
  //     return eventDateTime >= currentDateTime;
  //   });
  // };
  // const filteredParishionerEvents = filterEvents(parishionerEvents?.data || []);
  // const eventsToDisplay =
  //   userData?.role === "admin" ? eventsOwned : parishionerEvents?.data;
  return (
    <>
      <Title>Events</Title>
      <Description>Latest upcoming events at the church</Description>
      <div className="mt-5 flex justify-center gap-x-2 md:justify-start">
        <ParishionerDialogCalendar events={parishionerEvents?.data} />
        <QrScannerEvents eventData={parishionerEvents?.data} />
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          <Loading />
        ) : parishionerEvents?.data?.length === 0 ? (
          <p>No Upcoming Events</p>
        ) : (
          parishionerEvents?.data.map((event, i) => (
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
