import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Title, Description } from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EventIcon, Users, Settings, Search } from "@/assets/icons/icons";

const Schedule = () => {
  const form = useForm({
    resolver: zodResolver({
      query: z.string().min(1),
    }),
    defaultValues: {
      query: "",
    },
  });

  // Might change this to useInfiniteQuery instead of useQuery for pagination.
  const { data, isLoading } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      // Fetch schedules here
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

  return (
    <div className="flex gap-8 h-full w-full">
      <div className="flex flex-col gap-8">
        <div>
          <Title>Scheduler</Title>
          <Description>Manage schedules for your organization.</Description>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 lg:min-w-[400px]">
            <Button size="primary">
              <EventIcon className="text-primary" />
              <p>Create Event</p>
            </Button>
            <Button size="primary">
              <Users className="text-primary" />
              <p>Create Meeting</p>
            </Button>
            <Button size="primary">
              <Settings className="text-primary" />
              <p>Create Poll</p>
            </Button>
          </div>
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute text-accent text-2xl top-1/2 transform -translate-y-1/2 left-4" />
                        <Input
                          className="border-none pl-12"
                          type="text"
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
        </div>
        <div>
          <p className="text-accent font-semibold font-montserrat mb-3">
            Schedules
          </p>
          <div className="flex flex-col gap-2 font-montserrat">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              data?.map((schedule, i) => (
                <div
                  key={i}
                  className="flex gap-3 bg-primary/50 rounded-[10px] py-4 px-5"
                >
                  <EventIcon className="text-2xl text-accent" />
                  <div>
                    <p className="font-bold text-accent text-base leading-none mb-[6px]">
                      {schedule.title}
                    </p>
                    <p className="text-primary-text text-sm">
                      {schedule.description}
                    </p>
                    <p className="leading-none text-primary-text text-sm">
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
      <div className="grow grid place-items-center outline-2 outline rounded-2xl outline-[#e7dad3]">
        <Description>Select a Schedule to view and configure</Description>
      </div>
    </div>
  );
};

export default Schedule;
