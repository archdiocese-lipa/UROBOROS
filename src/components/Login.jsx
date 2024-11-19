import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from './ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/zodSchema/LoginSchema';
import { useLogin } from '@/hooks/useLogin';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isDialogOpen, setisDialogOpen] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate for navigation
  // Initialize the form using react-hook-form
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Use the useLogin hook for managing login
  const { login, isLoading, error } = useLogin();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleLogin = (data) => {
    login(data, {
      onSuccess: () => {
        console.log('Login successful!');
        setisDialogOpen(false); // Close dialog
        navigate('/dashboard'); // Navigate to the dashboard
      },
      onError: (err) => {
        console.error('Login failed:', err.message);
      },
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setisDialogOpen}>
      <DialogTrigger asChild>
        <Button className="hover:cursor-pointer">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-3 h-fit">
          <DialogTitle className="text-2xl font-semibold">Login</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enter your account information to access your dashboard.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLogin)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="w-full"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={passwordVisible ? 'text' : 'password'}
                      className="w-full"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center my-2 justify-end gap-2">
              <input type="checkbox" onClick={togglePasswordVisibility} />
              <p>Show Password</p>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}{' '}
            {/* Show error if login fails */}
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 sm:mt-0"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Login;
