import { useEffect, useState } from "react";
import { useUser } from "@/context/useUser";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { userData } = useUser();
  const { toast } = useToast();

  const { data } = useQuery({
    queryKey: ["fetchUser", userData?.id],
    queryFn: () => fetchUserById(userData?.id),
    enabled: !!userData?.id, // Only run query when userData.id is available
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
  const initials = `${getInitial(data?.first_name)}${getInitial(data?.last_name)}`;

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

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
          <div>
            <label className="text-gray-700 block text-sm font-medium">
              Email
            </label>
            <p className="text-gray-700">{data.email}</p>
          </div>

          <div>
            <label className="text-gray-700 block text-sm font-medium">
              Contact Number
            </label>
            <p className="text-gray-700">{data.contact_number}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
