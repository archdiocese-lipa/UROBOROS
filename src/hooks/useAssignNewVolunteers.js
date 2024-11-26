import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignNewVolunteers } from "@/services/ministryService";

const useAssignNewVolunteers = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, isSuccess, isError, error } = useMutation({
    mutationFn: ({ ministryId, newMembers }) =>
      assignNewVolunteers(ministryId, newMembers), // Destructure values correctly
    onSuccess: () => {
      queryClient.invalidateQueries(["ministries"]);
      queryClient.invalidateQueries(["ministryMembers"]);
    },
    onError: (error) => {
      console.error("Error while assigning volunteers:", error.message);
    },
  });

  return {
    assignVolunteers: mutate,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

export default useAssignNewVolunteers;
