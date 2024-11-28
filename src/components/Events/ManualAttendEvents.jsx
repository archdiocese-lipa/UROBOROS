import { useState } from "react";
import PropTypes from "prop-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
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
  useFetchChildren,
  useFetchFamilyId,
  useFetchGuardian,
} from "@/hooks/useFetchFamily";
import useGuardianManualAttendEvent from "@/hooks/useManualAttendEvent";

// Zod schema for form validation
const formSchema = z.object({
  parents: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .nonempty("You must select at least one parent."), // Validation rule
});

const ManualAttendEvents = ({ eventId, eventName, eventDescription }) => {
  const [selectedEvent, setselectedEvent] = useState("");

  const { userData } = useUser();
  const userId = userData?.id;

  // Fetch familyId based on the userId
  const {
    data: familyData,
    isLoading: isFamilyLoading,
    error: _familyError,
  } = useFetchFamilyId(userId);

  // Fetch guardian data based on familyId
  const {
    data: parentData,
    isLoading: isParentLoading,
    error: _parentError,
  } = useFetchGuardian(familyData?.id);

  // Fetch child data based on familyId
  const {
    data: _childData,
    isLoading: isChildLoading,
    error: _childError,
  } = useFetchChildren(familyData?.id);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parents: [],
    },
  });

  const { mutate: guardianManualAttend } = useGuardianManualAttendEvent();

  const onSubmit = (data) => {
    const parentsData = data.parents.map((parent) => ({
      ...parent,
      event_id: selectedEvent,
      attendee_type: "parents",
      attended: false,
    }));
    guardianManualAttend(parentsData);
  };

  const handleSelectEvent = () => {
    setselectedEvent(eventId);
  };

  // Show loading or error states
  if (isFamilyLoading || isParentLoading || isChildLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={handleSelectEvent}>Attend</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{eventName}</DialogTitle>
          <DialogDescription>
            {eventDescription}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-2"
            >
              <Label className="text-primary-text">Parent/Guardian</Label>
              {parentData?.map((parent) => (
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
                              field.value.some((item) => item.id === parent.id) // Check if the array contains the object with the same id
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
                      </div>
                    </FormItem>
                  )}
                />
              ))}
              <div className="text-end">
                <Button type="submit">Submit</Button>
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
  eventDescription: PropTypes.string,
};

export default ManualAttendEvents;
