import EventCard from "@/components/Events/EventCard";
import QrScannerEvents from "@/components/Events/QRScannerEvents";
import { Description, Title } from "@/components/Title";
import { Button } from "@/components/ui/button";
import { getParishionerEvents } from "@/services/eventService";

import { useInfiniteQuery } from "@tanstack/react-query";

const Events = () => {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["schedules"],
    queryFn: async ({ pageParam }) => {
      // Fetch filtered events
      const response = await getParishionerEvents({
        page: pageParam,
        pageSize: 8,
      });

      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.nextPage) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });

  const eventData = data?.pages.flatMap((page) =>
    page.items.map((event) => ({
      eventId: event.id,
      eventName: event.event_name,
      eventDescription: event.description,
      eventDate: event.event_date,
      eventTime: event.event_time,
    }))
  );

  return (
    <>
      <Title>Events</Title>
      <Description>Latest upcoming events at the church</Description>
      <div className="mt-5 flex justify-center gap-x-2 md:justify-start">
        <Button>Calendar</Button>
        <QrScannerEvents eventData={eventData} />
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          <p>Loading events...</p>
        ) : (
          data?.pages.flatMap((page) =>
            page.items.map((event, i) => (
              <EventCard
                key={i}
                eventId={event.id}
                eventName={event.event_name}
                eventDescription={event.description}
                eventDate={event.event_date}
                eventTime={event.event_time}
              />
            ))
          )
        )}
      </div>
      {hasNextPage && (
        <div className="mt-2 text-center md:text-end">
          <Button variant="outline" onClick={() => fetchNextPage()}>
            See more events
          </Button>
        </div>
      )}
    </>
  );
};

export default Events;
