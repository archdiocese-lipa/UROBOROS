import { Description, Title } from "@/components/Title";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updatePassword } from "@/services/userService";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@/context/useUser";

export const ResetPassword = () => {
  const { toast } = useToast();
  const {userData} = useUser()
  const [passwordVisible, setPasswordVisible] = useState(false);
  const changePasswordSchema = z
    .object({
      currentPassword: z
        .string()
        .min(1, "you must input your current password."),
      password: z.string().min(6, "Password must be 6 digits"),
      confirmPassword: z.string().min(1, "Retype your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "password must be match",
      path: ["confirmPassword"],
    });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data) => updatePassword(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password updated.",
      });
    },
    onError:(error) => {
      toast({
        variant: "destructive",
        description: `Error updating password, ${error.message}`,
      });
    }
  });
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const onSubmit = (data) => {
    resetPasswordMutation.mutate({
      email: userData.email,
      currentPassword: data.currentPassword,
      password: data.password,
    });
  };

  const changePasswordForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-3/6">
        <Title>Change Password</Title>
        <Description>Change your password</Description>
        <Form {...changePasswordForm}>
          <form onSubmit={changePasswordForm.handleSubmit(onSubmit)}>
            <FormField
              control={changePasswordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={changePasswordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={changePasswordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <input type="checkbox" onClick={togglePasswordVisibility} />
              <p>Show Password</p>
            </div>
            <Button type="submit" className="mt-2 w-full">
              Save Password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
