import { useUser } from "@/context/useUser";
import AnnouncementHeader from "../Announcements/AnnouncementHeader";
import { useSearchParams } from "react-router-dom";
import Announcement from "../Announcements/Announcement";
import useAnnouncements from "@/hooks/useAnnouncements";
import { Skeleton } from "../ui/skeleton";
import useInterObserver from "@/hooks/useInterObserver";
import PropTypes from "prop-types";
import FoldedPaper from "@/assets/images/FoldedPaper.png";

const GroupAnnouncements = ({ groupId }) => {
  const [searchParams] = useSearchParams();
  const { userData } = useUser();

  // Use the passed groupId prop or fall back to search params
  const groupIdToUse = groupId || searchParams.get("groupId");

  const {
    fetchNextPage,
    deleteAnnouncementMutation,
    hasNextPage,
    data,
    isLoading,
  } = useAnnouncements({
    user_id: userData?.id,
    group_id: groupIdToUse,
  });

  const { ref } = useInterObserver(fetchNextPage);

  // Check if user is coordinator for this ministry

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
        <div className="mt-32 flex flex-col gap-y-6">
          <div>
            <img src={FoldedPaper} alt="Folded Paper" className="mx-auto" />
          </div>
          <p className="text-center text-[20px] text-accent/30">
            No announcements yet.
          </p>
        </div>
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

GroupAnnouncements.propTypes = {
  ministryId: PropTypes.string,
  groupId: PropTypes.string,
};

export default GroupAnnouncements;
