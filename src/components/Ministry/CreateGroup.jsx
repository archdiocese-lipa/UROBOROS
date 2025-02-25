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

const createGroupSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required.",
  }),
});

const CreateGroup = () => {
  const form = useForm({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          className="rounded-xl bg-primary-outline/30 text-primary-text"
          size="sm"
        >
          Create New Group
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="text-primary-text">
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle>Create New Group</AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <div className="flex items-center justify-end gap-x-2">
              <AlertDialogCancel className="m-0">Cancel</AlertDialogCancel>
              <Button type="submit">Done</Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateGroup;
