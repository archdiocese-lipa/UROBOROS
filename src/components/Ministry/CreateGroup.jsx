import PropTypes from "prop-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import CustomReactSelect from "../CustomReactSelect";
import { ROLES } from "@/constants/roles";
import { useQuery } from "@tanstack/react-query";
import { getUsersByRole } from "@/services/userService";
import { useUser } from "@/context/useUser";
import useGroups from "@/hooks/useGroups";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const createGroupSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required.",
  }),
  description: z.string().optional(),
  members: z.array(z.string()).optional(),
});

const CreateGroup = ({ ministryId }) => {
  const [openDialog, setOpendialog] = useState(false);
  const { userData } = useUser();

  const { data: coparents, isLoading: coparentsLoading } = useQuery({
    queryKey: ["coparent"],
    queryFn: async () => getUsersByRole(ROLES[3]),
  });

  const { data: parishioners, isLoading: parishionerLoading } = useQuery({
    queryKey: ["parishioner"],
    queryFn: async () => getUsersByRole(ROLES[2]),
  });

  const { data: volunteers, isLoading: volunteersLoading } = useQuery({
    queryKey: ["volunteer"],
    queryFn: async () => getUsersByRole(ROLES[1]),
  });

  const isLoadingMembers =
    coparentsLoading || parishionerLoading || volunteersLoading;

  const groupMembers = [
    ...(coparents ?? []),
    ...(volunteers ?? []),
    ...(parishioners ?? []),
  ];

  const member = groupMembers?.map((user) => ({
    value: user.id,
    label: `${user.first_name} ${user.last_name}`,
  }));

  const form = useForm({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      members: [],
    },
  });

  const { createGroupMutation } = useGroups({ ministryId });
  const isCreatingGroup = createGroupMutation.isPending;

  const onSubmit = (data) => {
    createGroupMutation.mutate(
      {
        ministryId,
        name: data.name,
        description: data.description,
        created_by: userData?.id,
        members: data.members,
      },
      {
        onSuccess: () => {
          setOpendialog(false);
          form.reset();
        },
      }
    );
  };

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpendialog}>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          className="rounded-xl bg-primary-outline/30 text-primary-text"
          size="sm"
        >
          New Group
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="no-scrollbar max-h-[38rem] overflow-scroll px-6 py-4 text-primary-text">
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle>Create New Group</AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your group..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    Members
                    {isLoadingMembers && (
                      <span className="ml-2 inline-block h-4 w-4">
                        <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <CustomReactSelect
                      isLoading={isLoadingMembers}
                      onChange={(selectedOptions) =>
                        field.onChange(
                          selectedOptions?.map((option) => option.value) || []
                        )
                      }
                      options={member}
                      value={member.filter((option) =>
                        field.value?.includes(option.value)
                      )}
                      placeholder={
                        isLoadingMembers
                          ? "Loading members..."
                          : "Select Members..."
                      }
                      isMulti
                      isDisabled={isLoadingMembers}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-x-2">
              <div>
                <AlertDialogCancel className="m-0" disabled={isCreatingGroup}>
                  Cancel
                </AlertDialogCancel>
              </div>

              <Button type="submit" disabled={isCreatingGroup}>
                {isCreatingGroup ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Done"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

CreateGroup.propTypes = {
  ministryId: PropTypes.string.isRequired,
};

export default CreateGroup;
