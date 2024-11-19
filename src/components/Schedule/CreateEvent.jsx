import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Input } from "../ui/input";
import { EventIcon } from "@/assets/icons/icons";

const createEventSchema = z.object({
  eventName: z.string().min(2, {
    message: "Event Name is required.",
  }),
});

const CreateEvent = () => {
  const [isPopoverOpen, setPopoverOpen] = useState(false); // Manage Popover open state

  // Predefined events
  const events = [
    "Christmas Mass",
    "Easter Sunday Service",
    "Thanksgiving Dinner",
    "Youth Retreat",
    "Community Outreach",
  ];

  const eventForm = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      eventName: "",
    },
  });

  const { setValue } = eventForm;

  const handleSubmit = (data) => {
    console.log("Form submitted with event:", data.eventName);
    console.log(data);
  };

  // Handler for selecting an event from the popover
  const handleEventSelect = (eventItem) => {
    console.log("Selected event:", eventItem); // Debug log
    setValue("eventName", eventItem); // Set the selected event in react-hook-form
    setPopoverOpen(false); // Close the popover
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="primary">
          <EventIcon className="text-primary" />
          <p>Create Event</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>Schedule an upcoming event.</DialogDescription>
        </DialogHeader>
        <Form {...eventForm}>
          <form
            onSubmit={eventForm.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={eventForm.control}
              name="eventName"
              render={({ field }) => (
                <FormItem className="flex md:items-center md:gap-2 flex-col md:flex-row text-nowrap">
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <div className="relative flex-1">
                      {/* Input field */}
                      <Input
                        placeholder="Add event name here"
                        className=""
                        {...field}
                      />

                      {/* Popover for event selection */}
                      <Popover
                        open={isPopoverOpen}
                        onOpenChange={setPopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            ▼
                          </button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="p-2 space-y-2">
                            {events.map((eventItem, index) => (
                              <button
                                key={index}
                                onClick={() => handleEventSelect(eventItem)} // Use the handler to select event
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
                              >
                                {eventItem}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Create</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEvent;
