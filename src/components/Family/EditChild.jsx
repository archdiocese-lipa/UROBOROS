import { useState } from "react";
import PropTypes from "prop-types";
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
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import { useEditChild } from "@/hooks/useFamily";
import { editChildSchema } from "@/zodSchema/Family/EditChildSchema";

const EditChild = ({ childId, childFirstName, childLastName }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm({
    resolver: zodResolver(editChildSchema),
    defaultValues: {
      firstName: childFirstName,
      lastName: childLastName,
    },
  });

  const { mutate: editChild } = useEditChild();

  const onSubmit = (data) => {
    const childData = {
      firstName: data.firstName,
      lastName: data.lastName,
    };

    editChild({ childId, data: childData });
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger className="flex pl-2 text-sm">Edit</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Child Information</DialogTitle>
          <DialogDescription className="sr-only">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col gap-2 text-start md:flex-row">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <div className="flex justify-end gap-x-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Submit</Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

// Add PropTypes validation for childId prop
EditChild.propTypes = {
  childId: PropTypes.string.isRequired,
  childFirstName: PropTypes.string.isRequired,
  childLastName: PropTypes.string.isRequired, // Ensuring childId is a string and is required
};

export default EditChild;
