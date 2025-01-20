import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Input } from "../ui/input";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { parentSchema } from "@/zodSchema/AddFamilySchema";


const EditAttendeeDialog = ({ attendee, onSubmit, disableSchedule }) => {
  const [attendeeEdit, setAttendeeEdit] = useState(false);


  // Conditionally omit 'contact_number' field if attendee is a children
  const schema = attendee.attendee_type === "children"
    ? parentSchema.omit({ contact_number: true }) 
    : parentSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      contact_number: "",
    },
  });

  return (
    <Dialog open={attendeeEdit} onOpenChange={setAttendeeEdit}>
      {!disableSchedule && (
        <DialogTrigger asChild>
          <Button
            type="button"
            onClick={() => {
              form.setValue("first_name", attendee.first_name || "");
              form.setValue("last_name", attendee.last_name || "");
              if (attendee.attendee_type !== "children") {
                form.setValue("contact_number", attendee.contact_number || "");
              }
              setAttendeeEdit(true);
            }}
            variant="ghost"
            disabled={disableSchedule}
          >
            <Icon
              className="h-5 w-5 text-accent"
              disabled={disableSchedule}
              icon={"eva:edit-2-fill"}
            />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Parent Attendee</DialogTitle>
          <DialogDescription>Edit attendee information</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              onSubmit(data, attendee.id);
              setAttendeeEdit(false);
            })}
          >
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      className="text-accent"
                      placeholder="First name"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      className="text-accent"
                      placeholder="Last name"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {attendee.attendee_type !== "children" && (
              <FormField
                control={form.control}
                name="contact_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input
                        className="text-accent"
                        placeholder="Contact"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="mt-2 flex justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

EditAttendeeDialog.propTypes = {
  attendee: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    contact_number: PropTypes.string,
    attendee_type: PropTypes.oneOf(["parent", "children"]).isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  disableSchedule: PropTypes.bool.isRequired,
};

export default EditAttendeeDialog;
