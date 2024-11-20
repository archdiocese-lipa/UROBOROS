import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { walkInRegisterSchema } from "@/zodSchema/WalkInRegisterSchema";

//Sample events from supabase
//Check mo mark kapag ganito yung binibigay ng supabase sayo
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

const WalkInRegistration = () => {
  const form = useForm({
    resolver: zodResolver(walkInRegisterSchema),
    defaultValues: {
      event: "",
      parents: [
        {
          parentFirstName: "",
          parentLastName: "",
          parentContactNumber: "",
          isMainApplicant: false,
        },
      ],
      children: [
        {
          childFirstName: "",
          childLastName: "",
        },
      ],
    },
  });

  // Separate field arrays for parents and children
  const {
    fields: parentFields,
    append: addParent,
    remove: removeParent,
  } = useFieldArray({
    control: form.control,
    name: "parents",
  });

  const {
    fields: childFields,
    append: addChild,
    remove: removeChild,
  } = useFieldArray({
    control: form.control,
    name: "children",
  });

  // Add parent function
  const addParentField = () => {
    addParent({
      parentFirstName: "",
      parentLastName: "",
      parentContactNumber: "",
      isMainApplicant: false,
    });
  };

  // Add child function
  const addChildField = () => {
    addChild({
      childFirstName: "",
      childLastName: "",
    });
  };

  const onSubmit = (values) => {
    console.log(values);
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Walk - In Register</Button>
      </DialogTrigger>
      <DialogContent className="no-scrollbar max-h-[45rem] overflow-scroll sm:max-w-2xl md:max-h-[38rem]">
        <DialogHeader>
          <DialogTitle>Walk-In Registration</DialogTitle>
          <DialogDescription>Register for upcoming events.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              {/* Event Name */}
              <Label className="text-lg">Upcoming Events</Label>
              <FormField
                control={form.control}
                name="event"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Event" />
                        </SelectTrigger>
                        <SelectContent>
                          {upcomingEvents.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.name} - {formatDateTime(event.dateTime)}
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
              <Label className="text-lg">Parent/Guardian Information </Label>
              <span className="hidden text-sm italic text-zinc-400 md:block">
                (Check the box on the left to choose the main applicant).
              </span>
              {parentFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col gap-2 sm:flex-row sm:items-start"
                >
                  <div className="flex items-center">
                    <FormField
                      control={form.control}
                      name={`parents[${index}].isMainApplicant`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row-reverse items-center md:flex-1">
                          <FormLabel className="sm:hidden">
                            Check the box choose the main applicant.
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                field.onChange(isChecked);
                                if (isChecked) {
                                  // Uncheck all other checkboxes
                                  parentFields.forEach((_, i) => {
                                    if (i !== index) {
                                      form.setValue(
                                        `parents[${i}].isMainApplicant`,
                                        false
                                      );
                                    }
                                  });
                                }
                              }}
                              className="h-3 w-5"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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

                  {/* Remove Button for each parent field */}
                  {parentFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeParent(index)}
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
                  <FormField
                    control={form.control}
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
                  <FormField
                    control={form.control}
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
                      onClick={() => removeChild(index)}
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
                  <DialogClose>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Submit</Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalkInRegistration;
