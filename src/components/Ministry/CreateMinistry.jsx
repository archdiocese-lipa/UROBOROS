import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PuzzleIcon } from "@/assets/icons/icons";
import { createMinistrySchema } from "@/zodSchema/CreateMinistrySchema";
import { Textarea } from "../ui/textarea";
import useMinistry from "@/hooks/useMinistry";
import { ROLES } from "@/constants/roles";
import { useQuery } from "@tanstack/react-query";
import { getUsersByRole } from "@/services/userService";
import AssignVolunteerComboBox from "../Schedule/AssignVolunteerComboBox";

const CreateMinistry = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const { data } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => getUsersByRole(ROLES[0]),
  });

  const form = useForm({
    resolver: zodResolver(createMinistrySchema),
    defaultValues: {
      coordinators: "",
      ministryName: "",
      ministryDescription: "",
    },
  });

  const adminOptions = data?.map((admin) => ({
    value: admin.id,
    label: `${admin.first_name} ${admin.last_name}`,
  }));

  const { createMutation } = useMinistry({});

  const onSubmit = (values) => {
    createMutation.mutate(
      {
        coordinators: values.coordinators,
        ministry_name: values.ministryName,
        ministry_description: values.ministryDescription,
      },
      {
        onSuccess: () => {
          setOpenDialog(false);
        },
      }
    );
    form.reset();
  };

 
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="h-14 gap-x-1 rounded-2xl">
          <PuzzleIcon className="text-white" />
          <span>Create Ministry</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Ministry</DialogTitle>
          <DialogDescription>
            Add details about this Ministry.{" "}
            <span className="text-xs italic">
              {"(this can be edited later)"}
            </span>
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 text-start"
            >
              <FormField
                control={form.control}
                name="coordinators"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coordinators</FormLabel>
                    <FormControl>
                      <AssignVolunteerComboBox
                        placeholder="Select Coordinators"
                        value={field.value || []}
                        onChange={(value) => field.onChange(value)}
                        options={adminOptions}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ministryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ministry Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ministry Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name of the ministry.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ministryDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description
                      <span className="font-light italic">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Maximum of 128 characters"
                        {...field}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-x-2">
                <DialogClose asChild>
                  <Button onClick={() => form.reset()} variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={createMutation.isLoading}>
                  {createMutation.isPending ? "Creating..." : "Submit"}
                </Button>
              </div>
              {createMutation.isError && (
                <p className="text-red-500">
                  Error: {createMutation.error.message}
                </p>
              )}
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMinistry;
