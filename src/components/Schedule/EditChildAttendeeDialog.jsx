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

const EditChildAttendeeDialog = ({
  disableSchedule,
  childrenForm,
  attendee,
  onSubmit,
//   setIdEditting
}) => {
  const [childAttendeeEdit, setChildAttendeeEdit] = useState("");
  return (
    <Dialog open={childAttendeeEdit} onOpenChange={setChildAttendeeEdit}>
      {!disableSchedule && (
        <DialogTrigger>
          <Button
            type="button"
            onClick={() => {
              childrenForm.setValue("first_name", `${attendee.first_name}`);
              childrenForm.setValue("last_name", `${attendee.last_name}`);
            //   setIdEditting(attendee.id);
              setChildAttendeeEdit(true);
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
          <DialogTitle>Edit Child Attendee</DialogTitle>
          <DialogDescription>Edit child attendee details</DialogDescription>
        </DialogHeader>
        <Form {...childrenForm}>
          <form
            onSubmit={childrenForm.handleSubmit((data) => {
              onSubmit(data, attendee.id), setChildAttendeeEdit(false);
            })}
          >
            <FormField
              control={childrenForm.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={childrenForm.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-2 flex justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

EditChildAttendeeDialog.propTypes = {
  disableSchedule: PropTypes.bool.isRequired, 
  childrenForm: PropTypes.object.isRequired, 
  attendee: PropTypes.shape({
    id: PropTypes.string.isRequired, 
    first_name: PropTypes.string.isRequired, 
    last_name: PropTypes.string.isRequired, 
  }).isRequired, 
  onSubmit: PropTypes.func.isRequired, 
};

export default EditChildAttendeeDialog;
