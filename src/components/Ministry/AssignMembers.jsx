import PropTypes from "prop-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { assignMinistryMemberSchema } from "@/zodSchema/AssignMinistryMemberSchema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const options = [
  { value: "john_doe", label: "John Doe" },
  { value: "jane_doe", label: "Jane Doe" },
  { value: "mark_smith", label: "Mark Smith" },
];

const AssignMembers = ({ title }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();

  const members = useForm({
    resolver: zodResolver(assignMinistryMemberSchema),
    defaultValues: {
      newMember: [],
    },
  });

  const onSubmit = (values) => {
    // Log values to check the submission
    console.log("Form submitted with values:", values);
    setOpenDialog(false);
    toast({
        description: "Successfully added a new member.",
      });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>Assign Members</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-normal">
            Assign members to <span className="font-bold">{`"${title}"`}</span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <Form {...members}>
          <form onSubmit={members.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={members.control}
              name="newMember"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add new member</FormLabel>
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
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

AssignMembers.propTypes = {
  title: PropTypes.string.isRequired,
};

export default AssignMembers;
