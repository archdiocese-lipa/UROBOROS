import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { addSingleAttendee } from "@/services/attendanceService";
import { useUser } from "@/context/useUser";
import { Toast } from "../ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { childSchema, parentSchema } from "@/zodSchema/AddFamilySchema";

const AddAttendee = ({
  attendee_type,
  family_id,
  family_surname,
  event_id,
}) => {
  const { userData } = useUser();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const addAttendeeMutation = useMutation({
    mutationFn: async (data) => addSingleAttendee(data),
    onSuccess: () => {
      Toast({
        title: "Attendee added successfully",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", event_id],
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(
      attendee_type === "parents" ? parentSchema : childSchema
    ),
    defaultValues: {
      first_name: "",
      last_name: "",
      contact_number: "",
    },
  });

  const onSubmit = (attendeeData) => {
    addAttendeeMutation.mutate({
      attendeeData,
      family_id,
      editedby_id: userData.id,
      attendee_type,
      event_id,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="p-3" size="sm">
          <Icon className="h-5 w-5" icon="mingcute:add-fill"></Icon>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add {attendee_type === "parents" ? "Parent/Guardian" : "Child"}
          </DialogTitle>
          <DialogDescription>
            Add a {attendee_type === "parents" ? "Parent/Guardian" : "child"} to{" "}
            {`${family_surname}`}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            {attendee_type === "parents" && (
              <FormField
                control={form.control}
                name="contact_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact Number" {...field}></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            )}
            <div className="mt-2 flex justify-end">
              <Button type="submit">Add Parent</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

AddAttendee.propTypes = {
  attendee_type: PropTypes.string.isRequired,
  family_id: PropTypes.string.isRequired,
  family_surname: PropTypes.string.isRequired,
  event_id: PropTypes.string.isRequired,
};

export default AddAttendee;
