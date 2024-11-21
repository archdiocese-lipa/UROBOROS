import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { createEventSchema } from "@/zodSchema/CreateEventSchema";
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
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Calendar } from "@/components/ui/calendar";
import { EventIcon, DownIcon } from "@/assets/icons/icons";
import { CalendarIcon } from "lucide-react";
import TimePicker from "./TimePicker";
import { Textarea } from "../ui/textarea";
import AssignVolunteerComboBox from "./AssignVolunteerComboBox";

const CreateEvent = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const { toast } = useToast();

  // Predefined events with associated categories, visibility, and ministry
  // Maganda meron na tayo na nakaset na table sa supabase nito mark
  const events = [
    {
      name: "Children's Liturgy, 9.30am",
      category: "youth",
      visibility: "public",
      eventTime: new Date(new Date().setHours(9, 30, 0, 0)), //  Date object
    },
    {
      name: "Children's Liturgy, 11.00am",
      category: "youth",
      visibility: "public",
      eventTime: new Date(new Date().setHours(11, 0, 0, 0)),
    },
    {
      name: "Ablaze",
      category: "youth",
      visibility: "public",
      eventTime: new Date(new Date().setHours(12, 0, 0, 0)),
    },
    {
      name: "First Holy Communion, 11.00am",
      category: "youth",
      visibility: "private",
      eventTime: new Date(new Date().setHours(11, 0, 0, 0)),
    },
  ];

  //Dummy data volunteers
  const volunteers = [
    { uuid: "1231231232", userFirstName: "John", userLastName: "Doe" },
    { uuid: "233323232", userFirstName: "Jane", userLastName: "Smith" },
    { uuid: "323232425235", userFirstName: "Alice", userLastName: "Johnson" },
  ];

  const eventForm = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      eventName: "",
      eventCategory: "",
      eventVisibility: "",
      ministry: "",
      eventDate: null,
      eventTime: new Date(),
      eventDescription: "",
      assignVolunteer: "",
    },
  });

  const {
    setValue,
    watch,
    handleSubmit,
    control,
    resetField,
    formState: { isSubmitting },
  } = eventForm;
  const watchVisibility = watch("eventVisibility");

  // Effect to reset the ministry field when visibility changes to "public"
  useEffect(() => {
    if (watchVisibility !== "ministry") {
      resetField("ministry"); // Reset the ministry field when eventVisibility is not "ministry"
    }
  }, [watchVisibility, resetField]);

  const handleEventSelect = (eventItem) => {
    // Set selected event's values for all fields
    setValue("eventName", eventItem.name);
    setValue("eventCategory", eventItem.category);
    setValue("eventVisibility", eventItem.visibility);
    setValue("eventTime", eventItem.eventTime);

    setPopoverOpen(false); // Close the popover
  };

  // Mark dito mo connect backend
  const handleFormSubmit = async (data) => {
    try {
      // Simulate API call or validation
      if (
        !data.eventName ||
        !data.eventCategory ||
        !data.eventVisibility ||
        !data.eventDate ||
        !data.eventTime
      ) {
        throw new Error("Please fill all required fields.");
      }
      // Simulating success
      toast({
        title: "Event Created",
        description: `Event "${data.eventName}" created successfully!`,
      });
      setDialogOpen(false);
      eventForm.reset();
      console.log(data);
    } catch (error) {
      // Handle error
      toast({
        title: "Event Creation Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
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

        <Form {...eventForm}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-2">
            {/* Event Name Field */}
            <FormField
              control={control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <div className="relative flex-1">
                      <Input
                        placeholder="Add event name here"
                        className="pr-10"
                        {...field}
                      />
                      <Popover
                        open={isPopoverOpen}
                        onOpenChange={setPopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="text-gray-500 absolute right-5 top-1/2 -translate-y-1/2 transform"
                          >
                            <DownIcon />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="p-2">
                          {events.map((eventItem, index) => (
                            <button
                              key={index}
                              onClick={() => handleEventSelect(eventItem)}
                              className="text-gray-700 hover:bg-gray-200 mt-1 w-full rounded-md border border-secondary-accent px-4 py-2 text-left text-sm"
                            >
                              {eventItem.name}
                            </button>
                          ))}
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="assignVolunteer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Volunteer</FormLabel>
                  <FormControl>
                    <AssignVolunteerComboBox
                      options={volunteers.map((volunteer) => ({
                        value: volunteer.uuid, // UUID as string value
                        label: `${volunteer.userFirstName} ${volunteer.userLastName}`,
                      }))}
                      value={field.value}
                      onChange={field.onChange} 
                      placeholder="Select Volunteer"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Event Category, Visibility & Ministry */}
            <div className="flex flex-wrap gap-2">
              {/* Event Category */}
              <FormField
                control={control}
                name="eventCategory"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="youth">youth</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Visibility */}
              <FormField
                control={control}
                name="eventVisibility"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Event Visibility</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional Ministry Selection */}
              {watchVisibility === "private" && (
                <FormField
                  control={control}
                  name="ministry"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Select Ministry</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Ministry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ministrygroupone">
                              Ministry Group One
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Event Date, Time */}
            <div className="flex items-center gap-x-2">
              <FormField
                control={control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="bg-primary font-normal"
                          >
                            {field.value ? (
                              format(new Date(field.value), "MMMM d, yyyy") // Ensure `field.value` is a valid Date object
                            ) : (
                              <span>Select a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => field.onChange(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Time */}
              <FormField
                control={control}
                name="eventTime"
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-0">
                    <FormLabel>Event Time</FormLabel>
                    <FormControl>
                      {/* Use the custom TimePicker here */}
                      <TimePicker
                        value={field.value} // Bind value from form control
                        onChange={(newValue) => field.onChange(newValue)} // Handle change
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Event Description */}
            <FormField
              control={control}
              name="eventDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <span className="text-secondary font-light"> (optional)</span>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Insert a description here."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dialog Footer */}
            <DialogFooter>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline" onClick={() => eventForm.reset()}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating" : "Create"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEvent;
