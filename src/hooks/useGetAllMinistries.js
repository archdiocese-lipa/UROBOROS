import { useQuery } from "@tanstack/react-query";
import { getAllMinistries } from "@/services/ministryService"; // Adjust this import path if needed

const useGetAllMinistries = () => {
  return useQuery({
    queryKey: ["ministries"], // Key for the query
    queryFn: getAllMinistries, // The function to fetch data
    // Optionally, you can add options like caching, refetching, etc.
  });
};

export default useGetAllMinistries;
