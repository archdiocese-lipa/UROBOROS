import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { editRegistrationSchema } from "@/zodSchema/EditRegistrationSchema";

import { fetchAttendeesByTicketCode } from "@/services/attendanceService";
import { handleWalkInData } from "@/services/walkInService";
import { EditSchema } from "@/zodSchema/EditSchema";
// Sample events and registered users for demonstration
const events = [
  {
    id: "event1",
    name: "Children's Liturgy",
    dateTime: "2024-11-20T04:39:00Z",
  },
  {
    id: "event2",
    name: "Youth Choir Practice",
    dateTime: "2024-12-21T14:00:00Z",
  },
  {
    id: "event3",
    name: "Evening Mass",
    dateTime: "2024-12-20T18:00:00Z",
  },
];

// Attendance Coming from the database

const EditRegistration = () => {
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [removedParents, setRemovedParents] = useState([]);
  const [removedChildren, setRemovedChildren] = useState([]);

  const { toast } = useToast();

  const handleRemoveParent = (index) => {
    const removedParent = parentFields[index]; // Get the parent data
    setRemovedParents((prev) => [...prev, removedParent]); // Add to removedParents list
    removeParent(index); // Call the remove function from useFieldArray
  };

  const handleRemoveChild = (index) => {
    const removedChild = childFields[index]; // Get the child data
    setRemovedChildren((prev) => [...prev, removedChild]); // Add to removedChildren list
    removeChild(index); // Call the remove function from useFieldArray
  };

  //Registration Code Form
  const registrationForm = useForm({
    resolver: zodResolver(editRegistrationSchema),
    defaultValues: {
      registrationCode: "",
    },
  });
  // Form setup with react-hook-form and Zod validation
  const attendeeInformation = useForm({
    resolver: zodResolver(EditSchema),
    defaultValues: {
      event: "",
      eventId: "",
      ticketCode: "", // Ensure ticketCode is part of default values
      parents: [
        {
          parentFirstName: "",
          parentLastName: "",
          parentContactNumber: "",
          isMainApplicant: false,
          id: "",
        },
      ],
      children: [{ childFirstName: "", childLastName: "", id: "" }],
    },
  });

  const handleRegistrationCodeSubmit = async (data) => {
    try {
      // Trim and pass the ticketCode from the form data
      const result = await fetchAttendeesByTicketCode(
        data.registrationCode.trim()
      );

      if (result.success && result.data) {
        const user = result.data;

        setIsCodeValid(true);
        registrationForm.reset({ registrationCode: "" }); // Reset the form's registrationCode field

        // Ensure the IDs are correctly passed
        attendeeInformation.setValue("eventId", user.eventId);
        attendeeInformation.setValue("event", user.event);

        // Pass the ticket code into the form data
        attendeeInformation.setValue("ticketCode", user.registrationCode);

        // Set parent and child values with IDs and the rest of the information
        attendeeInformation.setValue(
          "parents",
          user.parents.map((parent) => ({
            ...parent,
            id: parent.id || "default_parent_id", // Ensure parent has an ID if missing
          }))
        );

        attendeeInformation.setValue(
          "children",
          user.children.map((child) => ({
            id: child.id || "default_child_id", // Ensure child has an ID if missing
            childFirstName: child.childFirstName,
            childLastName: child.childLastName,
          }))
        );
      } else {
        toast({
          title: "Registration Code Error",
          description: result.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error handling registration code:", error.message);
      toast({
        title: "Server Error",
        description:
          "Unable to fetch data at the moment. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Function to submit editted user information
  const onSubmit = async (values) => {
    const { eventId, ticketCode } = values;

    // Data to create or update
    const parentsToCreate = [];
    const parentsToUpdate = [];
    const childrenToCreate = [];
    const childrenToUpdate = [];

    // Separate parents into create or update
    values.parents.forEach((parent) => {
      if (parent.id) {
        parentsToUpdate.push({ ...parent, eventId, ticketCode });
      } else {
        parentsToCreate.push({
          ...parent,
          id: undefined,
          eventId,
          ticketCode,
        });
      }
    });

    // Separate children into create or update
    values.children.forEach((child) => {
      if (child.id) {
        childrenToUpdate.push({ ...child, eventId, ticketCode });
      } else {
        childrenToCreate.push({
          ...child,
          id: undefined,
          eventId,
          ticketCode,
        });
      }
    });

    // Include the removed parents and children in the request
    try {
      await handleWalkInData({
        eventId,
        ticketCode,
        parents: [
          ...parentsToCreate,
          ...parentsToUpdate,
          ...removedParents.map((removed) => ({
            ...removed,
            eventId,
            ticketCode,
            _deleted: true,
          })),
        ],
        children: [
          ...childrenToCreate,
          ...childrenToUpdate,
          ...removedChildren.map((removed) => ({
            ...removed,
            eventId,
            ticketCode,
            _deleted: true,
          })),
        ],
      });

      // Success toast
      toast({
        title: "Registration Updated Successfully",
        description: "The registration details have been updated successfully.",
      });
    } catch (error) {
      console.error("Error processing data:", error);
      toast({
        title: "Error Processing Data",
        description:
          "An error occurred while processing the registration details.",
      });
    }
  };

  const {
    fields: parentFields,
    append: addParent,
    remove: removeParent,
  } = useFieldArray({
    control: attendeeInformation.control,
    name: "parents",
  });

  const {
    fields: childFields,
    append: addChild,
    remove: removeChild,
  } = useFieldArray({
    control: attendeeInformation.control,
    name: "children",
  });

  // Add parent function
  const addParentField = () => {
    addParent({
      parentId: "",
      parentFirstName: "",
      parentLastName: "",
      parentContactNumber: "",
      isMainApplicant: false,
    });
  };

  // Add child function
  const addChildField = () => {
    addChild({
      childId: "",
      childFirstName: "",
      childLastName: "",
    });
  };

  //Format the date
  const formatDateTime = (dateTime) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date(dateTime));
  };

  // Get current time
  const now = new Date();

  // Removing the past two hours event
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  // Filter events
  const upcomingEvents = events.filter((event) => {
    const eventTime = new Date(event.dateTime);
    return eventTime >= twoHoursAgo;
  });

  // Reset the forms when closing the dialog

  const handleDialogChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      registrationForm.reset();
      attendeeInformation.reset();
      setIsCodeValid(false);
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <Button variant="secondary">Edit Registration</Button>
        </DialogTrigger>
        <DialogContent
          className={`no-scrollbar max-w-96 overflow-scroll ${isCodeValid ? "sm:max-w-2xl md:max-h-[38rem]" : "max-h-[45rem]"}`}
        >
          <DialogHeader>
            <DialogTitle>
              {isCodeValid ? "Edit Registration" : "Edit Registration"}
            </DialogTitle>
            <DialogDescription>
              Update your registration details as needed.
            </DialogDescription>
          </DialogHeader>
          {isCodeValid ? (
            <div className="flex flex-col gap-y-4">
              <Form {...attendeeInformation}>
                <form
                  onSubmit={attendeeInformation.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  {/* Event Name */}
                  <Label className="text-lg">Upcoming Events</Label>
                  <FormField
                    control={attendeeInformation.control}
                    name="event"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value} // fallback to empty string
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Event" />
                            </SelectTrigger>
                            <SelectContent>
                              {upcomingEvents.map((event) => (
                                <SelectItem key={event.id} value={event.id}>
                                  {event.name} -{" "}
                                  {formatDateTime(event.dateTime)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Parent Guardian Field */}
                  <Label className="text-lg">
                    Parent/Guardian Information{" "}
                  </Label>
                  <span className="hidden text-sm italic text-zinc-400 md:block">
                    (Check the box on the left to choose the main applicant).
                  </span>
                  {parentFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex flex-col gap-2 sm:flex-row sm:items-start"
                    >
                      {/* Parent ID (Read-Only Display) */}
                      <FormField
                        control={attendeeInformation.control}
                        name={`parents[${index}].id`}
                        render={({ field }) => (
                          <FormItem
                            className="flex-1"
                            style={{ display: "none" }}
                          >
                            {" "}
                            {/* Hide this input */}
                            <FormControl>
                              <Input placeholder="ID" {...field} readOnly />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={attendeeInformation.control}
                        name={`parents[${index}].parentFirstName`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={attendeeInformation.control}
                        name={`parents[${index}].parentLastName`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Last Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={attendeeInformation.control}
                        name={`parents[${index}].parentContactNumber`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Contact Tel No." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {parentFields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleRemoveParent(index)} // Use the updated function
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}

                  {/* Button to add another parent/guardian */}
                  <div className="flex justify-end gap-2">
                    <Button type="button" size="sm" onClick={addParentField}>
                      Add Parent/Guardian
                    </Button>
                  </div>
                  <Label className="text-lg">Child Information </Label>
                  {childFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex flex-col gap-2 sm:flex-row sm:items-start"
                    >
                      {/* Child ID (Read-Only Display) */}
                      <FormField
                        control={attendeeInformation.control}
                        name={`children[${index}].id`}
                        render={({ field }) => (
                          <FormItem
                            className="flex-1"
                            style={{ display: "none" }}
                          >
                            {/* Hide this input */}
                            <FormControl>
                              <Input placeholder="ID" {...field} readOnly />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* First Name */}
                      <FormField
                        control={attendeeInformation.control}
                        name={`children[${index}].childFirstName`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Last Name */}
                      <FormField
                        control={attendeeInformation.control}
                        name={`children[${index}].childLastName`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Last Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Remove Button for each child field */}
                      {childFields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleRemoveChild(index)} // Use the updated function
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}

                  <div className="flex justify-end gap-2">
                    <Button type="button" size="sm" onClick={addChildField}>
                      Add Child
                    </Button>
                  </div>
                  <DialogFooter>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleDialogChange}>
                        Cancel
                      </Button>
                      <Button type="submit">Submit</Button>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          ) : (
            <Form {...registrationForm}>
              <form
                onSubmit={registrationForm.handleSubmit(
                  handleRegistrationCodeSubmit
                )}
                className="space-y-8"
              >
                <FormField
                  control={registrationForm.control}
                  name="registrationCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Code</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        Enter the registration code provided after your walk-in
                        registration to edit your details.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="gap-y-2">
                  <Button variant="outline" onClick={handleDialogChange}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditRegistration;
