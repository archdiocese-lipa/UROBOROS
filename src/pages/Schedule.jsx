import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useInfiniteQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Title, Description } from "@/components/Title";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CreateEvent from "@/components/Schedule/CreateEvent";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import CreateMeeting from "@/components/Schedule/CreateMeeting";
import { Skeleton } from "@/components/ui/skeleton";
import ScheduleDetails from "@/components/Schedule/ScheduleDetails";

import { getEvents } from "@/services/eventService";
import { getMeetings } from "@/services/meetingService"; // Assuming getMeetings exists

import { useUser } from "@/context/useUser";

import { cn } from "@/lib/utils";
import { Search, EventIcon } from "@/assets/icons/icons";
import { ROLES } from "@/constants/roles";

import MeetingDetails from "@/components/Schedule/MeetingDetails";
import useInterObserver from "@/hooks/useInterObserver";

const Schedule = () => {
  const [filter, setFilter] = useState("events");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpenIndex, setEditDialogOpenIndex] = useState(null);
  const [urlPrms, setUrlPrms] = useSearchParams();
  const { userData } = useUser();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        query: z.string(),
      })
    ),
    defaultValues: {
      query: "",
    },
  });

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["schedules", filter, urlPrms.get("query")?.toString() || ""],
    queryFn: async ({ pageParam }) => {
      let response;
      if (filter === "events") {
        response = await getEvents({
          page: pageParam,
          query: urlPrms.get("query")?.toString() || "",
          pageSize: 10,
          user: userData,
        });
      } else if (filter === "meetings") {
        response = await getMeetings({
          page: pageParam,
          query: urlPrms.get("query")?.toString() || "",
          pageSize: 10,
          user: userData,
        });
      }
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.nextPage ? lastPage.currentPage + 1 : undefined,
    enabled: !!userData,
  });

  const { ref } = useInterObserver(fetchNextPage);

  const onQuery = (data) => {
    const newUrlPrms = new URLSearchParams(urlPrms);
    if (!data?.query) {
      newUrlPrms.delete("query");
    } else {
      newUrlPrms.set("query", data.query);
    }
    setUrlPrms(newUrlPrms);
  };

  const onEventClick = (eventId) => {
    const newUrlPrms = new URLSearchParams(urlPrms);
    newUrlPrms.set("event", eventId);
    newUrlPrms.delete("meeting");
    setUrlPrms(newUrlPrms);
  };

  const onMeetingClick = (meetingId) => {
    const newUrlPrms = new URLSearchParams(urlPrms);
    newUrlPrms.set("meeting", meetingId);
    newUrlPrms.delete("event");
    setUrlPrms(newUrlPrms);
  };

  const onFilterChange = (value) => {
    setFilter(value);
  };

  return (
    <div className="flex h-full w-full gap-8">
      <div className="no-scrollbar flex w-fit flex-col gap-8 overflow-y-auto lg:min-w-[400px]">
        <div>
          <Title>
            {userData?.role === ROLES[1] ? "Assigned Events" : "Scheduler"}
          </Title>
          <Description>
            {userData?.role === ROLES[1]
              ? "View events assigned to you."
              : "Manage schedules for your organisation."}
          </Description>
        </div>
        <div className="flex flex-col gap-3">
          {userData?.role === ROLES[0] && (
            <div className="flex gap-1">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="primary" className="px-3.5 py-2">
                    <EventIcon className="text-primary" />
                    <p>Create Event</p>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Event</DialogTitle>
                    <DialogDescription>Schedule an upcoming event.</DialogDescription>
                  </DialogHeader>
                  <CreateEvent />
                  <DialogFooter>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button form="create-event">Create</Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <CreateMeeting />
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onQuery)}>
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 transform text-2xl text-accent" />
                        <Input
                          className="border-none pl-12"
                          placeholder="Search schedules"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <div>
            <p className="mb-3 font-montserrat font-semibold text-accent">Filters</p>
            <ToggleGroup
              type="single"
              className="flex flex-wrap justify-start gap-2 font-montserrat"
              onValueChange={onFilterChange}
              value={filter}
            >
              <ToggleGroupItem value="events" variant="outline">Events</ToggleGroupItem>
              <ToggleGroupItem value="meetings" variant="outline">Meetings</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div>
            <p className="mb-3 font-montserrat font-semibold text-accent">Schedules</p>
            <div className="flex flex-col gap-2 font-montserrat">
              {isLoading ? (
                <Skeleton className="flex h-[85px] w-full rounded-xl bg-primary" />
              ) : (
                data?.pages.flatMap((page, i) =>
                  page.items.map((event, j) => (
                    <div key={`${i}-${j}`} className="relative">
                      <div
                        className={cn(
                          "flex cursor-pointer gap-3 rounded-[10px] bg-primary/50 px-5 py-4",
                          event.id === urlPrms.get("event") && "border border-primary-outline"
                        )}
                        onClick={() => onEventClick(event.id)}
                      >
                        <EventIcon className="text-2xl text-accent" />
                        <div>
                          <p className="mb-[6px] text-base font-bold leading-none text-accent">
                            {event.event_name}
                          </p>
                          <p className="text-sm text-primary-text">{event.description}</p>
                          <p className="text-sm leading-tight text-primary-text">
                            {event.event_category} - {event.event_visibility}
                          </p>
                          <p className="text-sm leading-none text-primary-text">
                            <span className="font-semibold">Date: </span>
                            {new Date(`${event.event_date}T${event.event_time}`).toDateTime()}
                          </p>
                        </div>
                      </div>
                      <Dialog
                        open={editDialogOpenIndex === `${i}-${j}`}
                        onOpenChange={(isOpen) =>
                          setEditDialogOpenIndex(isOpen ? `${i}-${j}` : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="absolute right-1 top-1 font-semibold text-accent">Edit</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create Event</DialogTitle>
                            <DialogDescription>Schedule an upcoming event.</DialogDescription>
                          </DialogHeader>
                          <CreateEvent
                            data={event}
                            onClose={() => setEditDialogOpenIndex(null)}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))
                )
              )}
            </div>
            <div ref={ref}>
              {hasNextPage && <Skeleton />}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        {urlPrms.get("event") && <ScheduleDetails />}
        {urlPrms.get("meeting") && <MeetingDetails />}
      </div>
    </div>
  );
};

export default Schedule;
