import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateChild, deleteChild, updateParent, deleteParent } from "@/services/familyService";
import { useToast } from "./use-toast";

// Edit parent
export const useEditParent = () => {
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
export const useDeleteParent = () => {
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
export const useEditChild = () => {
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
export const useDeleteChild = () => {
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
