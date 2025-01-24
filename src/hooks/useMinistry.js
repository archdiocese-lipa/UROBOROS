import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import {
  createMinistry,
  editMinistry,
  getAllMinistries,
  deleteMinistry,
  removeMinistryVolunteer,
  fetchMinistryAssignedUsers,
  assignNewVolunteers,
} from "@/services/ministryService";

const useMinistry = ({ ministryId }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch ministry members
  const { data:ministryMembers, error, isLoading:membersLoading } = useQuery({
    queryKey: ["ministryMembers", ministryId],
    queryFn: () => fetchMinistryAssignedUsers(ministryId),
    enabled: !!ministryId,
  });

  // Fetch all ministries
  const { data:ministries, isLoading:ministryLoading } = useQuery({
    queryKey: ["ministries"],
    queryFn: getAllMinistries,
  });

  // Mutation for creating a ministry
  const createMutation = useMutation({
    mutationFn: createMinistry,
    onSuccess: () => {
      queryClient.invalidateQueries(["ministries"]);
      toast({
        title: "Ministry Created",
        description: "The ministry has been created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Ministry",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mutation for editing a ministry
  const editMutation = useMutation({
    mutationFn: editMinistry,
    onSuccess: () => {
      queryClient.invalidateQueries(["ministries"]);
      toast({
        title: "Ministry Updated",
        description: "The ministry has been updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Updating Ministry",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mutation for deleting a ministry
  const deleteMutation = useMutation({
    mutationFn: deleteMinistry,
    onSuccess: () => {
      queryClient.invalidateQueries(["ministries"]);
      toast({
        title: "Ministry Deleted",
        description: "The ministry has been deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Deleting Ministry",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mutation for removing a ministry volunteer
  const removeMinistryVolunteerMutation = useMutation({
    mutationFn: ({ ministryId, memberId }) => removeMinistryVolunteer(ministryId, memberId),
    onSuccess: () => {
      toast({
        title: "Volunteer Removed",
        description: "The volunteer has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Removing Volunteer",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["ministryMembers",ministryId]);
    },
  });

    const AssignMinistryVolunteerMutation = useMutation({
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
    AssignMinistryVolunteerMutation,
    ministryLoading,
    ministryMembers,
    ministries,
    membersLoading,
    error,
    createMutation,
    editMutation,
    deleteMutation,
    removeMinistryVolunteerMutation,
  };
};

export default useMinistry;
