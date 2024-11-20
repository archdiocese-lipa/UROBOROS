import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Title, Description } from "@/components/Title";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CreateEvent from "@/components/Schedule/CreateEvent";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import CreateMeeting from "@/components/Schedule/CreateMeeting";

import { cn } from "@/lib/utils";
import { Search, EventIcon } from "@/assets/icons/icons";

const Schedule = () => {
  const [filter, setFilter] = useState("");
  const [urlPrms, setUrlPrms] = useSearchParams();

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
  const { data, isLoading } = useQuery({
    queryKey: ["schedules", filter, urlPrms.get("query")?.toString() || ""],
    queryFn: async () => {
      // Fetch schedules here
      // initialize a new URLSearchParams object
      // if filter is not empty, append the filter to the params.
      // then use the params?.toString() method, then include it in the supabase query.
      // or just pass the object, depending on how the query is implemented in the supabase.
      // MARK: Uncomment the code below when fetch logic is implemented
      // ===============================================================
      // const params = new URLSearchParams();
      // if (filter) {
      //   params.append("type", filter);
      // }

      const response = await Promise.resolve([
        {
          title: "Event Name A",
          description: "Event Description",
          date: new Date().toDateTime(),
        },
      ]);
      return response;
    },
  });

  const onQuery = (data) => {
    // If the query is empty, remove the query from the URLSearchParams
    if (!data?.query) {
      setUrlPrms({});
      return; // exit the function
    }
    // // If the query is not empty, set the query to the URLSearchParams
    setUrlPrms({ query: data?.query });
  };

  const onFilterChange = (value) => {
    setFilter(value);
  };

  return (
    <div className="flex h-full w-full gap-8">
      <div className="flex flex-col gap-8">
        <div>
          <Title>Scheduler</Title>
          <Description>Manage schedules for your organization.</Description>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-1 lg:min-w-[400px]">
            <CreateEvent />
            <CreateMeeting />
          </div>
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
                <p>Loading...</p>
              ) : (
                data?.map((schedule, i) => (
                  <div
                    key={i}
                    className="flex gap-3 rounded-[10px] bg-primary/50 px-5 py-4"
                  >
                    <EventIcon className="text-2xl text-accent" />
                    <div>
                      <p className="mb-[6px] text-base font-bold leading-none text-accent">
                        {schedule.title}
                      </p>
                      <p className="text-sm text-primary-text">
                        {schedule.description}
                      </p>
                      <p className="text-sm leading-none text-primary-text">
                        <span className="font-semibold">Date: </span>
                        {new Date(schedule.date).toDateTime()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grow place-items-center rounded-2xl outline outline-2 outline-[#e7dad3]">
        <Description>Select a Schedule to view and configure</Description>
      </div>
    </div>
  );
};

export default Schedule;
