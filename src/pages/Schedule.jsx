import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useInfiniteQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
Sheet;

import { Title, Description } from "@/components/Title";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CreateEvent from "@/components/Schedule/CreateEvent";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import CreateMeeting from "@/components/Schedule/CreateMeeting";
import { Skeleton } from "@/components/ui/skeleton";
import ScheduleDetails from "@/components/Schedule/ScheduleDetails";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { getEvents } from "@/services/eventService";
import { getMeetings } from "@/services/meetingService";
import { useUser } from "@/context/useUser";

import { cn } from "@/lib/utils";
import { Search, EventIcon } from "@/assets/icons/icons";
import { ROLES } from "@/constants/roles";

import MeetingDetails from "@/components/Schedule/MeetingDetails";
import useInterObserver from "@/hooks/useInterObserver";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import VolunteerDialogCalendar from "@/components/Schedule/VolunteerDialogCalendar";

const Schedule = () => {
  const [filter, setFilter] = useState("events");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetEditDialogOpenIndex, setSheetEditDialogOpenIndex] =
    useState(false);
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
    queryKey: [
      "schedules",
      filter,
      urlPrms.get("query")?.toString() || "",
      userData,
      selectedYear, // Added selectedYear
      selectedMonth, // Added selectedMonth
    ],
    queryFn: async ({ pageParam }) => {
      let response;
      if (filter === "events") {
        response = await getEvents({
          page: pageParam,
          query: urlPrms.get("query")?.toString() || "",
          pageSize: 10,
          user: userData,
          selectedYear,
          selectedMonth,
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
    enabled: !!userData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.nextPage ? lastPage.currentPage + 1 : undefined,

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
    <div className="flex h-full w-full xl:gap-8">
      <div className="no-scrollbar flex w-full flex-col gap-8 overflow-y-auto lg:min-w-[400px] xl:flex-1">
        <div className="flex items-center justify-between">
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
          {userData?.role === ROLES[1] && <VolunteerDialogCalendar />}
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
                    <DialogDescription>
                      Schedule an upcoming event.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateEvent setDialogOpen={setDialogOpen} />
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
            <p className="mb-3 font-montserrat font-semibold text-accent">
              Filters
            </p>
            <ToggleGroup
              type="single"
              className="flex flex-wrap justify-start gap-2 font-montserrat"
              onValueChange={onFilterChange}
              value={filter}
            >
              <ToggleGroupItem value="events" variant="outline">
                Events
              </ToggleGroupItem>
              <ToggleGroupItem value="meetings" variant="outline">
                Meetings
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div>
            <p className="mb-3 font-montserrat font-semibold text-accent">
              Year and Month
            </p>
            <div className="flex gap-2">
              {/* Month Selector */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border-gray-300 ml-1 max-h-48 overflow-y-auto rounded-md border px-6 py-2 font-montserrat text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {new Date(0, month - 1).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>

              {/* Year Selector */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border-gray-300 max-h-48 overflow-y-auto rounded-md border px-6 py-2 font-montserrat text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {[...Array(5).keys()].map((offset) => {
                  const year = new Date().getFullYear() - 2 + offset;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <p className="mb-3 font-montserrat font-semibold text-accent">
              Schedules
            </p>
            <div className="flex flex-col gap-2 font-montserrat">
              {isLoading ? (
                <Skeleton className="flex h-[85px] w-full rounded-xl bg-primary" />
              ) : (
                data?.pages?.flatMap((page, i) =>
                  filter === "events"
                    ? page?.items?.map((event, j) => (
                        <div key={`${i}-${j}`} className="relative">
                          <div
                            className={cn(
                              "hidden cursor-pointer items-start justify-between gap-3 rounded-[10px] bg-primary/50 px-5 py-4 xl:flex",
                              event.id === urlPrms.get("event") &&
                                "border border-primary-outline"
                            )}
                            onClick={() => onEventClick(event.id)}
                          >
                            <div className="flex gap-3">
                              <EventIcon className="text-2xl text-accent" />
                              <div>
                                <p className="mb-[6px] text-base font-bold leading-none text-accent">
                                  {event.event_name}
                                </p>
                                <p className="text-sm text-primary-text">
                                  {event.description}
                                </p>
                                <p className="text-sm leading-tight text-primary-text">
                                  {event.event_category} -{" "}
                                  {event.event_visibility}
                                </p>
                                <p className="text-sm leading-none text-primary-text">
                                  <span className="font-semibold">Date: </span>
                                  {new Date(
                                    `${event.event_date}T${event.event_time}`
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                  ,
                                  {new Date(
                                    `${event.event_date}T${event.event_time}`
                                  ).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            {userData?.role === ROLES[0] && (
                              <Dialog
                                open={editDialogOpenIndex === `${i}-${j}`}
                                onOpenChange={(isOpen) =>
                                  setEditDialogOpenIndex(
                                    isOpen ? `${i}-${j}` : null
                                  )
                                }
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="-mt-3 p-0 font-semibold text-accent hover:underline"
                                  >
                                    Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Events</DialogTitle>
                                    <DialogDescription>
                                      Schedule an upcoming events.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <CreateEvent
                                    id="update-event"
                                    eventData={{ ...event }}
                                    setDialogOpen={(isOpen) => {
                                      setEditDialogOpenIndex(
                                        isOpen ? `${i}-${j}` : null
                                      );
                                    }}
                                    queryKey={[
                                      "schedules",
                                      filter,
                                      urlPrms.get("query")?.toString() || "",
                                    ]}
                                  />
                                  {/* Dialog Footer */}
                                  <DialogFooter>
                                    <div className="flex justify-end gap-2">
                                      <DialogClose asChild>
                                        <Button variant="outline">
                                          Cancel
                                        </Button>
                                      </DialogClose>

                                      <Button type="submit" form="update-event">
                                        Edit
                                      </Button>
                                    </div>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>

                          <div
                            className={cn(
                              "lg flex w-full cursor-pointer items-start gap-3 rounded-[10px] bg-primary/50 px-5 py-4 xl:hidden",
                              event.id === urlPrms.get("event") &&
                                "border border-primary-outline"
                            )}
                            onClick={() => onEventClick(event.id)}
                          >
                            <Sheet>
                              <SheetTrigger asChild>
                                <div className="flex flex-1 gap-3">
                                  <EventIcon className="text-2xl text-accent" />
                                  <div>
                                    <p className="mb-[6px] text-base font-bold leading-none text-accent">
                                      {event.event_name}
                                    </p>
                                    <p className="text-sm text-primary-text">
                                      {event.description}
                                    </p>
                                    <p className="text-sm leading-tight text-primary-text">
                                      {event.event_category} -{" "}
                                      {event.event_visibility}
                                    </p>
                                    <p className="text-sm leading-none text-primary-text">
                                      <span className="font-semibold">
                                        Date:{" "}
                                      </span>
                                      {new Date(
                                        `${event.event_date}T${event.event_time}`
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                      ,
                                      {new Date(
                                        `${event.event_date}T${event.event_time}`
                                      ).toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>
                              </SheetTrigger>
                              <SheetContent className="w-full md:w-full xl:hidden">
                                {urlPrms.get("event") && (
                                  <ScheduleDetails
                                    queryKey={[
                                      "schedules",
                                      filter,
                                      urlPrms.get("query")?.toString() || "",
                                    ]}
                                  />
                                )}
                              </SheetContent>
                            </Sheet>
                            <Dialog
                              open={sheetEditDialogOpenIndex === `${i}-${j}`}
                              onOpenChange={(isOpen) =>
                                setSheetEditDialogOpenIndex(
                                  isOpen ? `${i}-${j}` : null
                                )
                              }
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="-mt-3 p-0 font-semibold text-accent hover:underline"
                                >
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Eventss</DialogTitle>
                                  <DialogDescription>
                                    Schedule an upcoming event.
                                  </DialogDescription>
                                </DialogHeader>
                                <CreateEvent
                                  id="update-event"
                                  eventData={{ ...event }}
                                  setDialogOpen={(isOpen) => {
                                    setSheetEditDialogOpenIndex(
                                      isOpen ? `${i}-${j}` : null
                                    );
                                  }}
                                  queryKey={[
                                    "schedules",
                                    filter,
                                    urlPrms.get("query")?.toString() || "",
                                  ]}
                                />

                                <DialogFooter>
                                  <div className="flex justify-end gap-2">
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>

                                    <Button type="submit" form="update-event">
                                      Edit
                                    </Button>
                                  </div>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))
                    : page?.items.map((meeting, j) => (
                        <div key={`${i}-${j}`} className="relative">
                          <Sheet className="">
                            <SheetTrigger asChild>
                              <div
                                className={cn(
                                  "flex cursor-pointer gap-3 rounded-[10px] bg-primary/50 px-5 py-4",
                                  meeting.id === urlPrms.get("meeting") &&
                                    "border border-primary-outline hover:underline"
                                )}
                                onClick={() => onMeetingClick(meeting.id)}
                              >
                                <EventIcon className="text-2xl text-accent" />
                                <div>
                                  <p className="mb-[6px] text-base font-bold leading-none text-accent">
                                    {meeting.meeting_name}
                                  </p>
                                  <p className="text-sm text-primary-text">
                                    {meeting.details}
                                  </p>
                                  <p className="text-sm leading-none text-primary-text">
                                    <span className="font-semibold">
                                      Date:{" "}
                                    </span>
                                    {new Date(
                                      `${meeting.meeting_date}T${meeting.start_time}`
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                    ,
                                    {new Date(
                                      `${meeting.meeting_date}T${meeting.start_time}`
                                    ).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            </SheetTrigger>
                            <SheetContent className="w-full sm:max-w-full md:w-full lg:hidden">
                              {urlPrms.get("meeting") && <MeetingDetails />}
                            </SheetContent>
                          </Sheet>
                        </div>
                      ))
                )
              )}
            </div>
            <div ref={ref}>{hasNextPage && <Skeleton />}</div>
          </div>
        </div>
      </div>
      <div className="no-scrollbar hidden w-full overflow-y-scroll rounded-2xl outline outline-2 outline-[#e7dad3] xl:block">
        {urlPrms.get("event") && (
          <ScheduleDetails
            queryKey={[
              "schedules",
              filter,
              urlPrms.get("query")?.toString() || "",
            ]}
          />
        )}

        {!urlPrms.get("event") && !urlPrms.get("meeting") && (
          <div className="flex h-full items-center justify-center">
            <p>No event selected.</p>
          </div>
        )}
        {urlPrms.get("meeting") && <MeetingDetails />}
      </div>
    </div>
  );
};

export default Schedule;
