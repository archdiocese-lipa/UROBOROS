import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { DownIcon, EventIcon } from "@/assets/icons/icons";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { formatEventTime } from "@/lib/utils";
import { getQuickAccessEvents } from "@/services/eventService";
import useRoleSwitcher from "@/hooks/useRoleSwitcher";
import {
  getAssignedMinistries,
  getMinistryVolunteers,
  getOneMinistryGroup,
} from "@/services/ministryService";
import { useUser } from "@/context/useUser";
import { ROLES } from "@/constants/roles";
import useMinistry from "@/hooks/useMinistry";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

const formSchema = z.object({
  eventName: z.string().min(2, {
    message: "Event name is required.",
  }),
});

const useQuickAccessEvents = () => {
  return useQuery({
    queryKey: ["quickAccessEvents"],
    queryFn: getQuickAccessEvents,
    staleTime: 1000 * 60 * 5,
  });
};

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

const NewCreateEventForm = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const { userData } = useUser();
  const { temporaryRole } = useRoleSwitcher();

  // Fetch quick access events
  const {
    data: quickAccessEvents,
    isLoading: quickAccessEventsLoading,
    error: quickAccessError,
  } = useQuickAccessEvents();

  // Fetch assigned ministry
  const {
    data: assignedMinistries = [],
    isLoading: assignedMinistriesLoading,
  } = useAssignedMinistries(userData?.id);

  // Fetch volunteers
  const {
    data: _ministryVolunteers = [],
    isLoading: _ministryVolunteersLoading,
  } = useMinistryVolunteers(selectedGroup);

  const { ministries } = useMinistry({
    ministryId: selectedMinistry,
  });

  // Fetch groups
  const { data: groups, isLoading: groupsLoading } =
    useMinistryGroups(selectedMinistry);

  // 1. Define the form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
    },
  });

  // Watch visibility
  const watchVisibility = form.watch("eventVisibility");

  // Function to submit.
  const onSubmit = (values) => {
    console.log(values);
  };

  // Function for opening and closing the dialog
  const handleOpenDialog = (openState) => {
    setOpenDialog(openState);
    //If dialog is closing, reset the form
    if (!openState) {
      form.reset();
    }
  };

  return (
    <AlertDialog open={openDialog} onOpenChange={handleOpenDialog}>
      <AlertDialogTrigger asChild>
        <Button>
          <div className="flex gap-2">
            <EventIcon className="text-primary" />
            <p>Create Event</p>
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialogHeader className="text-primary-text">
              <AlertDialogTitle className="text-[20px] font-bold">
                Create Event
              </AlertDialogTitle>
              <AlertDialogDescription>
                Schedule an upcoming event.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogBody className="flex flex-col gap-6 md:flex-row">
              <div className="flex flex-1 flex-col gap-6">
                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-semibold text-accent/75">
                        Event Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex-1">
                          <Input
                            placeholder="Enter event name here"
                            {...field}
                            className={
                              form.formState.errors.eventName
                                ? "border-red-800"
                                : ""
                            }
                          />
                          <QuickAccessEvents
                            quickAccessEvents={quickAccessEvents}
                            setValue={form.setValue}
                            isLoading={quickAccessEventsLoading}
                            isError={quickAccessError}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-semibold text-accent/75">
                        Description
                      </FormLabel>
                      <span className="text-sm font-light text-accent">
                        {" "}
                        (optional)
                      </span>
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
                {/* Ministry, Group & Visibility */}
                <div className="flex flex-wrap gap-2">
                  {/* Conditional Ministry Selection */}
                  {watchVisibility === "private" && (
                    <FormField
                      control={form.control}
                      name="ministry"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-[12px] font-semibold text-accent/75">
                            Select Ministry
                          </FormLabel>
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
                                      <SelectItem
                                        key={ministry.id}
                                        value={ministry.id}
                                      >
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
                                    <SelectItem
                                      key={ministry.id}
                                      value={ministry.id}
                                    >
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
                      control={form.control}
                      name="groups"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-[12px] font-semibold text-accent/75">
                            Select Group
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedGroup(value);
                                form.resetField("assignVolunteer", {
                                  defaultValue: [],
                                });
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
                    control={form.control}
                    name="eventVisibility"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-[12px] font-semibold text-accent/75">
                          Event Visibility
                        </FormLabel>
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
                </div>
                <FormField
                  control={form.control}
                  name="eventObservation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-semibold text-accent/75">
                        Event as Observation
                      </FormLabel>
                      <FormControl>
                        <div className="flex justify-between rounded-xl bg-primary px-4 py-2">
                          <div>
                            <Label className="text-[14px] font-medium text-accent">
                              Event as Observation
                            </Label>
                            <p className="text-[10px] font-medium text-accent/75">
                              This will disable time and volunteer selection.
                            </p>
                          </div>
                          <Switch {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/************************************************************ Right Div **********************************/}
              <div className="flex-1">right</div>
            </AlertDialogBody>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit" className="flex-1">
                Continue
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const QuickAccessEvents = ({
  quickAccessEvents,
  setValue,
  isLoading,
  isError,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleEventSelect = (eventItem) => {
    setValue("eventName", eventItem.event_name);
    setPopoverOpen(false);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger className="absolute right-4 top-1/2 flex h-full w-7 -translate-y-1/2 transform items-center justify-center">
        <DownIcon className="w-3 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-1 p-1">
        {isLoading ? (
          <div className="grid h-full place-content-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center">
            <p>Failed to load events</p>
          </div>
        ) : !quickAccessEvents?.length ? (
          <div className="text-center">
            <p>No recent events found</p>
          </div>
        ) : (
          quickAccessEvents.map((event, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start text-accent/75 hover:text-accent"
              onClick={() => handleEventSelect(event)}
            >
              {`${event.event_name}, ${formatEventTime(event.event_time)}`}
            </Button>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
};

QuickAccessEvents.propTypes = {
  quickAccessEvents: PropTypes.arrayOf(
    PropTypes.shape({
      event_name: PropTypes.string.isRequired,
      event_time: PropTypes.string.isRequired,
      event_category: PropTypes.string.isRequired,
      event_visibility: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ),
  setValue: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
};

export default NewCreateEventForm;
