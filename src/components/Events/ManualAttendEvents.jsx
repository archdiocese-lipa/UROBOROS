import PropTypes from "prop-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { useToast } from "@/hooks/use-toast";

// Zod schema for form validation
const formSchema = z.object({
  attendee: z.boolean().optional(),
});

const ManualAttendEvents = ({ eventId }) => {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attendee: false,
    },
  });

  const onSubmit = (data) => {
    if (data.attendee) {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => console.log(eventId)}>Attend</Button>
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
              <FormField
                control={form.control}
                name="attendee"
                render={({ field }) => (
                  <FormItem className="space-x-2 space-y-0">
                    <div className="flex items-center gap-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Franklin Sula</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
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
