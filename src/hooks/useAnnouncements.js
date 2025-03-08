import {
  createAnnouncements,
  deleteAnnouncement,
  editAnnouncement,
  fetchAnnouncementsV2,
} from "@/services/AnnouncementsService";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "./use-toast";

const useAnnouncements = ({ group_id }) => {
  const queryClient = useQueryClient();

  const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["announcements", group_id],
    queryFn: async ({ pageParam }) => {
      const response = await fetchAnnouncementsV2(pageParam, 10, group_id);
      return response;
    },
    // enabled: !!group_id,

    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.nextPage) {
        return lastPage.currentPage + 1;
      }
    },
  });

  const addAnnouncementMutation = useMutation({
    mutationFn: createAnnouncements,

    // onMutate: async ({ announcementData, first_name, last_name }) => {
    //   const newestAnnouncement = {
    //     ...announcementData,
    //     file_url: announcementData?.file
    //       ? URL.createObjectURL(announcementData?.file)
    //       : "",
    //     users: { last_name, first_name },
    //   };

    //   // Cancel active queries to prevent unwanted re-fetching
    //   await queryClient.cancelQueries(["announcements", group_id]);

    //   // Get the previous state for rollback
    //   const previousAnnouncements = queryClient.getQueryData([
    //     "announcements",
    //     group_id,
    //   ]);

    //   // Optimistically update the cache
    //   queryClient.setQueryData(["announcements", group_id], (old) => {
    //     const existingItems = old.pages.map((page) => page.items);
    //     const isDuplicate = existingItems.some(
    //       (item) => item.id === newestAnnouncement.id
    //     );

    //     if (isDuplicate) return old; // Prevent adding duplicates

    //     return {
    //       ...old,
    //       pages: old.pages.map((page) => ({
    //         ...page,
    //         items: [newestAnnouncement, ...page.items],
    //       })),
    //     };
    //   });

    //   return { previousAnnouncements };
    // },

    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement created.",
      });
    },

    onError: (error, context) => {
      // Rollback the cache to its previous state in case of an error
      queryClient.setQueryData(
        ["announcements", group_id],
        context.previousAnnouncements
      );
      toast({
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["announcements", group_id],
      });
    },
  });

  const editAnnouncementMutation = useMutation({
    mutationFn: editAnnouncement,
    // onMutate: async ({ announcementData, first_name, last_name }) => {
    //   const newestAnnouncement = {
    //     ...announcementData,
    //     file_url: announcementData?.file
    //       ? URL.createObjectURL(announcementData?.file)
    //       : "",
    //     users: { last_name, first_name },
    //   };

    //   // Cancel active queries to prevent unwanted re-fetching
    //   await queryClient.cancelQueries(["announcements", group_id]);

    //   // Get the previous state for rollback
    //   const previousAnnouncements = queryClient.getQueryData([
    //     "announcements",
    //     group_id,
    //   ]);

    //   // Optimistically update the cache
    //   queryClient.setQueryData(["announcements", group_id], (old) => {
    //     const existingItems = old.pages.map((page) => page.items);
    //     const isDuplicate = existingItems.some(
    //       (item) => item.id === newestAnnouncement.id
    //     );

    //     if (isDuplicate) return old; // Prevent adding duplicates

    //     return {
    //       ...old,
    //       pages: old.pages.map((page) => ({
    //         ...page,
    //         items: [newestAnnouncement, ...page.items],
    //       })),
    //     };
    //   });

    //   return { previousAnnouncements };
    // },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: `Announcement edited`,
      });
    },
    onError: (error, context) => {
      queryClient.setQueryData(
        ["announcements", group_id],
        context.previousAnnouncements
      );
      toast({
        title: "Error",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["announcements", group_id],
      });
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (announcementData) =>
      await deleteAnnouncement(announcementData),
    // onMutate: async ({ announcement_id }) => {
    //   // Cancel active queries to prevent unwanted re-fetching

    //   await queryClient.cancelQueries(["announcements", group_id]);

    //   // Get the previous state for rollback
    //   const previousAnnouncements = queryClient.getQueryData([
    //     "announcements",
    //     group_id,
    //   ]);

    //   // // Optimistically update the cache
    //   queryClient.setQueryData(["announcements", group_id], (old) => {
    //     const newPages = old.pages.map((page) => ({
    //       ...old,
    //       items: page?.items
    //         ? page?.items.filter((item) => item.id !== announcement_id)
    //         : [],
    //     }));

    //     return {
    //       ...old,
    //       pages: newPages,
    //     };
    //   });

    //   return { previousAnnouncements };
    // },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: `Announcement deleted`,
      });
    },
    onError: (error, context) => {
      queryClient.setQueryData(
        ["announcements", group_id],
        context.previousAnnouncements
      );
      toast({
        title: "Error",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["announcements", group_id],
      });
    },
  });

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
