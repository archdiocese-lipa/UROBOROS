import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/services/supabaseClient";
import axios from "axios";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const InviteFamily = () => {
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    try {
      // Get user name
      const { data: user, error } = await supabase
        .from("users")
        .select("first_name, last_name")
        .eq("id", session.user.id)
        .single();

      if (error) {
        throw error;
      }

      const inviterName = `${user?.first_name} ${user?.last_name}`;

      const response = await axios.post(
        // `${import.meta.env.VITE_UROBOROS_API_URL}/invite/send-invite`,
        "http://localhost:3000/invite/send-invite",
        { email: data.email, inviterName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("Invitation sent successfully");
      } else {
        alert(`Failed to send invitation: ${response.data.error}`);
      }
    } catch (error) {
      alert(`Failed to send invitation: ${error.message}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Invite User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite a New User</DialogTitle>
          <DialogDescription>
            Please make sure to invite a user who is not yet a member of any
            family.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter the email address to invite"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteFamily;
