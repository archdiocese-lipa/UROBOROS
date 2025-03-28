import { useState, useRef, useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
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
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Icon } from "@iconify/react";

import { convertTimeStringToDate, formatEventTime } from "@/lib/utils";
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
import { Switch } from "../ui/switch";
import TimePicker from "./TimePicker";
import { format } from "date-fns";
import CustomReactSelect from "../CustomReactSelect";
import useUsersByRole from "@/hooks/useUsersByRole";
import { createEventSchema } from "@/zodSchema/CreateEventSchema";
import useEvent from "@/hooks/useEvent";
import { editEventSchema } from "@/zodSchema/EditEventSchema";

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

const NewCreateEventForm = ({
  isEditMode = false,
  initialEventData = null,
  onSuccess = () => {},
  queryKey = ["events"],
  isOpen = false,
  onOpenChange = () => {},
}) => {
  const [openDialog, setOpenDialog] = useState(isEditMode ? isOpen : false);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openCalendar, setOpenCalendar] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { userData } = useUser();
  const userId = userData?.id;
  const { temporaryRole } = useRoleSwitcher();

  const queryClient = useQueryClient();

  // Fetch users by role
  const { data: coordinators } = useUsersByRole("coordinator");
  const { data: volunteers } = useUsersByRole("volunteer");
  const { data: admins } = useUsersByRole("admin");

  // Fetch users to become public volunteers
  const publicVolunteers = [
    ...(volunteers || []),
    ...(admins || []),
    ...(coordinators || []),
  ];

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
  } = useAssignedMinistries(userId);

  // Fetch volunteers
  const {
    data: ministryVolunteers = [],
    isLoading: ministryVolunteersLoading,
  } = useMinistryVolunteers(selectedGroup);

  const { ministries } = useMinistry({
    ministryId: selectedMinistry,
  });

  // Fetch groups
  const { data: groups = [], isLoading: groupsLoading } =
    useMinistryGroups(selectedMinistry);
  // 1. Define the form.
  const form = useForm({
    resolver: zodResolver(
      initialEventData ? editEventSchema : createEventSchema
    ),
    defaultValues:
      isEditMode && initialEventData
        ? {
            eventName: initialEventData?.event_name || "",
            eventDescription: initialEventData?.description || "",
            eventVisibility: initialEventData?.event_visibility || "",
            eventObservation: initialEventData?.requires_attendance === false,
            eventTime: initialEventData?.event_time
              ? convertTimeStringToDate(initialEventData?.event_time)
              : null,
            eventDate: initialEventData?.event_date
              ? new Date(initialEventData?.event_date)
              : null,
            eventPosterImage: initialEventData?.image_url || null,
            assignVolunteer: [],
            groups: initialEventData?.group_id || "",
            ministry: initialEventData?.ministry_id || "",
          }
        : {
            eventName: "",
            eventDescription: "",
            eventVisibility: "",
            eventObservation: false,
            eventTime: null,
            eventDate: null,
            eventPosterImage: null,
            assignVolunteer: [],
            groups: "",
            ministry: "",
          },
  });

  // Watch visibility and observation
  const watchVisibility = form.watch("eventVisibility");
  const watchObservation = form.watch("eventObservation");

  const { createEventMutation, updateEventMutation } = useEvent();

  // Function to submit.
  const onSubmit = (data) => {
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
      eventDate: formattedDate,
      eventTime: formattedTime,
      userId, // For creator id in event table
    };

    if (initialEventData) {
      // If a new file is selected, include it
      if (data.eventPosterImage instanceof File) {
        eventPayload.eventPosterImage = data.eventPosterImage;
      }
      // If no new file but existing image URL, keep the existing URL
      else if (initialEventData.image_url) {
        eventPayload.eventPosterImage = initialEventData.image_url;
      }
    }
    // Call the create event function with the prepared data
    if (!initialEventData) {
      createEventMutation.mutate(eventPayload, {
        onSuccess: () => {
          setOpenDialog(false);
          onSuccess();
        },
      });
    } else {
      updateEventMutation.mutate(
        {
          eventId: initialEventData?.id,
          updatedData: eventPayload,
        },
        {
          onSuccess: () => {
            setOpenDialog(false);
            onSuccess();
            queryClient.invalidateQueries(queryKey);
          },
        }
      );
    }
  };

  // Function for opening and closing the dialog
  const handleOpenDialog = (openState) => {
    setOpenDialog(openState);

    // If in edit mode, call the parent's callback
    if (isEditMode) {
      onOpenChange(openState);
    }

    // If dialog is closing, reset the form
    if (!openState) {
      form.reset();
      setImagePreview(null);
    }
  };

  const getVolunteerOptions = () => {
    //For public visibility, return all volunteers
    if (watchVisibility === "public") {
      return (
        publicVolunteers?.map((volunteer) => ({
          value: volunteer?.id || "",
          label: `${volunteer?.first_name || ""} ${volunteer?.last_name || ""}`,
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
          label: `${volunteer?.users?.first_name || ""} ${volunteer?.users?.last_name || ""}`,
        })) || []
      );
    }

    // Fallback
    return [];
  };

  // Use useEffect to sync with parent's open state
  useEffect(() => {
    if (isEditMode) {
      setOpenDialog(isOpen);
    }
  }, [isOpen, isEditMode]);

  // Effect to handle visibility changes
  useEffect(() => {
    // When visibility changes
    const { resetField, setValue } = form;

    if (watchVisibility === "public") {
      // Reset ministry-related fields when changing to public visibility
      resetField("ministry", { defaultValue: "" });
      resetField("groups");
      resetField("assignVolunteer", { defaultValue: [] });
      setSelectedMinistry(null);
      setSelectedGroup(null);
    } else if (watchVisibility === "private") {
      // Reset volunteer selections when switching to private
      resetField("assignVolunteer", { defaultValue: [] });

      // Auto-select the only ministry when there's exactly one option
      if (assignedMinistries?.length === 1) {
        const ministryId = assignedMinistries[0].id;
        setValue("ministry", ministryId);
        setSelectedMinistry(ministryId);
      }
    }
  }, [watchVisibility, assignedMinistries, form]);

  // Separate effect to handle ministry changes
  useEffect(() => {
    const { resetField, setValue } = form;

    if (selectedMinistry && watchVisibility === "private") {
      // Reset dependent fields when ministry changes
      resetField("groups", { defaultValue: "" });
      resetField("assignVolunteer", { defaultValue: [] });
      setSelectedGroup(null);

      // Auto-select the only group if there's only one option
      if (groups?.length === 1) {
        const groupId = groups[0].id;
        setValue("groups", groupId);
        setSelectedGroup(groupId);
      }
    }
  }, [selectedMinistry, watchVisibility, groups, form]);

  useEffect(() => {
    if (isEditMode && initialEventData) {
      // Set the selected ministry from initialEventData
      if (initialEventData.ministry_id) {
        setSelectedMinistry(initialEventData.ministry_id);
        form.setValue("ministry", initialEventData.ministry_id);
      }

      // Set image preview if available
      if (initialEventData.image_url) {
        setImagePreview(initialEventData.image_url);
        form.setValue("eventPosterImage", initialEventData?.image_url);
      }
    }
  }, [isEditMode, initialEventData, form]);

  // Separate effect to set the group AFTER the ministry is selected and groups are loaded
  useEffect(() => {
    if (
      isEditMode &&
      initialEventData?.group_id &&
      selectedMinistry &&
      groups?.length > 0
    ) {
      // Verify the group belongs to the selected ministry
      const groupExists = groups.some(
        (group) => group.id === initialEventData.group_id
      );

      if (groupExists) {
        setSelectedGroup(initialEventData.group_id);
        form.setValue("groups", initialEventData.group_id);
      }
    }
  }, [isEditMode, initialEventData?.group_id, selectedMinistry, groups, form]);

  return (
    <AlertDialog open={openDialog} onOpenChange={handleOpenDialog}>
      {!isEditMode && (
        <AlertDialogTrigger asChild>
          <Button>
            <div className="flex gap-2">
              <EventIcon className="text-primary" />
              <p>Create Event</p>
            </div>
          </Button>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent className="max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialogHeader className="text-primary-text">
              <AlertDialogTitle className="text-[20px] font-bold">
                {isEditMode ? "Update Event" : "Create Event"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isEditMode
                  ? "Make changes to your event"
                  : "Schedule an upcoming event."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogBody className="no-scrollbar flex max-h-[35rem] flex-col gap-6 overflow-y-scroll md:max-h-full md:flex-row md:overflow-y-auto">
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
                            className="pr-10"
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
                                  <Loader2 className="animate-spin" />
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
                                  <SelectItem value="loading" disabled>
                                    <Loader2 className="animate-spin" />
                                  </SelectItem>
                                ) : (
                                  groups?.map((group) => (
                                    <SelectItem
                                      key={group?.id}
                                      value={group?.id}
                                    >
                                      {group?.name}
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
                      <FormLabel className="sr-only text-[12px] font-semibold text-accent/75">
                        Event as Observation
                      </FormLabel>
                      <FormControl>
                        <div className="flex justify-between rounded-xl bg-primary px-4 py-2">
                          <div>
                            <Label className="text-[12px] font-medium text-accent/75">
                              Option to disable time and volunteer
                            </Label>
                          </div>
                          <Switch
                            {...field}
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              // Reset time and volunteers if checked
                              if (checked) {
                                form.setValue("eventTime", null);
                                form.setValue("assignVolunteer", []);
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-x-2">
                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col">
                        <FormLabel className="text-[12px] font-semibold text-accent/75">
                          Event Date
                        </FormLabel>
                        <Popover
                          open={openCalendar}
                          onOpenChange={setOpenCalendar}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="rounded-full border-neutral-200 bg-primary text-sm font-normal text-accent/75 hover:font-medium hover:text-accent"
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
                              onSelect={(date) => {
                                if (date) {
                                  field.onChange(new Date(date));
                                  setOpenCalendar(false);
                                } else {
                                  field.onChange(null);
                                }
                              }}
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
                    control={form.control}
                    name="eventTime"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-[12px] font-semibold text-accent/75">
                          Event Time
                        </FormLabel>
                        <FormControl>
                          {/* TimePicker */}
                          <TimePicker
                            value={field.value}
                            onChange={(newValue) => field.onChange(newValue)}
                            disabled={watchObservation}
                            className={
                              watchObservation ? "cursor-not-allowed" : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/************************************************************ Right Div **********************************/}
              <div className="flex-1">
                <div className="flex flex-col gap-6">
                  {/* Assign Volunteer */}
                  {!isEditMode && (
                    <FormField
                      control={form.control}
                      name="assignVolunteer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[12px] font-semibold text-accent/75">
                            Assign Volunteer
                          </FormLabel>
                          <FormControl>
                            <CustomReactSelect
                              options={
                                watchVisibility === "private" &&
                                ministryVolunteersLoading
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
                                return (
                                  foundOption || { value, label: "Unknown" }
                                );
                              })}
                              onChange={(selected) =>
                                field.onChange(
                                  selected
                                    ? selected.map((option) => option.value)
                                    : []
                                )
                              }
                              placeholder={"Select Volunteer"}
                              disabled={watchObservation}
                              className={
                                watchObservation &&
                                "cursor-not-allowed opacity-50"
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {/* Event Poster Image */}
                  <FormField
                    control={form.control}
                    name="eventPosterImage"
                    render={({ field: { onChange } }) => (
                      <FormItem className="mt-6">
                        <FormLabel className="text-[12px] font-semibold text-accent/75">
                          Event Poster
                        </FormLabel>
                        <FormControl>
                          <Input
                            ref={fileInputRef}
                            id="file-input"
                            type="file"
                            accept="image/png, image/jpeg"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const previewUrl = URL.createObjectURL(file);
                                setImagePreview(previewUrl);
                                onChange(file);
                              } else {
                                onChange(null);
                              }
                            }}
                          />
                        </FormControl>
                        {imagePreview ? (
                          <div className="relative max-h-[400px] min-h-[210px] w-full overflow-hidden rounded-lg">
                            <img
                              className="w-full object-cover"
                              src={imagePreview}
                              alt="Event poster"
                            />
                            <Icon
                              onClick={() => {
                                setImagePreview(null);
                                form.setValue("eventPosterImage", null);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }
                              }}
                              className="absolute right-4 top-4 text-2xl text-accent hover:cursor-pointer hover:text-red-600"
                              icon={"mingcute:close-circle-fill"}
                            />
                          </div>
                        ) : (
                          <Label htmlFor="file-input">
                            <div className="flex h-[210px] flex-col items-center justify-center rounded-lg border-accent/60 hover:cursor-pointer hover:bg-accent/5">
                              <div className="flex flex-shrink-0 items-center justify-center rounded-md">
                                <Icon
                                  className="h-11 w-11 text-[#CDA996]"
                                  icon={"mingcute:pic-fill"}
                                />
                              </div>
                              <p className="text-[12px] font-semibold text-[#CDA996]">
                                Upload 1:1 Media
                              </p>
                            </div>
                          </Label>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </AlertDialogBody>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit" className="flex-1">
                {isEditMode
                  ? updateEventMutation.isPending
                    ? "Updating..."
                    : "Update"
                  : createEventMutation.isPending
                    ? "Creating..."
                    : "Create"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

NewCreateEventForm.propTypes = {
  isEditMode: PropTypes.bool,
  initialEventData: PropTypes.object,
  onSuccess: PropTypes.func,
  queryKey: PropTypes.array,
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
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
    setValue("eventVisibility", eventItem.event_visibility);
    setValue("eventTime", convertTimeStringToDate(eventItem.event_time));
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
