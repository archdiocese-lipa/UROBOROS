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
import { assignMinistryMemberSchema } from "@/zodSchema/AssignMinistryMemberSchema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchAvailableVolunteers } from "@/services/ministryService";
import { useQuery } from "@tanstack/react-query";
import useMinistry from "@/hooks/useMinistry";
import CustomReactSelect from "../CustomReactSelect";

const AssignMembers = ({ ministryId, title }) => {
  const { AssignMinistryVolunteerMutation } = useMinistry({});

  // const { availableVolunteers } = useFetchAvailableVolunteers(ministryId);

  const { data } = useQuery({
    queryKey: ["availableVolunteers", ministryId], // The query key includes the ministryId to make it unique
    queryFn: () => fetchAvailableVolunteers(ministryId), // The fetch function with ministryId
    enabled: !!ministryId, // Only run the query if ministryId is provided
  });

  const options = data?.map((volunteer) => ({
    value: volunteer.id, // Use the volunteer's ID as the value
    label: `${volunteer.first_name} ${volunteer.last_name}`, // Combine first and last names as the label
  }));

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

    // Ensure that `ministryId` is included in the form data
    const formData = {
      ministryId, // Pass the ministryId explicitly
      newMembers: values.newMember, // Pass the selected new members
    };

    // Log the form data

    // Pass formData to the mutation function
    AssignMinistryVolunteerMutation.mutate(formData);

    setOpenDialog(false); // Close the dialog
    toast({
      description: "New member(s) have been successfully added to the group.",
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
            Assign member to <span className="font-bold">{`"${title}"`}</span>
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
                    <CustomReactSelect
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
  ministryId: PropTypes.string.isRequired, // Ensure ministryId is passed as a prop
};

export default AssignMembers;
