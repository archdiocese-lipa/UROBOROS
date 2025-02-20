import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createMinistrySchema } from "@/zodSchema/CreateMinistrySchema";
import { Textarea } from "../ui/textarea";
import useMinistry from "@/hooks/useMinistry";
import CustomReactSelect from "../CustomReactSelect";
import { ROLES } from "@/constants/roles";
import { useQuery } from "@tanstack/react-query";
import { getUsersByRole } from "@/services/userService";

const CreateMinistry = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const { data: coordinators, isLoading:coordinatorLoading } = useQuery({
    queryKey: ["coordinators"],
    queryFn: async () => getUsersByRole(ROLES[0]),
  });
  const { data: admins,isLoading:adminLoading } = useQuery({
    queryKey: ["admin"],
    queryFn: async () => getUsersByRole(ROLES[4]),
  });

  const form = useForm({
    resolver: zodResolver(createMinistrySchema),
    defaultValues: {
      coordinators: "",
      ministryName: "",
      ministryDescription: "",
    },
  });
  const adminsCoordinators =  [...admins ?? [],...coordinators ?? []]

  const coordinatorOptions = adminsCoordinators?.map((coordinator) => ({
    value: coordinator.id,
    label: `${coordinator.first_name} ${coordinator.last_name}`,
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

  console.log(form.getValues());
  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-2xl text-primary-text hover:bg-primary"
        >
          Create Ministry
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="text-primary-text">
          <AlertDialogTitle className="font-extrabold">
            Create New Ministry
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            Add details about this ministry.{" "}
            <span className="text-xs italic">
              {"(this can be edited later)"}
            </span>
          </AlertDialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 text-start"
            >
              <FormField
                control={form.control}
                name="ministryName"
                render={({ field }) => (
                  <FormItem className="space-y-0">
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
                name="ministryDescription"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="font-bold">
                      Description
                      <span className="font-light italic">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your Ministry. (Maximum of 128 characters)"
                        {...field}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coordinators"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Coordinators</FormLabel>
                    <FormControl>
                      <CustomReactSelect
                        isLoading={coordinatorLoading || adminLoading}
                        onChange={(selectedOptions) =>
                          field.onChange(
                            selectedOptions?.map((option) => option.value) || []
                          )
                        }
                        options={coordinatorOptions}
                        value={coordinatorOptions.filter((option) =>
                          field.value?.includes(option.value)
                        )}
                        placeholder="Select Coordinators..."
                        isMulti
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-x-2">
                <AlertDialogCancel asChild>
                  <Button onClick={() => form.reset()} variant="outline">
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <Button type="submit" disabled={createMutation.isLoading}>
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
              {createMutation.isError && (
                <p className="text-red-500">
                  Error: {createMutation.error.message}
                </p>
              )}
            </form>
          </Form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateMinistry;
