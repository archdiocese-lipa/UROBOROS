import { useQuery } from "@tanstack/react-query";
import { getAllMinistries } from "@/services/ministryService"; // your fetch function

export const useFetchMinistries = () => {
  return useQuery({
    queryKey: ["ministries"], // Unique query key to identify this data
    queryFn: getAllMinistries, // Fetch function to get ministries
  });
};
