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
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "@/components/ui/select";
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
import { EventIcon } from "@/assets/icons/icons";
import { Input } from "../ui/input";

const formSchema = z.object({
  eventName: z.string().min(2).max(50),
});

const NewCreateEventForm = () => {
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <AlertDialog>
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
                        <Input placeholder="Enter event name here" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p>item2</p>
              </div>
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

export default NewCreateEventForm;
