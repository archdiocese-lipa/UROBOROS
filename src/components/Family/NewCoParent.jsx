import { useState, forwardRef, useEffect } from "react";
import PropTypes from "prop-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { registerCoParentSchema } from "@/zodSchema/Family/RegisterCoParentSchema";
import useRegisterCoParent from "@/hooks/Family/useRegisterCoParent";

const NewCoParent = forwardRef(
  (
    {
      parentId,
      parentFirstName,
      parentLastName,
      parentContactNumber,
      openModal = false,
      onClose,
    },
    ref
  ) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
      resolver: zodResolver(registerCoParentSchema),
      defaultValues: {
        firstName: parentFirstName,
        lastName: parentLastName,
        contactNumber: parentContactNumber,
        email: "",
        password: "",
      },
    });

    const { mutate: registerCoParent } = useRegisterCoParent();
    const onSubmit = async (data) => {
      registerCoParent({ ...data, parentId });
      setOpenDialog(false);
      if (onClose) onClose();
    };

    useEffect(() => {
      if (openModal) setOpenDialog(true);
    }, [openModal]);

    return (
      <div ref={ref}>
        <Dialog
          open={openDialog}
          onOpenChange={(isOpen) => {
            setOpenDialog(isOpen);
            if (!isOpen && onClose) onClose();
          }}
        >
          <DialogContent className="h-[80%] md:h-fit  overflow-y-scroll">
            <DialogHeader>
              <DialogTitle>Set up account for Parent/Guardian</DialogTitle>
              <DialogDescription>
                Complete the details below to set up an account for the
                parent/guardian. This will enable shared access and collaboration on
                family-related information.
              </DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2 text-start"
                >
                  <div className="mt-2 flex flex-col gap-2 text-start md:flex-row">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Tel No.</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between gap-x-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-x-2">
                    <Checkbox
                      checked={showPassword}
                      onCheckedChange={(checked) => setShowPassword(checked)}
                    />
                    <Label>Show Password</Label>
                  </div>
                  <DialogFooter>
                    <div className="flex justify-end gap-x-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Submit</Button>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

// Add PropTypes validation for childId prop
NewCoParent.propTypes = {
  parentId: PropTypes.string.isRequired,
  parentFirstName: PropTypes.string.isRequired,
  parentLastName: PropTypes.string.isRequired,
  parentContactNumber: PropTypes.string.isRequired,
  openModal: PropTypes.bool,
  onClose: PropTypes.func,
};

NewCoParent.displayName = "EditParent";

export default NewCoParent;
