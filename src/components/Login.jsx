import { useState, useEffect } from 'react';
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
import { loginSchema } from '@/zodSchema/LoginSchema'; // Your Zod validation schema
import { useUser } from '@/context/useUser';
import { useNavigate } from 'react-router-dom'; // Import navigation hook

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const navigate = useNavigate();
  const { login, userData, loading } = useUser(); // Access context functions
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleLogin = async (data) => {
    try {
      const user = await login(data); // Trigger login and get user data
      console.log('Login successful! user:', user);

      setErrorMessage(''); // Clear any previous errors
      setIsDialogOpen(false); // Close dialog
      navigate('/dashboard'); // Navigate to the dashboard
    } catch (error) {
      console.error('Login failed:', error.message);
      setErrorMessage(error.message); // Set the error message
    }
  };

  // Effect to watch for userData and trigger navigation when it's updated
  useEffect(() => {
    if (userData) {
      console.log('Login successful! userData:', userData);
      setErrorMessage(''); // Clear errors on successful login
      setIsDialogOpen(false); // Close dialog on success
      navigate('/dashboard'); // Navigate to the dashboard
    }
  }, [userData, navigate]);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="primary">Login</Button>
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
                    <FormLabel>Password</FormLabel>
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
                <Button type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Error Message Pop-Up */}
      {errorMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow">
          {errorMessage}
          <button
            className="ml-4 text-black bg-white px-2 py-1 rounded"
            onClick={() => setErrorMessage('')} // Close the pop-up
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default Login;
