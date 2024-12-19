import { useEffect, useState } from "react";
import { useUser } from "@/context/useUser";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useUpdateContact } from "@/hooks/useUpdateContact"; // Import the hook
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

const Profile = () => {
  const { userData } = useUser();
  const { toast } = useToast();
  const mutation = useUpdateContact(); // Access the mutation hook

  const { data } = useQuery({
    queryKey: ["fetchUser", userData?.id],
    queryFn: () => fetchUserById(userData?.id),
    enabled: !!userData?.id,
    onError: (error) => {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load user profile. Please try again later.",
        variant: "destructive",
      });
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState("");
  const [error, setError] = useState("");

  const initials = `${getInitial(data?.first_name)}${getInitial(data?.last_name)}`;

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  const validateContactNumber = (number) => {
    const regex = /^\+?[1-9]\d{1,14}$/;
    return regex.test(number);
  };

  const handleUpdateContact = () => {
    if (!validateContactNumber(newContact)) {
      setError("Please enter a valid contact number.");
      return;
    }
    setError("");
    mutation.mutate(
      { userId: userData?.id, newContactNumber: newContact },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setNewContact(""); // Clear the input field
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 flex h-screen items-center justify-center">
        <p className="text-gray-700 text-lg font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 flex h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-16 w-16">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-semibold">{`${data.first_name} ${data.last_name}`}</h1>
        </div>

        {/* Display Fields */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 block text-sm font-medium">
              Email
            </label>
            <Button>Edit</Button>
          </div>
          <p className="text-gray-700">{data.email}</p>

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
                  <Input
                    type="text"
                    placeholder="Enter new contact number"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                  />
                  {error && <p className="text-red-500">{error}</p>}
                </div>
                <DialogFooter>
                  <Button
                    variant="secondary"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateContact}
                    disabled={mutation.isLoading}
                  >
                    {mutation.isLoading ? "Updating..." : "Submit"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-gray-700">{data.contact_number}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
