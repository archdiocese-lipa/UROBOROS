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
import { Button } from "@/components/ui/button";
import CreateMeeting from "@/components/Schedule/CreateMeeting";
import { Skeleton } from "@/components/ui/skeleton";

import { getEvents } from "@/services/eventService";

import { cn } from "@/lib/utils";
import { Search, EventIcon } from "@/assets/icons/icons";
import ScheduleDetails from "@/components/Schedule/ScheduleDetails";
import { useUser } from "@/context/useUser";

import { ROLES } from "@/constants/roles";

const Schedule = () => {
  const [filter, setFilter] = useState("");
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

  // Might change this to useInfiniteQuery instead of useQuery for pagination.
  const { data, isLoading } = useInfiniteQuery({
    queryKey: ["schedules", filter, urlPrms.get("query")?.toString() || ""],
    queryFn: async ({ pageParam }) => {
      const response = await getEvents({
        page: pageParam,
        query: urlPrms.get("query")?.toString() || "",
        pageSize: 10,
        user: userData,
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
    newUrlPrms.set("event", eventId);
    setUrlPrms(newUrlPrms);
  };

  const onFilterChange = (value) => {
    setFilter(value);
  };

  return (
    <div className="flex h-full w-full gap-8">
      <div className="flex flex-col gap-8 lg:min-w-[400px]">
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
              <Button
                variant="ghost"
                className={cn(
                  "rounded-full font-montserrat font-bold text-secondary-accent hover:text-accent",
                  filter && "text-accent"
                )}
                onClick={() => setFilter("")}
              >
                Clear
              </Button>
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
                  page.items.map((event, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-[10px] bg-primary/50 px-5 py-4",
                        event.id === urlPrms.get("event") &&
                          "outline outline-2 outline-primary-outline"
                      )}
                      onClick={() => onEventClick(event.id)}
                    >
                      <EventIcon className="text-2xl text-accent" />
                      <div>
                        <p className="mb-[6px] text-base font-bold leading-none text-accent">
                          {event.event_name}
                        </p>
                        <p className="text-sm text-primary-text">
                          {event.description}
                        </p>
                        <p className="text-sm leading-tight text-primary-text">
                          {event.event_category} - {event.event_visibility}
                        </p>
                        <p className="text-sm leading-none text-primary-text">
                          <span className="font-semibold">Date: </span>
                          {new Date(
                            `${event.event_date}T${event.event_time}`
                          ).toDateTime()}
                        </p>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <ScheduleDetails />
    </div>
  );
};

export default Schedule;
