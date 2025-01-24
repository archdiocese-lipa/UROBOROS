import { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../ui/label";
import { useUser } from "@/context/useUser";
import {
  useChildrenManualAttendance,
  useGuardianManualAttendEvent,
  useFetchAlreadyRegistered,
  useRemoveAttendee,
  // useMainApplicantAttendEvent,
} from "@/hooks/useManualAttendEvent";
import { useFamilyData } from "@/hooks/useFamilyData";
import { manualAttendEventsSchema } from "@/zodSchema/ManualAttendEventsSchema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icon } from "@iconify/react";

const ManualAttendEvents = ({ eventId, eventName, eventTime, eventDate }) => {
  const [selectedEvent, setselectedEvent] = useState(""); // set the selected event

  // Get the userId
  const { userData } = useUser();
  const userId = userData?.id;

  // Fetch family data
  const { parentData, childData, isLoading, error } = useFamilyData();
  const form = useForm({
    resolver: zodResolver(manualAttendEventsSchema),
    defaultValues: {
      parents: [],
      children: [],
    },
  });

  // const { mutate: mainApplicantAttend } = useMainApplicantAttendEvent();
  const { mutate: guardianManualAttend } = useGuardianManualAttendEvent();
  const { mutate: childrenManualAttend } = useChildrenManualAttendance();
  const { mutate: removeAttendee } = useRemoveAttendee();

  const onSubmit = (data) => {
    // // Main applicant data (always included)
    // const mainApplicant = [
    //   {
    //     attendee_id: userId,
    //     event_id: selectedEvent,
    //     attendee_type: "parents",
    //     attended: false,
    //     main_applicant: true,
    //     family_id: parentData[0].family_id,
    //     first_name: userData.first_name,
    //     last_name: userData.last_name,
    //     contact_number: userData.contact_number,
    //   },
    // ];

    // Guardian (parent) data, only map if there are parents selected
    const parentsData =
      data.parents?.map((parent) => ({
        ...parent,
        event_id: selectedEvent,
        attendee_type: "parents",
        attended: false,
        main_applicant: false,
        family_id: parent.family_id,
        first_name: parent.first_name,
        last_name: parent.last_name,
        contact_number: parent.contact_number,
        registered_by: userId,
      })) || [];

    const childrenData = data.children?.map((children) => ({
      ...children,
      event_id: selectedEvent,
      attendee_type: "children",
      attended: false,
      main_applicant: false,
      family_id: children.family_id,
      first_name: children.first_name,
      last_name: children.last_name,
      registered_by: userId,
    }));

    // mainApplicantAttend(mainApplicant);
    guardianManualAttend(parentsData);
    childrenManualAttend(childrenData);
  };

  const parentId = useMemo(
    () => parentData?.map((parent) => parent.id) || [],
    [parentData]
  );
  const childId = useMemo(
    () => childData?.map((child) => child.id) || [],
    [childData]
  );
  const combinedData = [...parentId, ...childId];

  const { data: attendedList, isLoading: _isFetchingAttendedList } =
    useFetchAlreadyRegistered(selectedEvent, combinedData);

  const handleSelectEvent = useCallback(() => {
    setselectedEvent(eventId);
  }, [eventId]);

  const handleRemoveAttendee = (attendeeID) => {
    if (!attendedList) return;
    removeAttendee(attendeeID);
    form.setValue(
      "parents",
      (form.getValues("parents") || []).filter((item) => item.id !== attendeeID)
    );
    form.setValue(
      "children",
      (form.getValues("children") || []).filter(
        (item) => item.id !== attendeeID
      )
    );
  };

  // Sync the form with attendedList when it changes
  useEffect(() => {
    if (attendedList) {
      const updatedParents = (form.getValues("parents") || []).filter(
        (parent) =>
          !attendedList.some((attended) => attended.attendee_id === parent.id)
      );

      const updatedChildren = (form.getValues("children") || []).filter(
        (child) =>
          !attendedList.some((attended) => attended.attendee_id === child.id)
      );

      form.setValue("parents", updatedParents);
      form.setValue("children", updatedChildren);
    }
  }, [attendedList, form]);

  // Handle checkbox change for checkboxes
  const handleParentCheckbox = (checked, parent, field) => {
    const updatedValue = checked
      ? [
          ...(field.value || []),
          {
            id: parent.id,
            first_name: parent.first_name,
            last_name: parent.last_name,
            contact_number: parent.contact_number,
            family_id: parent.family_id,
          },
        ]
      : (field.value || []).filter((item) => item.id !== parent.id);

    // This ensures state updates are handled asynchronously
    field.onChange(updatedValue);
  };

  const handleChildCheckBox = (checked, child, field) => {
    const updatedValue = checked
      ? [
          ...(field.value || []),
          {
            id: child.id,
            first_name: child.first_name,
            last_name: child.last_name,
            family_id: child.family_id,
          },
        ]
      : (field.value || []).filter((item) => item.id !== child.id);

    // This ensures state updates are handled asynchronously
    field.onChange(updatedValue);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={handleSelectEvent}>Attend</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${eventName}`}</DialogTitle>
          <Label>
            Date: {new Date(`${eventDate}T${eventTime}`).toDateTime()}
          </Label>
          <DialogDescription>
            Please choose who you would like to attend with.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-2"
            >
              {parentData?.length === 0 && childData?.length === 0 ? (
                <Label className="text-primary-text">Add Family Member</Label>
              ) : (
                <div className="flex flex-col space-y-3">
                  {parentData?.length > 0 && (
                    <Label className="text-primary-text">Parent/Guardian</Label>
                  )}
                  {!isLoading ? (
                    parentData?.map((parent) => (
                      <FormField
                        key={parent.id}
                        control={form.control}
                        name="parents"
                        render={({ field }) => (
                          <FormItem className="space-x-2 space-y-0">
                            <div className="flex items-center gap-x-3">
                              <FormControl>
                                {!(
                                  Array.isArray(attendedList) &&
                                  attendedList?.some(
                                    (attended) =>
                                      attended?.attendee_id === parent?.id
                                  )
                                ) && (
                                  <Checkbox
                                    checked={
                                      Array.isArray(field.value) &&
                                      field.value.some(
                                        (item) => item?.id === parent?.id
                                      )
                                    }
                                    onCheckedChange={(checked) =>
                                      handleChildCheckBox(
                                        checked,
                                        parent,
                                        field
                                      )
                                    }
                                    className="h-5 w-5"
                                  />
                                )}
                              </FormControl>
                              <Label>{`${parent.first_name} ${parent.last_name} ${userId === parent.parishioner_id ? "(You)" : ""}`}</Label>{" "}
                              {attendedList?.some(
                                (attended) =>
                                  attended?.attendee_id === parent?.id
                              ) && (
                                <div className="flex items-center gap-x-2">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveAttendee(parent?.id);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Icon
                                        className="h-5 w-5"
                                        icon="mingcute:question-line"
                                      />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                      <p>
                                        {`Click "Remove" to unregister the attendee from the event.`}
                                      </p>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              )}
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    ))
                  ) : (
                    <p>Loading...</p>
                  )}
                  {error && <p>Error fetching guardian</p>}
                  {form.formState.errors.children && (
                    <FormMessage>
                      {form.formState.errors.children.message}
                    </FormMessage>
                  )}
                  {childData?.length > 0 && (
                    <Label className="text-primary-text">Children</Label>
                  )}
                  {!isLoading ? (
                    childData?.map((child) => (
                      <FormField
                        key={child.id}
                        control={form.control}
                        name="children"
                        render={({ field }) => (
                          <>
                            <FormItem className="space-x-2 space-y-0">
                              <div className="flex items-center gap-x-2">
                                <FormControl>
                                  {!(
                                    Array.isArray(attendedList) &&
                                    attendedList.some(
                                      (attended) =>
                                        attended?.attendee_id === child?.id
                                    )
                                  ) && (
                                    <Checkbox
                                      checked={
                                        Array.isArray(field.value) &&
                                        field.value.some(
                                          (item) => item?.id === child?.id
                                        )
                                      }
                                      onCheckedChange={(checked) =>
                                        handleParentCheckbox(
                                          checked,
                                          child,
                                          field
                                        )
                                      }
                                      className="h-5 w-5"
                                    />
                                  )}
                                </FormControl>
                                <Label>{`${child.first_name} ${child.last_name}`}</Label>
                                {attendedList?.some(
                                  (attended) =>
                                    attended?.attendee_id === child?.id
                                ) && (
                                  <div className="flex items-center gap-x-2">
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveAttendee(child.id);
                                      }}
                                    >
                                      Remove
                                    </Button>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Icon
                                          className="h-5 w-5"
                                          icon="mingcute:question-line"
                                        />
                                      </PopoverTrigger>
                                      <PopoverContent>
                                        <p>
                                          {`Click "Remove" to unregister the attendee from the event.`}
                                        </p>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                )}
                              </div>
                            </FormItem>
                          </>
                        )}
                      />
                    ))
                  ) : (
                    <p>Loading...</p>
                  )}
                  {error && <p>Error fetching guardian</p>}
                  <div className="text-end">
                    <Button type="submit">Attend</Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ManualAttendEvents.propTypes = {
  eventId: PropTypes.string,
  eventName: PropTypes.string,
  eventTime: PropTypes.string,
  eventDate: PropTypes.string,
};

export default ManualAttendEvents;
