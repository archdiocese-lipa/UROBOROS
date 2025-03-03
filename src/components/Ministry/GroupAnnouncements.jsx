import { useUser } from "@/context/useUser";
import AnnouncementHeader from "../Announcements/AnnouncementHeader";

const GroupAnnouncements = () => {
  const { userData } = useUser();

  return (
    <div className="flex w-full max-w-[530px] flex-col pt-4">
      <AnnouncementHeader
        image={userData.user_image}
        first_name={userData.first_name}
      />

      {/* <div
        key={announcement.id}
        className="mb-3 w-full rounded-lg border border-primary-outline bg-[#f9f7f7b9] px-4 pb-6 pt-3 md:bg-white md:px-8 md:pt-5"
      >
        <Announcement
          ministries={ministries}
          announcement={announcement}
          editAnnouncementMutation={editAnnouncementMutation}
          deleteAnnouncementMutation={deleteAnnouncementMutation}
        />
      </div> */}
    </div>
  );
};

export default GroupAnnouncements;
