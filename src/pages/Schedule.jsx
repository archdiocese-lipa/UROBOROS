import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Title, Description } from "@/components/Title";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search, EventIcon } from "@/assets/icons/icons";
import CreateEvent from "@/components/Schedule/CreateEvent";
import CreateMeeting from "@/components/Schedule/CreateMeeting";

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
            <form>
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
      <div className="grid grow place-items-center rounded-2xl outline outline-2 outline-[#e7dad3]">
        <Description>Select a Schedule to view and configure</Description>
      </div>
    </div>
  );
};

export default Schedule;
