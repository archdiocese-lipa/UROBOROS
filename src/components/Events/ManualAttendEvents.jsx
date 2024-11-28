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
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/useUser";
import {
  useFetchChildren,
  useFetchFamilyId,
  useFetchGuardian,
} from "@/hooks/useFetchFamily";

// Zod schema for form validation
const formSchema = z.object({
  parents: z
    .array(z.string()) // Validates an array of strings (IDs)
    .min(1, "At least one attendee is required"), // Ensures the array has at least one item
});

const ManualAttendEvents = ({ eventId }) => {
  const [_selectedEvent, setselectedEvent] = useState("");

  const { userData } = useUser();
  const userId = userData?.id;

  const { toast } = useToast();

  // Fetch familyId based on the userId
  const {
    data: familyData,
    isLoading: isFamilyLoading,
    error: familyError,
  } = useFetchFamilyId(userId);

  // Fetch guardian data based on familyId
  const {
    data: parentData,
    isLoading: isParentLoading,
    error: parentError,
  } = useFetchGuardian(familyData?.id);

  // Fetch child data based on familyId
  const {
    data: _childData,
    isLoading: isChildLoading,
    error: childError,
  } = useFetchChildren(familyData?.id);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parents: [], // Default value is an empty array
    },
  });

  const onSubmit = (data) => {
    // Since Zod validation is already being handled, we don't need to manually check the array length.
    if (data.parents.length > 0) {
      console.log(data.parents);
      toast({
        title: "Form Submitted!",
        description: "You have successfully chosen to attend the event.",
      });
    } else {
      toast({
        title: "Form Error!",
        description: "You need to select at least one attendee.",
        variant: "destructive",
      });
    }
  };

  const handleSelectEvent = () => {
    setselectedEvent(eventId);
  };

  // Show loading or error states
  if (isFamilyLoading || isParentLoading || isChildLoading) {
    return <div>Loading...</div>;
  }

  if (familyError || parentError || childError) {
    return (
      <div>
        <p>Error loading data.</p>
        {familyError && <p>{familyError.message}</p>}
        {parentError && <p>{parentError.message}</p>}
        {childError && <p>{childError.message}</p>}
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={handleSelectEvent}>Attend</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <Label className="text-primary-text">Parent/Guardian</Label>
              {parentData.map((parent) => (
                <FormField
                  key={parent.id}
                  control={form.control}
                  name="parents" // Use a plural name to allow for multiple selections
                  render={({ field }) => (
                    <FormItem className="space-x-2 space-y-0">
                      <div className="flex items-center gap-x-2">
                        <FormControl>
                          <Checkbox
                            checked={
                              Array.isArray(field.value) &&
                              field.value.includes(parent.id)
                            } // Check if parent.id is in the array
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [
                                    ...new Set([
                                      ...(field.value || []),
                                      parent.id,
                                    ]),
                                  ] // Add parent.id if checked
                                : (field.value || []).filter(
                                    (id) => id !== parent.id
                                  ); // Remove parent.id if unchecked

                              // Update the field value asynchronously to avoid immediate re-renders
                              setTimeout(() => {
                                field.onChange(updatedValue); // Update the field value after the render cycle
                              }, 0);
                            }}
                          />
                        </FormControl>
                        <Label>{`${parent.first_name} ${parent.last_name}`}</Label>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ManualAttendEvents.propTypes = {
  eventId: PropTypes.string.isRequired,
};

export default ManualAttendEvents;
