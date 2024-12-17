
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { forgotPassword } from "@/services/userService";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const emailSchema = z.object({
  forgotemail: z.string().email(" You must input a valid email."),
});


const ForgotPassword = () => {
    const { toast } = useToast();

    const sendVerificationMutation = useMutation({
        mutationFn: async (data) => forgotPassword(data),
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Email Sent.",
          });
        },
      });
      

  const forgotPasswordForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      forgotemail: "",
    },
  });
  const onSubmit = (data) => {    
    sendVerificationMutation.mutate(data.forgotemail)
  };

  return (
    <Dialog>
      <DialogTrigger>Forgot Password?</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Forgot Password?</DialogTitle>
          <DialogDescription>
            Enter your email for verification.
          </DialogDescription>
        </DialogHeader>
        <Form {...forgotPasswordForm}>
          <form
            // id="verificationform"
            onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}
          >
            <FormField
              control={forgotPasswordForm.control}
              name="forgotemail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g johndoe@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              //   form="verificationform"
              className="mt-2 w-full"
            >
              Send Email Verification
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPassword;
