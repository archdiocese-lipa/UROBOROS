import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import PropTypes from "prop-types";

import { createEventSchema } from "@/zodSchema/CreateEventSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
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
import { DownIcon } from "@/assets/icons/icons";
import { CalendarIcon } from "lucide-react";
import TimePicker from "./TimePicker";
import { Textarea } from "../ui/textarea";

import { useUser } from "@/context/useUser";
import useCreateEvent from "@/hooks/useCreateEvent";
import useQuickAccessEvents from "@/hooks/useQuickAccessEvents";
import useGetAllMinistries from "@/hooks/useGetAllMinistries";

import { updateEvent } from "@/services/eventService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreateEvent = ({
  id = "create-event",
  eventData = null,
  setDialogOpen,
  queryKey,
}) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const { userData } = useUser(); // Get userData from the context

  const userId = userData?.id; // Extract the userId, safely checking if userData exists
  const { data: ministries } = useGetAllMinistries();

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: createEvent, _isLoading } = useCreateEvent();
  const { events } = useQuickAccessEvents();

  const editMutation = useMutation({
    mutationFn: async ({ eventId, updatedData }) =>
      await updateEvent({ eventId, updatedData }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Event edited!",
      });
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  const eventForm = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      eventName: eventData?.event_name || "",
      eventCategory: eventData?.event_category || "",
      eventVisibility: eventData?.event_visibility || "",
      ministry: eventData?.event_ministry || "",
      eventDate: eventData?.event_date
        ? new Date(`${eventData?.event_date}T${eventData?.event_time}`)
        : null,
      eventTime: eventData?.event_time
        ? new Date(`${eventData?.event_date}T${eventData?.event_time}`)
        : "",
      eventDescription: eventData?.event_description || "",
      // assignVolunteer:
      //   eventData?.event_volunteers.map(
      //     (volunteer) => volunteer.volunteer_id
      //   ) || [],
    },
  });

  const { setValue, watch, handleSubmit, control, resetField } = eventForm;
  const watchVisibility = watch("eventVisibility");

  // Effect to reset the ministry field when visibility changes to "public"
  useEffect(() => {
    if (watchVisibility !== "ministry") {
      resetField("ministry"); // Reset the ministry field when eventVisibility is not "ministry"
    }
  }, [watchVisibility, resetField]);

  const handleEventSelect = (eventItem) => {
    // Convert the event time string to a Date object
    const eventDate = eventItem.event_time
      ? new Date() // Z to indicate UTC time
      : null;

    // Set the time on the event date
    if (eventDate && eventItem.event_time) {
      const [hours, minutes, seconds] = eventItem.event_time
        .split(":")
        .map(Number);
      eventDate.setHours(hours, minutes, seconds);
    }

    setValue("eventName", eventItem.event_name);
    setValue("eventCategory", eventItem.event_category);
    setValue("eventVisibility", eventItem.event_visibility);

    setValue("eventTime", eventDate); // Set Date object here

    setPopoverOpen(false); // Close the popover
  };

  // Mark dito mo connect backend
  const onSubmit = (data) => {
    // Ensure userId is available
    if (!userId) {
      toast({
        description: "User not logged in. Please log in to create an event.",
        variant: "error",
      });
      return; // Prevent form submission if no userId
    }

    // // Validate and format date and time
    const formattedDate = data?.eventDate
      ? format(new Date(data.eventDate), "yyyy-MM-dd")
      : null;
    const formattedTime = data?.eventTime
      ? format(new Date(data.eventTime), "HH:mm:ss")
      : null;

    // Prepare event data with formatted date and time
    const eventPayload = {
      ...data,
      eventDate: formattedDate, // Ensure event date is formatted correctly
      eventTime: formattedTime, // Ensure event time is formatted correctly
      userId, // Include userId in the data
    };

    // Call the create event function with the prepared data
    if (!eventData) {
      createEvent(eventPayload);
      setDialogOpen(false); // Close the dialog if success
      return;
    } else {
      editMutation.mutate({
        eventId: eventData?.id,
        updatedData: eventPayload,
      });
    }

    setDialogOpen(false); // Close the dialog if success
  };

  // console.log("form values",eventForm.getValues())


  return (
    <Form {...eventForm}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2" id={id}>
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
                    className="pr-14"
                    {...field}
                  />
                  <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <button className="text-gray-500 absolute right-5 top-1/2 flex h-full w-7 -translate-y-1/2 transform items-center justify-center">
                        <DownIcon className="w-3 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-2">
                      {events?.map((eventItem, index) => (
                        <button
                          key={index}
                          onClick={() => handleEventSelect(eventItem)}
                          className="text-gray-700 hover:bg-gray-200 mt-1 w-full rounded-md border border-secondary-accent px-4 py-2 text-left text-sm"
                        >
                          {eventItem.event_name}
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youth">Youth</SelectItem>
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                      onValueChange={(value) => {
                        field.onChange(value); // Update the form field value
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Ministry" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Ensure ministries.data is an array before mapping */}
                        {Array.isArray(ministries?.data) &&
                        ministries?.data.length > 0 ? (
                          ministries?.data.map((ministry) => (
                            <SelectItem key={ministry.id} value={ministry.id}>
                              {ministry.ministry_name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled>
                            No ministries available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        {/* <FormField
          control={control}
          name="assignVolunteer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Volunteer</FormLabel>
              <FormControl>
                <AssignVolunteerComboBox
                  options={
                    selectedMinistry && members?.length > 0
                      ? members.map((member) => ({
                          value: member.user_id, // Use the user_id for the value
                          label: `${member.users?.first_name || "Unknown"} ${member.users?.last_name || "Unknown"}`, // Safely access nested properties
                        }))
                      : volunteers?.map((volunteer) => ({
                          value: volunteer.id,
                          label: `${volunteer.first_name} ${volunteer.last_name}`,
                        }))
                  }
                  value={
                    Array.isArray(field.value) ? field.value : [field.value]
                  } // Ensure it's always an array
                  onChange={field.onChange} // Update the form state
                  placeholder="Select Volunteer"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

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
                <Textarea {...field} placeholder="Insert a description here." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CreateEvent;

CreateEvent.propTypes = {
  id: PropTypes.string,
  eventData: PropTypes.object,
  setDialogOpen: PropTypes.func,
  queryKey: PropTypes.array,
};
