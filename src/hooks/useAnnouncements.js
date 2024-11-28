import {
  createAnnouncements,
  deleteAnnouncement,
  editAnnouncement,
  fetchAnnouncements,
} from "@/services/AnnouncementsService";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "./use-toast";

const useAnnouncements = (ministry_id) => {
  const queryClient = useQueryClient();

  const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["announcements", ministry_id],
    queryFn: async ({ pageParam }) => {
      const response = await fetchAnnouncements(pageParam, 1, ministry_id);

      console.log("response", response);

      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.nextPage) {
        return lastPage.currentPage + 1;
      }
    },
  });

  const addAnnouncementMutation = useMutation({
    mutationFn: async (announcementData) =>
      await createAnnouncements(announcementData),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["announcements", ministry_id],
      });

      // Get the previous announcements from the cache
      const previousAnnouncements = queryClient.getQueryData([
        "announcements",
        ministry_id,
      ]);

      // Update the cache by adding the new announcement
      queryClient.setQueryData(["announcements", ministry_id], (old) => {
        const newData = old?.pages?.flatMap((page) =>
          page.items.map((announcement) => announcement)
        );
 
        // Check if 'old' is iterable (an array), else fallback to an empty array
        return { ...old, pages: newData };
      });

      // Return the previous state for rollback in case of an error
      return { previousAnnouncements };
    },

    onSuccess: (data, { reset, setIsOpen }) => {
      toast({
        title: "Success",
        description: "Announcement created.",
      });
      reset();
      setIsOpen(false);
    },

    onError: (error, context) => {
      // Rollback the cache to its previous state in case of an error
      queryClient.setQueryData(
        ["announcements", ministry_id],
        context.previousAnnouncements
      );
      toast({
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["announcements", ministry_id],
      });
    },
  });

  const editAnnouncementMutation = useMutation({
    mutationFn: async ({ announcementData }) =>
      await editAnnouncement(announcementData),
    onSuccess: (data, { setEditDialogOpen }) => {
      toast({
        title: "Success!",
        description: `Announcement edited`,
      });
      setEditDialogOpen(false);
    },
    // onMutate: async () => {
    //     await queryClient.cancelQueries({
    //       queryKey: ["announcements", ministry_id],
    //     });
  
    //     // Get the previous announcements from the cache
    //     const previousAnnouncements = queryClient.getQueryData([
    //       "announcements",
    //       ministry_id,
    //     ]);
  
    //     // Update the cache by adding the new announcement
    //     queryClient.setQueryData(["announcements", ministry_id], (old) => {
    //       const newData = old?.pages?.flatMap((page) =>
    //         page.items.map((announcement) => announcement)
    //       );
   
    //       // Check if 'old' is iterable (an array), else fallback to an empty array
    //       return { ...old, pages: newData };
    //     });
  
    //     // Return the previous state for rollback in case of an error
    //     return { previousAnnouncements };
    //   },
    onError: (error) => {
      toast({
        title: "Error",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["announcements", ministry_id],
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
        queryKey: ["announcements", ministry_id],
      });
    },
  });

  console.log("data before returning", data);
  return {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    addAnnouncementMutation,
    deleteAnnouncementMutation,
    editAnnouncementMutation,
  };
};

export default useAnnouncements;
