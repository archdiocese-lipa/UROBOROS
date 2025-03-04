import Loading from "@/components/Loading";
import CreateMinistry from "@/components/Ministry/CreateMinistry";
import MinistryCard from "@/components/Ministry/MinistryCard";
import { Description, Title } from "@/components/Title";
import useMinistry from "@/hooks/useMinistry";

const AdminViewMinistry = () => {
  const { ministries, ministryLoading } = useMinistry({});

  return (
    <div className="relative flex h-full flex-col gap-y-5 p-0">
      <div className="items-center justify-between space-y-2 border-b border-primary-outline p-6 md:flex">
        <div>
          <Title>Ministry Management</Title>
          <Description>Manage your ministry.</Description>
        </div>
        <div>
          <CreateMinistry />
        </div>
      </div>

      {/* Render loading state while fetching data */}
      {ministryLoading ? (
        <Loading />
      ) : (
        <div className="no-scrollbar grid h-full w-full gap-4 overflow-scroll p-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {/* Check if ministries exist after loading */}
          {ministries?.length === 0 ? (
            <p>No ministry have been created yet.</p>
          ) : (
            // <p>
            //   {temporaryRole === ROLES[4]
            //     ? "No groups have been created yet."
            //     : "No assigned group yet."}
            // </p>
            ministries?.map((ministry) => (
              <MinistryCard
                key={ministry.id}
                coordinators={ministry.ministry_coordinators}
                ministryId={ministry.id}
                title={ministry.ministry_name}
                description={ministry.ministry_description}
                createdDate={ministry.created_at}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminViewMinistry;
