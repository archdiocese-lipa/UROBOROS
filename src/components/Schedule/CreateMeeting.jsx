import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Select from "react-select";
import TimePicker from "./TimePicker";
import { createMeetingSchema } from "@/zodSchema/CreateMeetingSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users } from "@/assets/icons/icons";
import { Textarea } from "../ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Dummy participants
const options = [
  { value: "john_doe", label: "John Doe" },
  { value: "jane_doe", label: "Jane Doe" },
  { value: "mark_smith", label: "Mark Smith" },
];

const CreateMeeting = () => {
  const { toast } = useToast();

  const meetingForm = useForm({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: {
      meetingName: "",
      participants: [],
      location: "",
      date: null,
      time: "",
      details: "",
    },
  });

  const onSubmit = (data) => {
    // This will rely on runtime validation from Zod.
    try {
      // Simulating success
      toast({
        title: "Meeting Created",
        description: `Meeting "${data.meetingName}" created successfully!`,
      });
      console.log(data);
    } catch (error) {
      // Handle error
      toast({
        title: "Meeting Creation Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="primary" className="px-3.5 py-2">
          <Users className="text-primary" />
          <p>Create Meeting</p>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Meeting</DialogTitle>
          <DialogDescription>Schedule a new meeting.</DialogDescription>
        </DialogHeader>
        {/* Meeting Form */}
        <div>
          <Form {...meetingForm}>
            <form
              onSubmit={meetingForm.handleSubmit(onSubmit)}
              className="space-y-2"
            >
              <div>
                <FormField
                  control={meetingForm.control}
                  name="meetingName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Name</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Participants */}
              <FormField
                control={meetingForm.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participants</FormLabel>
                    <FormControl>
                      <Select
                        isMulti
                        options={options}
                        value={options.filter((option) =>
                          field.value.includes(option.value)
                        )}
                        onChange={(selected) =>
                          field.onChange(selected.map((option) => option.value))
                        }
                        placeholder="Select participants"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date & TIme */}
              <div className="sm:flex sm:flex-wrap sm:gap-2">
                <FormField
                  control={meetingForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
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

                <FormField
                  control={meetingForm.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex-1 space-y-0">
                      <FormLabel>Event Time</FormLabel>
                      <FormControl>
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

              {/* Location */}
              <FormField
                control={meetingForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <span className="font-light"> (Optional)</span>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Details */}
              <FormField
                control={meetingForm.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <span className="font-light"> (Optional)</span>
                    <FormControl>
                      <Textarea
                        placeholder="Enter additional details (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <div className="flex justify-end gap-x-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Create</Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMeeting;
