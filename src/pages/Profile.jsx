import { useState } from "react";
import { useUser } from "@/context/useUser";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import { useProfileChange } from "@/hooks/useProfileChange";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Loading from "@/components/Loading";
import { DialogDescription } from "@radix-ui/react-dialog";

const Profile = () => {
  const { userData } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isemailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const initials = `${getInitial(data?.first_name)}${getInitial(data?.last_name)}`;

  const contactSchema = z.object({
    contact_number: z.string().regex(/^[0-9]{11}$/, {
      message: "Contact number must be exactly 11 digits.",
    }),
  });
  const emailSchema = z.object({
    email: z.string().email(),
  });

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { contact_number: "" },
  });

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });
  const {
    sendEmailLinkMutation,
    updateContactMutation,
    data,
    isLoading,
  } = useProfileChange({
    user_id: userData?.id,
    setIsDialogOpen,
    setIsEmailDialogOpen,
  });

  const handleUpdateContact = (newContact) => {
    updateContactMutation.mutate({
      userId: userData?.id,
      newContactNumber: newContact.contact_number,
    });
  };
  const handleSendEmailVerification = (data) => {
    localStorage.setItem("newEmail", data.email);
    sendEmailLinkMutation.mutate({
      email: data.email,
    });
  };

  if (isLoading || !userData) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-50 flex h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-16 w-16">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-semibold">{`${data?.first_name} ${data?.last_name}`}</h1>
        </div>

        {/* Display Fields */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 block text-sm font-medium">
              Email
            </label>

            <Dialog
              open={isemailDialogOpen}
              onOpenChange={setIsEmailDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>Edit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Email</DialogTitle>
                  <DialogDescription className="text-xs">
                    When you click the send change email verification, it will
                    send an email to your current and new email. You must click
                    the link on both emails to change your email.
                  </DialogDescription>
                </DialogHeader>

                <Form {...emailForm}>
                  <form
                    onSubmit={emailForm.handleSubmit(
                      handleSendEmailVerification
                    )}
                  >
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              className="text-accent"
                              placeholder="JhonDoe@example.com"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className={"mt-4"}>
                      {/* <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsEmailDialogOpen(false)}
                      >
                        Cancel
                      </Button> */}
                      <Button
                        className="w-full"
                        type="submit"
                        disabled={sendEmailLinkMutation.isPending}
                      >
                        {sendEmailLinkMutation.isPending
                          ? "Sending Change Email Verification..."
                          : "Send Change Email Verification"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-gray-700">{data?.email}</p>

          <div className="flex items-center justify-between">
            <label className="text-gray-700 block text-sm font-medium">
              Contact Number
            </label>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Edit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Contact Number</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit((data) => {
                        console.log(data);
                        handleUpdateContact(data);
                      })}
                    >
                      <FormField
                        control={form.control}
                        name="contact_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                              <Input
                                className="text-accent"
                                placeholder="Contact Number"
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter className={"mt-4"}>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={updateContactMutation.isPending}
                        >
                          {updateContactMutation.isPending
                            ? "Updating..."
                            : "Update"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </div>{" "}
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-gray-700">{data?.contact_number}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
