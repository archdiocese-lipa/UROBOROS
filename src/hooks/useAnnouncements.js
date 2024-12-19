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

const useAnnouncements = ({
  ministry_id,
  user_id,
}) => {
  const queryClient = useQueryClient();

  const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["announcements", ministry_id],
    queryFn: async ({ pageParam }) => {
      const response = await fetchAnnouncements(pageParam, 2, ministry_id);
      return response;
    },
    enabled: !!ministry_id,

    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.nextPage) {
        return lastPage.currentPage + 1;
      }
    },
  });

  const addAnnouncementMutation = useMutation({
    mutationFn: async ({ announcementData }) =>
      await createAnnouncements({ announcementData, user_id }),

    onMutate: async ({ announcementData, first_name, last_name }) => {
      const newestAnnouncement = {
        ...announcementData,
        file_url: announcementData?.file
          ? URL.createObjectURL(announcementData?.file)
          : "",
        users: { last_name, first_name },
      };

      // Cancel active queries to prevent unwanted re-fetching
      await queryClient.cancelQueries(["announcements", ministry_id]);

      // Get the previous state for rollback
      const previousAnnouncements = queryClient.getQueryData([
        "announcements",
        ministry_id,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData(["announcements", ministry_id], (old) => {
        const existingItems = old.pages.map((page) => page.items);
        const isDuplicate = existingItems.some(
          (item) => item.id === newestAnnouncement.id
        );

        if (isDuplicate) return old; // Prevent adding duplicates

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: [newestAnnouncement, ...page.items],
          })),
        };
      });

      return { previousAnnouncements };
    },

    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement created.",
      });
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
    onMutate: async ({ announcementData, first_name, last_name }) => {
      const newestAnnouncement = {
        ...announcementData,
        file_url: announcementData?.file
          ? URL.createObjectURL(announcementData?.file)
          : "",
        users: { last_name, first_name },
      };

      // Cancel active queries to prevent unwanted re-fetching
      await queryClient.cancelQueries(["announcements", ministry_id]);

      // Get the previous state for rollback
      const previousAnnouncements = queryClient.getQueryData([
        "announcements",
        ministry_id,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData(["announcements", ministry_id], (old) => {
        const existingItems = old.pages.map(page => page.items);
        const isDuplicate = existingItems.some(item => item.id === newestAnnouncement.id);

        if (isDuplicate) return old; // Prevent adding duplicates

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: [newestAnnouncement, ...page.items],
          })),
        };
      });

      return { previousAnnouncements };
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: `Announcement edited`,
      });
    },
    onError: (error, context) => {
      queryClient.setQueryData(
        ["announcements", ministry_id],
        context.previousAnnouncements
      );
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
    onMutate: async ({ announcement_id }) => {
      // Cancel active queries to prevent unwanted re-fetching

 
      await queryClient.cancelQueries(["announcements", ministry_id]);

      // Get the previous state for rollback
      const previousAnnouncements = queryClient.getQueryData([
        "announcements",
        ministry_id,
      ]);

      // // Optimistically update the cache
      queryClient.setQueryData(["announcements", ministry_id], (old) => {

        const newPages = old.pages.map((page) => ({
          ...old,
          items: page?.items
            ? page?.items.filter((item) => item.id !== announcement_id)
            : [],
        }));


        return {
          ...old,
          pages: newPages
        }
      });

      return { previousAnnouncements };
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: `Announcement deleted`,
      });
   
    },
    onError: (error, context) => {
      queryClient.setQueryData(
        ["announcements", ministry_id],
        context.previousAnnouncements
      );
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
