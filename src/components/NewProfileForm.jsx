import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCreateUser from "@/hooks/Request/useCreateUser";
import useUpdateUser from "@/hooks/Request/useUpdateUser";
import {
  editingUserSchema,
  newUserSchema,
} from "@/zodSchema/Request/NewUserSchema";
import { Label } from "./ui/label";

const NewProfileForm = ({ id = "new-user-form", user, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(user ? editingUserSchema : newUserSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      contact_number: user?.contact_number || "",
      role: user?.role || "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const { mutate: createUser } = useCreateUser(onClose);
  const { mutate: updateUser } = useUpdateUser(onClose);

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
        ? createUser(newUserPayload)
        : updateUser({ id: user?.id, payload: updateUserPayload });
    } catch (error) {
      console.error(error);
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
                <Input placeholder="+441172345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!user && (
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
        )}

        {!user && (
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
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
                    <Input
                      placeholder="Confirm Password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        {!user && (
          <div className="flex items-center justify-end gap-x-2">
            <Checkbox
              checked={showPassword}
              onCheckedChange={setShowPassword}
            />
            <Label>Show Password</Label>
          </div>
        )}
      </form>
    </Form>
  );
};

NewProfileForm.propTypes = {
  id: PropTypes.string,
  user: PropTypes.object,
  onClose: PropTypes.func,
};

export default NewProfileForm;
