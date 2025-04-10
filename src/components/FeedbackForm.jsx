import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icon } from "@iconify/react";
import { Textarea } from "./ui/textarea";

const feedbackSchema = z.object({
  feedback: z
    .string()
    .min(10, "Please provide at least 10 characters of feedback")
    .max(1000, "Feedback must be less than 1000 characters"),
});

const FeedbackForm = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const form = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedback: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <HoverCard>
        <HoverCardTrigger onClick={handleOpenDialog} className="cursor-pointer">
          <div className="rounded-lg border border-accent/30 p-1">
            <Icon icon="mingcute:edit-4-fill" width={24} color="#663F30" />
          </div>
        </HoverCardTrigger>
        <HoverCardContent>
          Click this button to provide feedback about the portal.
        </HoverCardContent>
      </HoverCard>

      <AlertDialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) {
            form.reset();
            setCharacterCount(0);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Feedback Form</AlertDialogTitle>
            <AlertDialogDescription>
              Your feedback is valuable in helping us enhance your experience.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AlertDialogBody>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="feedback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Feedback</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your suggestions for improvement..."
                            className="min-h-[220px] resize-none"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setCharacterCount(e.target.value.length);
                            }}
                          />
                        </FormControl>
                        <div className="flex justify-between">
                          <FormDescription>
                            {`Please be specific about what you'd like to see
                            improved.`}
                          </FormDescription>
                          <span
                            className={`text-xs ${
                              characterCount > 900
                                ? "text-red-600"
                                : characterCount > 0
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {characterCount}/1000
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="rounded-lg border p-4 text-primary-text">
                  <h4 className="mb-2 flex items-center gap-1 text-sm font-medium">
                    <Icon icon="mingcute:bulb-fill" />
                    What kind of feedback is helpful?
                  </h4>
                  <ul className="list-disc space-y-1 pl-4 text-xs">
                    <li>
                      Feature requests that would make your experience better
                    </li>
                    <li>Suggestions to improve existing functionalities</li>
                    <li>Reports of confusing or difficult to use interfaces</li>
                    <li>{`Ideas for new features or reports you'd like to see`}</li>
                  </ul>
                </div>
              </AlertDialogBody>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">Submit</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FeedbackForm;
