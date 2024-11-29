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

import { getEvents } from "@/services/eventService";
import { getMeetings } from "@/services/meetingService"; // Assuming getMeetings exists

import { cn } from "@/lib/utils";
import { Search, EventIcon } from "@/assets/icons/icons";
import ScheduleDetails from "@/components/Schedule/ScheduleDetails";
import { useUser } from "@/context/useUser";

import { ROLES } from "@/constants/roles";
import MeetingDetails from "@/components/Schedule/MeetingDetails";

const Schedule = () => {
  const [filter, setFilter] = useState("events");
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

  const { data, isLoading } = useInfiniteQuery({
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
    getNextPageParam: (lastPage) => {
      if (lastPage?.nextPage) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });

  const onQuery = (data) => {
    const newUrlPrms = new URLSearchParams(urlPrms);
    // If the query is empty, remove the query from the URLSearchParams
    if (!data?.query) {
      newUrlPrms.delete("query");
    } else {
      newUrlPrms.set("query", data.query);
    }
    setUrlPrms(newUrlPrms);
  };

  const onEventClick = (eventId) => {
    const newUrlPrms = new URLSearchParams(urlPrms);
    newUrlPrms.set("event", eventId); // Ensure it replaces the 'event' parameter, not appends
    newUrlPrms.delete("meeting"); // Ensure 'meeting' parameter is removed if present
    setUrlPrms(newUrlPrms);
  };

  const onMeetingClick = (meetingId) => {
    const newUrlPrms = new URLSearchParams(urlPrms);
    newUrlPrms.set("meeting", meetingId); // Ensure it replaces the 'meeting' parameter, not appends
    newUrlPrms.delete("event"); // Ensure 'event' parameter is removed if present
    setUrlPrms(newUrlPrms);
  };

  const onFilterChange = (value) => {
    setFilter(value);
  };

  return (
    <div className="flex h-full w-full gap-8">
      <div className="no-scrollbar flex w-fit flex-col gap-8 overflow-y-auto overflow-x-visible lg:min-w-[400px]">
        <div>
          <Title>Scheduler</Title>
          <Description>Manage schedules for your organisation.</Description>
        </div>
        <div className="flex flex-col gap-3">
          {userData?.role === ROLES[0] && (
            <div className="flex gap-1">
              <CreateEvent />
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
          {/* MARK: Filter Section */}
          <div>
            <p className="mb-3 font-montserrat font-semibold text-accent">
              Filters
            </p>
            <ToggleGroup
              type="single"
              className="flex flex-wrap justify-start gap-2 font-montserrat"
              onValueChange={(value) => onFilterChange(value)}
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
          {/* MARK: Schedules Section */}
          <div>
            <p className="mb-3 font-montserrat font-semibold text-accent">
              Schedules
            </p>
            <div className="flex flex-col gap-2 font-montserrat">
              {isLoading ? (
                <Skeleton className="flex h-[85px] w-full rounded-xl bg-primary" />
              ) : (
                data?.pages.flatMap((page) =>
                  page?.items.map((schedule, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-[10px] bg-primary/50 px-5 py-4",
                        schedule.id === urlPrms.get("event") ||
                          schedule.id === urlPrms.get("meeting")
                          ? "border border-primary-outline"
                          : ""
                      )}
                      onClick={
                        schedule.event_name
                          ? () => onEventClick(schedule.id) // Handle event click
                          : () => onMeetingClick(schedule.id) // Handle meeting click
                      }
                    >
                      <EventIcon className="text-2xl text-accent" />
                      <div>
                        <p className="mb-[6px] text-base font-bold leading-none text-accent">
                          {schedule.event_name || schedule.meeting_name}
                        </p>
                        <p className="text-sm text-primary-text">
                          {schedule.description || schedule.details}
                        </p>
                        <p className="text-sm leading-tight text-primary-text">
                          {schedule.event_category || schedule.location}
                        </p>
                        {schedule.event_date || schedule.meeting_date ? (
                          <p className="text-sm leading-none text-primary-text">
                            <span className="font-semibold">Date: </span>
                            {new Date(
                              `${schedule.event_date || schedule.meeting_date}T${
                                schedule.event_time || schedule.start_time
                              }`
                            ).toDateTime()}
                          </p>
                        ) : null}
                        {schedule.event_time || schedule.start_time ? (
                          <p className="text-sm leading-none text-primary-text">
                            <span className="font-semibold">Time: </span>
                            {schedule.event_time || schedule.start_time}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      </div>
      {filter === "events" ? <ScheduleDetails /> : <MeetingDetails />}
    </div>
  );
};

export default Schedule;
