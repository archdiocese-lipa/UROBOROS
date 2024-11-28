import { useState } from "react";
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
  useMainApplicantAttendEvent,
} from "@/hooks/useManualAttendEvent";
import { useFamilyData } from "@/hooks/useFamilyData";
import { manualAttendEventsSchema } from "@/zodSchema/ManualAttendEventsSchema";

const ManualAttendEvents = ({ eventId, eventName }) => {
  const [selectedEvent, setselectedEvent] = useState(""); // set the selected event

  const { userData } = useUser(); // Get the userId
  const userId = userData?.id;

  const { parentData, childData, isLoading, error } = useFamilyData(); // Fetch family data

  const form = useForm({
    resolver: zodResolver(manualAttendEventsSchema),
    defaultValues: {
      parents: [],
      children: [],
    },
  });

  const { mutate: mainApplicantAttend } = useMainApplicantAttendEvent();
  const { mutate: guardianManualAttend } = useGuardianManualAttendEvent();
  const { mutate: childrenManualAttend } = useChildrenManualAttendance();

  const onSubmit = (data) => {
    // Main applicant data (always included)
    const mainApplicant = [
      {
        attendee_id: userId,
        event_id: selectedEvent,
        attendee_type: "parents",
        attended: false,
        main_applicant: true,
      },
    ];
    // Guardian (parent) data, only map if there are parents selected
    const parentsData =
      data.parents?.map((parent) => ({
        ...parent,
        event_id: selectedEvent,
        attendee_type: "parents",
        attended: false,
        main_applicant: false,
      })) || [];

    const childrenData = data.children?.map((children) => ({
      ...children,
      event_id: selectedEvent,
      attendee_type: "children",
      attended: false,
      main_applicant: false,
    }));

    mainApplicantAttend(mainApplicant);
    guardianManualAttend(parentsData);
    childrenManualAttend(childrenData);
  };

  const handleSelectEvent = () => {
    setselectedEvent(eventId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={handleSelectEvent}>Attend</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{eventName}</DialogTitle>
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
              <Label className="text-primary-text">Parent/Guardian</Label>
              {!isLoading ? (
                parentData?.map((parent) => (
                  <FormField
                    key={parent.id}
                    control={form.control}
                    name="parents"
                    render={({ field }) => (
                      <FormItem className="space-x-2 space-y-0">
                        <div className="flex items-center gap-x-2">
                          <FormControl>
                            <Checkbox
                              checked={
                                Array.isArray(field.value) &&
                                field.value.some(
                                  (item) => item.id === parent.id
                                ) // Check if the array contains the object with the same id
                              }
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [
                                      ...(field.value || []),
                                      {
                                        id: parent.id,
                                      },
                                    ]
                                  : (field.value || []).filter(
                                      (item) => item.id !== parent.id
                                    ); // Remove the object if unchecked

                                // Update the field value
                                field.onChange(updatedValue);
                              }}
                            />
                          </FormControl>
                          <Label>{`${parent.first_name} ${parent.last_name}`}</Label>
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
              <Label className="text-primary-text">Children</Label>

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
                              <Checkbox
                                checked={
                                  Array.isArray(field.value) &&
                                  field.value.some(
                                    (item) => item.id === child.id
                                  ) // Check if the array contains the object with the same id
                                }
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [
                                        ...(field.value || []),
                                        {
                                          id: child.id,
                                        },
                                      ]
                                    : (field.value || []).filter(
                                        (item) => item.id !== child.id
                                      ); // Remove the object if unchecked

                                  // Update the field value
                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <Label>{`${child.first_name} ${child.last_name}`}</Label>
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
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ManualAttendEvents.propTypes = {
  eventId: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
};

export default ManualAttendEvents;
