import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
Sheet;

import { Title, Description } from "@/components/Title";
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
import { useDebounce } from "@/hooks/useDebounce";
import ScheduleCards from "@/components/Schedule/ScheduleCards";

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

  const [query, setQuery] = useState("");
  const debouncedSearch = useDebounce(query, 300);

  const onQuery = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    // Directly modify the existing urlPrms
    if (debouncedSearch === "") {
      urlPrms.delete("query");
    } else {
      urlPrms.set("query", debouncedSearch);
    }

    // Update the URL search params
    setUrlPrms(urlPrms);
  }, [debouncedSearch, urlPrms]);

  const onEventClick = (eventId) => {
    urlPrms.set("event", eventId);
    urlPrms.delete("meeting");
    setUrlPrms(urlPrms);
  };

  const onMeetingClick = (meetingId) => {
    urlPrms.set("meeting", meetingId);
    urlPrms.delete("event");
    setUrlPrms(urlPrms);
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

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 transform text-2xl text-accent" />
            <Input
              onChange={onQuery}
              className="border-none pl-12"
              placeholder="Search schedules"
              // {...field}
            />
          </div>
          {/* </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form> */}
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
                className="border-gray-300 max-h-48 overflow-y-auto rounded-md border font-montserrat text-lg shadow-sm"
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
                className="border-gray-300 max-h-48 overflow-y-auto rounded-md border py-2 font-montserrat text-lg shadow-sm "
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
                        <ScheduleCards
                          editDialogOpenIndex={editDialogOpenIndex}
                          setEditDialogOpenIndex={setEditDialogOpenIndex}
                          key={`${i}-${j}`}
                          urlPrms={urlPrms}
                          event={event}
                          onEventClick={onEventClick}
                          filter={filter}
                          setSheetEditDialogOpenIndex={setSheetEditDialogOpenIndex}
                          sheetEditDialogOpenIndex={sheetEditDialogOpenIndex}
                          i={i}
                          j={j}
                        />
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
