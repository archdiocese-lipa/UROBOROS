import { useUser } from "@/context/useUser";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { userData } = useUser();

  if (!userData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  const handleUpdateInfo = () => {
    // Add logic for updating user information
  };

  const handleResetPassword = () => {
    // Add logic for resetting the password
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-lg border bg-white p-6 shadow">
        <h1 className="text-lg font-semibold">Profile</h1>
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p>{`${userData.first_name} ${userData.last_name}`}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p>{userData.email}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Contact Number</p>
            <p>{userData.contact_number}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Role</p>
            <p className="capitalize">{userData.role}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Button onClick={handleUpdateInfo}>Update Info</Button>
          <Button onClick={handleResetPassword} variant="destructive">
            Reset Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
