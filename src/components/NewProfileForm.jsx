import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PropTypes from "prop-types";

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
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import { registerUser } from "@/services/authService";
import { updateUser } from "@/services/userService";

const NewProfileForm = ({ id = "new-user-form", user }) => {
  const { toast } = useToast();

  const newUserSchema = z
    .object({
      first_name: z.string().min(1, "First Name is Required"),
      last_name: z.string().min(1, "Last Name is Required"),
      contact_number: z.string().min(1, "Contact Number is Required"),
      email: z.string().email().min(1, "Email is Required"),
      role: z.string().min(1, "Role is Required"),
      password: z.string().min(6),
      confirm_password: z.string().min(6),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
    });

  const editingUserSchema = z.object({
    first_name: z.string().min(1, "First Name is Required"),
    last_name: z.string().min(1, "Last Name is Required"),
    contact_number: z.string().min(1, "Contact Number is Required"),
    email: z.string().email().min(1, "Email is Required"),
    role: z.string().min(1, "Role is Required"),
  });

  const form = useForm({
    resolver: zodResolver(user ? editingUserSchema : newUserSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      contact_number: user?.contact_number || "",
      role: user?.role || "",
      email: user?.email || "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const newUserPayload = {
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        password: data.password,
        contactNumber: data.contact_number,
        role: data.role,
      };

      const { password: _, confirm_password: __, ...updateUserPayload } = data;

      !user
        ? await registerUser(newUserPayload)
        : await updateUser(user?.id, updateUserPayload);

      toast({
        title: "Success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
      });
    }
  };

  return (
    <Form id={id} {...form}>
      <form
        id={id}
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormLabel>User Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-full">
                    <SelectValue placeholder="Select a User Role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="parishioner">Parishioner</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="contact_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Tel No.</FormLabel>
              <FormControl>
                <Input placeholder="09123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          type="email"
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
        {!user && (
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </form>
    </Form>
  );
};

NewProfileForm.propTypes = {
  id: PropTypes.string,
  user: PropTypes.object,
};

export default NewProfileForm;
