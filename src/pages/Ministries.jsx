import Loading from "@/components/Loading";
import CreateMinistry from "@/components/Ministry/CreateMinistry";
import MinistryCard from "@/components/Ministry/MinistryCard";
import { Description, Title } from "@/components/Title";
import useMinistry from "@/hooks/useMinistry";

const Ministries = () => {
  const { ministries, ministryLoading } = useMinistry({});

  return (
    <div className="relative flex h-full flex-col gap-y-5">
      <div className="fixed bottom-20 right-7 z-10 md:bottom-10">
        <CreateMinistry />
      </div>

      <div>
        <Title>Group Management</Title>
        <Description>Manage your groups.</Description>
      </div>

      {/* Render MinistryCard components if data exists */}
      {ministryLoading ? (
        <Loading />
      ) : (
        <div className="no-scrollbar grid h-full w-full gap-4 overflow-scroll p-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {ministries?.data?.length < 1 ? (
            <p>No groups have been created yet.</p>
          ) : (
            ministries?.data?.map((ministry) => (
              <MinistryCard
                key={ministry.id} // Use `ministry.id` as the key for each card
                ministryId={ministry.id} // Pass the ministry ID to the MinistryCard
                title={ministry.ministry_name} // Pass ministry properties
                description={ministry.ministry_description}
                createdDate={ministry.created_at} // Assuming created_at is the date field
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Ministries;
