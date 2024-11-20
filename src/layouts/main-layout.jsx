import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";

const MainLayout = () => {
  // use useQuery hook?
  const { _data, isSuccess, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // Simulate fetching user data
      // Replace this with actual supabase call
      const response = await Promise.resolve({
        id: 1,
        name: "John Doe",
        role: "admin",
      });

      return response;
    },
  });

  if (isSuccess) {
    // Here Contains the logic if the user is authenticated
    // if we use Context API, we can set the user data here.
    // Example:
    // import { useAuth } from '@/path/to/useAuth hook';
    // const { setUser } = useAuth();
    // setUser(data);
  }

  if (isError) {
    // Here Contains the logic if the user is not authenticated
    // if we use Context API, clear it and navigate back to login.
    // Example:
    // import { useNavigation } from 'react-router-dom';
    // import { useAuth } from '@/path/to/useAuth hook';
    // const { clearUser } = useAuth();
    // const navigate = useNavigation();
    // clearUser();
    // navigate('/login');
  }

  return (
    <div className="flex h-dvh flex-col-reverse bg-primary lg:flex-row">
      <Sidebar />
      <div className="no-scrollbar m-4 flex-1 overflow-y-scroll rounded-[20px] bg-white p-9">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
