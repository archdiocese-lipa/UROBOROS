import {
  createAnnouncements,
  deleteAnnouncement,
  editAnnouncement,
  fetchAnnouncements,
} from "@/services/AnnouncementsService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";

const useAnnouncements = (ministry_id) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey:  ["announcements",ministry_id],
    queryFn: async () => await fetchAnnouncements(ministry_id),
  });

  const addAnnouncementMutation = useMutation({
    mutationFn: async (announcementData) =>
      await createAnnouncements(announcementData),
    onSuccess: (data, { reset, setIsOpen }) => {
      toast({
        title: "Success",
        description: "Announcement created.",
      });
      reset();
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["announcements",ministry_id],
      });
    },
  });

  const editAnnouncementMutation = useMutation({
    mutationFn: async ({announcementData}) =>
      await editAnnouncement(announcementData),
    onSuccess: (data, { setEditDialogOpen }) => {
      toast({
        title: "Success!",
        description: `Announcement edited`,
      });
      setEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["announcements",ministry_id],
      });
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (announcementData) =>
      await deleteAnnouncement(announcementData),
    onSuccess: (data, { setDeleteDialogOpen }) => {
      toast({
        title: "Success!",
        description: `Announcement deleted`,
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["announcements",ministry_id],
      });
    },
  });

  return {
    data,
    isLoading,
    addAnnouncementMutation,
    deleteAnnouncementMutation,
    editAnnouncementMutation
  };
};

export default useAnnouncements;
