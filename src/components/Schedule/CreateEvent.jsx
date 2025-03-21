import { useState, useEffect, useMemo } from "react";
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
import { CalendarIcon, Loader2 } from "lucide-react";
import TimePicker from "./TimePicker";
import { Textarea } from "../ui/textarea";
import { useUser } from "@/context/useUser";
import useUsersByRole from "@/hooks/useUsersByRole";

import { updateEvent } from "@/services/eventService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useMinistry from "@/hooks/useMinistry";
import useEvent from "@/hooks/useEvent";
import CustomReactSelect from "../CustomReactSelect";
import useRoleSwitcher from "@/hooks/useRoleSwitcher";
import { ROLES } from "@/constants/roles";
import {
  getAssignedMinistries,
  getMinistryVolunteers,
  getOneMinistryGroup,
} from "@/services/ministryService";

const useAssignedMinistries = (userId) => {
  return useQuery({
    queryKey: ["assigned-ministries", userId],
    queryFn: () => getAssignedMinistries(userId),
    enabled: !!userId,
  });
};

const useMinistryVolunteers = (groupId) => {
  return useQuery({
    queryKey: ["ministry-volunteers", groupId],
    queryFn: () => getMinistryVolunteers(groupId),
    enabled: !!groupId,
  });
};

const useMinistryGroups = (ministryId) => {
  return useQuery({
    queryKey: ["ministry-groups", ministryId],
    queryFn: () => getOneMinistryGroup(ministryId),
    enabled: !!ministryId,
  });
};

const CreateEvent = ({
  id = "create-event",
  eventData = null,
  setDialogOpen,
  queryKey,
}) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const { ministries } = useMinistry({
    ministryId: selectedMinistry,
  });

  const { userData } = useUser();

  const userId = userData?.id;
  const { temporaryRole } = useRoleSwitcher();

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { createEventMutation, quickAccessEvents } = useEvent();
  const { data: coordinators } = useUsersByRole("coordinator");
  const { data: volunteers } = useUsersByRole("volunteer");
  const { data: admins } = useUsersByRole("admin");

  // Fetch assigned ministry
  const {
    data: assignedMinistries = [],
    isLoading: assignedMinistriesLoading,
  } = useAssignedMinistries(userData?.id);

  // Get the current selected group from the form

  // Fetch volunteers
  const {
    data: ministryVolunteers = [],
    isLoading: ministryVolunteersLoading,
  } = useMinistryVolunteers(selectedGroup);

  // Fetch groups
  const { data: groups, isLoading: groupsLoading } =
    useMinistryGroups(selectedMinistry);

  const publicVolunteers = [
    ...(volunteers || []),
    ...(admins || []),
    ...(coordinators || []),
  ];

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

  const coordinatorMinistry = useMemo(
    () => assignedMinistries?.map((ministry) => ministry.id) || [],
    [assignedMinistries]
  );

  //Volunteer options
  const getVolunteerOptions = () => {
    //For public visibility, return all volunteers
    if (watchVisibility === "public") {
      return (
        publicVolunteers?.map((volunteer) => ({
          value: volunteer?.id || "",
          label: `${volunteer?.first_name} ${volunteer?.last_name}`,
        })) || []
      );
    }

    // For private visibility events with a selected ministry
    if (
      watchVisibility === "private" &&
      !ministryVolunteersLoading &&
      ministryVolunteers
    ) {
      return (
        ministryVolunteers?.map((volunteer) => ({
          value: volunteer?.users?.id || "",
          label: `${volunteer?.users?.first_name} ${volunteer?.users?.last_name}`,
        })) || []
      );
    }

    // Fallback
    return [];
  };

  const updateEventSchema = createEventSchema.omit({ assignVolunteer: true });

  const eventForm = useForm({
    resolver: zodResolver(eventData ? updateEventSchema : createEventSchema),
    defaultValues: {
      eventName: eventData?.event_name || "",
      eventVisibility:
        eventData?.event_visibility ||
        (temporaryRole === ROLES[0] ? "private" : "public"),
      ministry:
        eventData?.event_ministry ||
        (coordinatorMinistry?.length === 1 ? coordinatorMinistry[0] : ""),
      eventDate: eventData?.event_date
        ? new Date(`${eventData?.event_date}T${eventData?.event_time}`)
        : null,
      eventTime: eventData?.event_time
        ? new Date(`${eventData?.event_date}T${eventData?.event_time}`)
        : "",
      eventDescription: eventData?.event_description || "",
      assignVolunteer:
        eventData?.event_volunteers.map(
          (volunteer) => volunteer.volunteer_id
        ) || [],
    },
  });

  const { setValue, watch, handleSubmit, control, resetField } = eventForm;
  const watchVisibility = watch("eventVisibility");

  // Effect to reset the ministry field when visibility changes to "public"
  useEffect(() => {
    if (watchVisibility === "public") {
      // Reset ministry when changing to public
      resetField("ministry");
      resetField("assignVolunteer", { defaultValue: [] });
    } else if (watchVisibility === "private") {
      // Reset volunteer selections when switching from public to private
      resetField("assignVolunteer", { defaultValue: [] });

      // Auto-select the only ministry when changing to private
      if (coordinatorMinistry?.length === 1) {
        setValue("ministry", coordinatorMinistry[0]);
        setSelectedMinistry(coordinatorMinistry[0]);
      }
    }
  }, [watchVisibility, coordinatorMinistry, resetField, setValue]);

  // Reset the volunteer field when selecting to other ministry.
  useEffect(() => {
    // Reset volunteer selections when the selected ministry changes
    if (watchVisibility === "private" && selectedMinistry) {
      resetField("assignVolunteer", { defaultValue: [] });
    }
  }, [selectedMinistry, watchVisibility, resetField]);

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
    setValue("eventVisibility", eventItem.event_visibility);
    setValue("eventTime", eventDate);
    setPopoverOpen(false); // Close the popover
  };

  // Reset form when selected another ministry
  useEffect(() => {
    if (watchVisibility === "private") {
      if (selectedMinistry) {
        resetField("groups", { defaultValue: "" });
        resetField("assignVolunteer", { defaultValue: [] });
        setSelectedGroup(null);
      }
    }
  }, [selectedMinistry, watchVisibility, resetField]);

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
      createEventMutation.mutate(eventPayload);
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
                      {quickAccessEvents?.map((event, index) => (
                        <button
                          key={index}
                          onClick={() => handleEventSelect(event)}
                          className="text-gray-700 hover:bg-gray-200 mt-1 w-full rounded-md border border-secondary-accent px-4 py-2 text-left text-sm"
                        >
                          {`${event.event_name}, ${new Date(
                            `1970-01-01T${event.event_time}`
                          )
                            .toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })
                            .replace(":", ".")
                            .replace(" ", "")
                            .toLowerCase()}`}
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
                        field.onChange(value);
                        setSelectedMinistry(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Ministry" />
                      </SelectTrigger>
                      <SelectContent>
                        {assignedMinistriesLoading ? (
                          <Loader2 />
                        ) : temporaryRole === ROLES[0] ? (
                          // If user is coordinator
                          assignedMinistries?.length > 0 ? (
                            assignedMinistries?.map((ministry) => (
                              <SelectItem key={ministry.id} value={ministry.id}>
                                {ministry.ministry_name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled>
                              No ministries available
                            </SelectItem>
                          )
                        ) : // If user is admin
                        ministries?.length > 0 ? (
                          ministries.map((ministry) => (
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
          {/* Groups */}
          {watchVisibility === "private" && (
            <FormField
              control={control}
              name="groups"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Select Group</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedGroup(value);
                        resetField("assignVolunteer", { defaultValue: [] });
                      }}
                      value={field.value}
                      disabled={!selectedMinistry}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        {groupsLoading ? (
                          <Loader2 />
                        ) : (
                          groups?.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
        </div>
        {!eventData && (
          <FormField
            control={control}
            name="assignVolunteer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign Volunteer</FormLabel>
                <FormControl>
                  <CustomReactSelect
                    options={
                      watchVisibility === "private" && ministryVolunteersLoading
                        ? [{ label: "Loading...", isDisabled: true }]
                        : getVolunteerOptions()
                    }
                    value={field.value.map((value) => {
                      // Find the volunteer in our options list
                      const allOptions = getVolunteerOptions();
                      const foundOption = allOptions.find(
                        (opt) => opt.value === value
                      );

                      // If found, use that, otherwise create a placeholder
                      return foundOption || { value, label: "Unknown" };
                    })}
                    onChange={(selected) =>
                      field.onChange(
                        selected ? selected.map((option) => option.value) : []
                      )
                    }
                    placeholder={"Select Volunteer"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
                          format(new Date(field.value), "MMMM d, yyyy")
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
