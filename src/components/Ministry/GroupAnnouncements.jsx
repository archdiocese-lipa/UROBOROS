import { useUser } from "@/context/useUser";
import AnnouncementHeader from "../Announcements/AnnouncementHeader";
import { useSearchParams } from "react-router-dom";
import Announcement from "../Announcements/Announcement";
import useAnnouncements from "@/hooks/useAnnouncements";
import { Skeleton } from "../ui/skeleton";
import useInterObserver from "@/hooks/useInterObserver";

const GroupAnnouncements = () => {
  const [searchParams] = useSearchParams();

  const { userData } = useUser();

  const {
    fetchNextPage,
    deleteAnnouncementMutation,
    hasNextPage,
    data,
    isLoading,
  } = useAnnouncements({
    user_id: userData?.id,
    group_id: searchParams.get("groupId"),
  });

  const { ref } = useInterObserver(fetchNextPage);

  return (
    <div className="mx-auto flex h-full w-full max-w-[530px] flex-col pt-4">
      <AnnouncementHeader
        image={userData.user_image}
        first_name={userData.first_name}
      />
      {isLoading ? (
        Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="w-full">
            <Skeleton className="mb-2 h-5 w-44" />
            <Skeleton className="mb-2 h-5 w-80" />
            <Skeleton className="mb-2 h-44 w-full" />
          </div>
        ))
      ) : data?.pages?.flatMap((page) => page.items).length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        data?.pages?.flatMap((page) =>
          page?.items?.map((announcement) => (
            <div
              key={announcement.id}
              className="mb-3 w-full rounded-lg border border-primary-outline bg-[#f9f7f7b9] px-4 pb-6 pt-3 md:bg-white md:px-8 md:pt-5"
            >
              <Announcement
                announcement={announcement}
                deleteAnnouncementMutation={deleteAnnouncementMutation}
              />
            </div>
          ))
        )
      )}
      {hasNextPage && <div className="mt-20" ref={ref}></div>}
    </div>
  );
};

export default GroupAnnouncements;
