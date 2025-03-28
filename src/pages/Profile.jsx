import { useEffect, useState } from "react";
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
  DialogDescription,
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
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { fetchVicariatesAndParishes } from "@/services/authService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateParish } from "@/services/userService";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const { userData } = useUser();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isemailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [selectedParish, setSelectedParish] = useState("");
  const [selectedVicariate, setSelectedVicariate] = useState(null);
  const [_selectedParishName, setSelectedParishName] =
    useState("Select Parish");
  const [isParishDialogOpen, setIsParishDialogOpen] = useState(false);

  const { data: vicariatesData, isLoading: _isLoadingParishes } = useQuery({
    queryKey: ["fetchVicariatesAndParishes"],
    queryFn: fetchVicariatesAndParishes,
  });

  const contactSchema = z.object({
    contact_number: z.string().regex(/^[0-9]{11}$/, {
      message: "Contact number must be exactly 11 digits.",
    }),
  });

  const parishSchema = z.object({
    vicariate: z.string(),
    parish: z.string(),
  });

  const nameSchema = z.object({
    first_name: z.string().min(1, "First name is required."),
    last_name: z.string().min(1, "First name is required."),
  });

  const emailSchema = z.object({
    email: z.string().email(),
  });

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });
  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { contact_number: "" },
  });

  const parishForm = useForm({
    resolver: zodResolver(parishSchema),
    defaultValues: { vicariate: "", parish: "" },
  });

  const {
    toggleNotificationMutation,
    updateNameMutation,
    sendEmailLinkMutation,
    updateContactMutation,
    data,
    isLoading,
  } = useProfileChange({
    user_id: userData?.id,
    setIsDialogOpen,
    setIsEmailDialogOpen,
    setIsNameDialogOpen,
    form,
    emailForm,
  });

  const nameForm = useForm({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });
  // after the userData is fetched it will set the initial value of the fields
  useEffect(() => {
    if (userData) {
      nameForm.reset({
        first_name: userData.first_name,
        last_name: userData.last_name,
      });
      form.reset({
        contact_number: userData.contact_number,
      });
    }
  }, [userData, nameForm]);

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
  const handleUpdateName = (data) => {
    updateNameMutation.mutate({
      userId: userData?.id,
      first_name: data.first_name,
      last_name: data.last_name,
    });
  };

  const updateParishMutation = useMutation({
    mutationFn: updateParish,
    onMutate: () => {
      toast({
        title: "Updating Parish",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating parish",
        message: `${error.message}`,
      });
    },
    onSuccess: () => {
      toast({
        title: "Parish Updated",
      });
      queryClient.invalidateQueries(["fetchVicariatesAndParishes"]);
      //Close the dialog on success
      setIsParishDialogOpen(false);
    },
  });

  const handleUpdateParish = (data) => {
    updateParishMutation.mutate({
      userId: userData?.id,
      parishId: data.parish,
      vicariateId: data.vicariate,
    });
  };

  useEffect(() => {
    if (userData && vicariatesData) {
      let foundParishName = "";
      let foundVicariateId = null;

      // Find parish and its parent vicariate
      for (const vicariate of vicariatesData) {
        for (const parish of vicariate.parishes || []) {
          if (parish.id === userData.parish_id) {
            foundParishName = parish.name;
            foundVicariateId = vicariate.id;
            break;
          }
        }
        if (foundParishName) break;
      }

      setSelectedParish(foundParishName || "Select Parish");

      // Set both vicariate and parish in the form
      parishForm.reset({
        vicariate: foundVicariateId || "",
        parish: userData.parish_id || "",
      });

      // Also update the selected vicariate state if found
      if (foundVicariateId) {
        const vicariate = vicariatesData.find((v) => v.id === foundVicariateId);
        setSelectedVicariate(vicariate);
      }
    }
  }, [userData, vicariatesData, parishForm]);

  const initials = `${getInitial(data?.first_name)}${getInitial(data?.last_name)}`;

  const toggleNotification = async (userId, isReceivingNotification) => {
    toggleNotificationMutation.mutate({
      userId,
      isReceivingNotification,
    });
  };

  if (isLoading || !userData || !data) {
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
        </div>

        {/* Display Fields */}
        <div className="space-y-4">
          <div className="flex flex-col items-start space-y-2">
            <Label>Parish</Label>
            <Dialog
              open={isParishDialogOpen}
              onOpenChange={setIsParishDialogOpen}
              className="text-start"
            >
              <DialogTrigger onClick={() => setIsParishDialogOpen(true)}>
                {selectedParish}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Vicariates</DialogTitle>
                  <DialogDescription>
                    Please select your Vicariate/Parish
                  </DialogDescription>
                  <div>
                    <Form {...parishForm}>
                      <form
                        onSubmit={parishForm.handleSubmit(handleUpdateParish)}
                      >
                        <FormField
                          control={parishForm.control}
                          name="vicariate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vicariate</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    const vicariate = vicariatesData?.find(
                                      (v) => v.id === value
                                    );
                                    parishForm.setValue("parish", " ");
                                    setSelectedVicariate(vicariate);
                                  }}
                                  value={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Vicariate" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {vicariatesData?.map((vicariate, index) => (
                                      <SelectItem
                                        key={vicariate.id}
                                        value={vicariate.id}
                                      >
                                        {`Vicariate ${index + 1} - ${vicariate.name}`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {selectedVicariate && (
                          <FormField
                            control={parishForm.control}
                            name="parish"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Parish</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={(value) => {
                                      parishForm.setValue("parish", value);
                                      const parish =
                                        selectedVicariate?.parishes.find(
                                          (p) => p.id === value
                                        );
                                      if (parish) {
                                        setSelectedParishName(parish.name);
                                      }
                                    }}
                                    value={field.value}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select Parish" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {selectedVicariate?.parishes.map(
                                        (parish) => (
                                          <SelectItem
                                            key={parish.id}
                                            value={parish.id}
                                          >
                                            {parish.name}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        <DialogFooter className="mt-6 flex w-full justify-end">
                          <Button type="submit">Update Parish</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center justify-between">
            <Label>Name</Label>
            <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
              <DialogTrigger asChild>
                <Button>Edit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Name</DialogTitle>
                </DialogHeader>

                <Form {...nameForm}>
                  <form onSubmit={nameForm.handleSubmit(handleUpdateName)}>
                    <FormField
                      control={nameForm.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              className="text-accent"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={nameForm.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              className="text-accent"
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
                        onClick={() => setIsNameDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateNameMutation.isPending}
                      >
                        {updateNameMutation.isPending
                          ? "Updating..."
                          : "Update"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-gray-700">{`${data?.first_name} ${data?.last_name}`}</p>

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
                          <FormLabel>New Email Address</FormLabel>
                          <FormControl>
                            <Input
                              className="text-accent"
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
                <Button
                  onClick={() =>
                    form.reset({ contact_number: data?.contact_number })
                  }
                >
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Contact Number</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit((data) => {
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
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-gray-700">{data?.contact_number}</p>

          <div className="flex items-center justify-between">
            Toggle Notification
            <Switch
              defaultChecked={data.is_receiving_notification}
              onCheckedChange={() =>
                toggleNotification(userData.id, !data.is_receiving_notification)
              }
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Link
            to={"/reset-password"}
            className="mt-4 cursor-pointer hover:underline"
          >
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
