import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createGroup,
  editGroup,
  fetchGroups,
  fetchGroupMembers,
} from "@/services/groupServices";
import { toast } from "./use-toast";

const useGroups = ({ ministryId, groupId }) => {
  const queryClient = useQueryClient();

  const groups = useQuery({
    queryKey: ["groups", ministryId],
    queryFn: async () => await fetchGroups(ministryId),
    enabled: !!ministryId,
  });

  const groupmembers = useQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: async () => await fetchGroupMembers(groupId),
    enabled: !!groupId,
  });

  const addGroupMembersMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Member added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error adding member",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["groupMembers", groupId]);
    },
  });
  const removeGroupMembersMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error removing member",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["groupMembers", groupId]);
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Group created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error creating group",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["groups", ministryId]);
    },
  });

  const editGroupMutation = useMutation({
    mutationFn: editGroup,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Group edited successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error editting group",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["groups", ministryId]);
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: editGroup,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error deleting group",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["groups", ministryId]);
    },
  });

  return {
    deleteGroupMutation,
    editGroupMutation,
    createGroupMutation,
    groups,
    groupmembers,
    addGroupMembersMutation,
    removeGroupMembersMutation,
  };
};

export default useGroups;
