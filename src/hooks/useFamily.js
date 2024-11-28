import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  addFamilyMembers,
  updateChild,
  deleteChild,
  updateParent,
  deleteParent,
  getChildren,
  getFamilyId,
  getGuardian,
} from "@/services/familyService"; // Import the service
import { useToast } from "./use-toast";

const useAddFamily = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to add family members
  const mutate = async (familyData) => {
    setIsLoading(true);
    setError(null);

    const response = await addFamilyMembers(familyData);

    if (response.success) {
      setIsLoading(false);
      return response;
    } else {
      setIsLoading(false);
      setError(response.error);
    }
  };

  return { mutate, isLoading, error };
};

// Edit parent
const useEditParent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ parentId, data }) => updateParent(parentId, data),
    onSuccess: (data) => {
      toast({
        title: "Guardian updated successfully",
      });

      // Invalidate the query related to "children"
      queryClient.invalidateQueries(["parents"]);

      // Optionally invalidate a specific child's query
      queryClient.invalidateQueries(["parent", data.id]);
    },
    onError: (error) => {
      console.error("Error updating guardian:", error.message);

      toast({
        title: "Error updating child",
        variant: "destructive",
      });
    },
  });
};

// Delete parent
const useDeleteParent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteParent,
    onSuccess: (data) => {
      toast({
        title: "Removed Successfully",
      });
      // Invalidate the query related to "children"
      queryClient.invalidateQueries(["parents"]);

      // Optionally invalidate a specific child's query
      queryClient.invalidateQueries(["parent", data.id]);
    },
    onError: (error) => {
      console.error("Error deleting child:", error.message);
      toast({
        title: "Failed to remove",
        variant: "destructive",
      });
    },
  });
};

//Edit child
const useEditChild = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ childId, data }) => updateChild(childId, data),
    onSuccess: (data) => {
      toast({
        title: "Child updated successfully",
      });
      // Invalidate the query related to "children"
      queryClient.invalidateQueries(["children"]);
      // Optionally invalidate a specific child's query
      queryClient.invalidateQueries(["child", data.id]);
    },
    onError: (error) => {
      console.error("Error updating child:", error.message);

      toast({
        title: "Error updating child",
        variant: "destructive",
      });
    },
  });
};
// Delete child
const useDeleteChild = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteChild,
    onSuccess: (data) => {
      toast({
        title: "Removed Successfully",
      });
      // Invalidate the query related to "children"
      queryClient.invalidateQueries(["children"]);

      // Optionally invalidate a specific child's query
      queryClient.invalidateQueries(["child", data.id]);
    },
    onError: (error) => {
      console.error("Error deleting child:", error.message);
      toast({
        title: "Failed to remove",
        variant: "destructive",
      });
    },
  });
};

const useFetchFamilyId = (userId) => {
  return useQuery({
    queryKey: ["family_group", userId], // Include userId in the query key to ensure unique caching
    queryFn: () => getFamilyId(userId), // Pass the userId to getGuardian
    enabled: !!userId, // Only run the query if userId is available
  });
};

const useFetchGuardian = (familyId) => {
  return useQuery({
    queryKey: ["parents", familyId], // Include userId in the query key to ensure unique caching
    queryFn: () => getGuardian(familyId), // Pass the userId to getGuardian
    enabled: !!familyId, // Only run the query if userId is available
  });
};

const useFetchChildren = (familyId) => {
  return useQuery({
    queryKey: ["children", familyId], // Include userId in the query key to ensure unique caching
    queryFn: () => getChildren(familyId), // Pass the userId to getGuardian
    enabled: !!familyId, // Only run the query if userId is available
  });
};

export {
  useAddFamily,
  useEditParent,
  useEditChild,
  useDeleteParent,
  useDeleteChild,
  useFetchFamilyId,
  useFetchGuardian,
  useFetchChildren,
};
