import FamilyRegistration from "./FamilyRegistration";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { parishionerRegisterSchema } from "@/zodSchema/ParishionerRegisterSchema";
import { cn } from "@/lib/utils";

const ParishionerRegister = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isProfileDisabled, setIsProfileDisabled] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(parishionerRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values) => {
    try {
      console.log("Registration submitted:", values);

      // Simulate profile creation (replace with actual logic, like an API call)
      // await createProfile(values);

      toast({
        title: "Profile Created Successfully",
        description:
          "The new profile has been created and saved to the system.",
      });

      form.reset(); // Reset the form after submission
      setActiveTab("family"); // Switch to the next tab or step
      setIsProfileDisabled(true); // Disable profile editing or move to the next state
    } catch (error) {
      console.error("Error creating profile:", error);

      toast({
        title: "Error",
        description:
          "There was an issue creating the profile. Please try again.",
        variant: "destructive", // Optionally, use a different variant for error
      });
    }
  };

  // Reset form and states
  const reset = () => {
    form.reset(); // Reset form fields when closing
    setActiveTab("profile"); // Reset active tab to "Profile"
    setIsProfileDisabled(false); // Re-enable the "Profile" tab
  };

  // Close the Dialog if cancel
  const handleDialogClose = (isOpen) => {
    if (!isOpen) {
      reset();
    }
  };

  // Skip button for Add family members
  // const handleSkip = () => {
  //   reset();
  //   setOpen(false);
  // };

  return (
    <Dialog onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant="secondary">Create New Profile</Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "sm:max-w-2xl md:h-auto h-dvh",
          activeTab === "family" && "h-auto"
        )}
      >
        <DialogHeader>
          <DialogTitle>
            {activeTab === "profile"
              ? "Create New Profile"
              : "Add Family Member"}
          </DialogTitle>
          <DialogDescription>
            {activeTab === "profile"
              ? "Create a new profile to join the platform."
              : "Add your family members here, or you can do it later."}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="profile" disabled={isProfileDisabled}>
              Profile
            </TabsTrigger>
            <TabsTrigger value="family" disabled={!isProfileDisabled}>
              Family
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
              >
                <div className="flex flex-col md:flex-row w-full gap-x-2">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Tel No.</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="09123456789"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g john@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col md:flex-row w-full gap-x-2">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Submitting..." : "Register"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="family">
            <FamilyRegistration />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ParishionerRegister;
