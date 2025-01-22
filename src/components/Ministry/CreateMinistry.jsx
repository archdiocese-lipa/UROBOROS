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
import { useCreateMinistry } from "@/hooks/useCreateMinistry"; // Import the hook

const CreateMinistry = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm({
    resolver: zodResolver(createMinistrySchema),
    defaultValues: {
      ministryName: "",
      ministryDescription: "",
    },
  });

  const createMinistryMutation = useCreateMinistry();

  const onSubmit = (values) => {
    createMinistryMutation.mutate(
      {
        ministry_name: values.ministryName,
        ministry_description: values.ministryDescription,
      },
      {
        onSuccess: () => {
          // Close the dialog after successful ministry creation
          setOpenDialog(false);
        },
      }
    );
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
            Add details about your ministry. This can be edited later.
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 text-start"
            >
              <FormField
                control={form.control}
                name="ministryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ministry Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the public name of the ministry.
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
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={createMinistryMutation.isLoading}
                >
                  {createMinistryMutation.isLoading ? "Creating..." : "Submit"}
                </Button>
              </div>
              {createMinistryMutation.isError && (
                <p className="text-red-500">
                  Error: {createMinistryMutation.error.message}
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
