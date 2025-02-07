import Loading from "@/components/Loading";
import CreateMinistry from "@/components/Ministry/CreateMinistry";
import MinistryCard from "@/components/Ministry/MinistryCard";
import { Description, Title } from "@/components/Title";
import { ROLES } from "@/constants/roles";
import { useUser } from "@/context/useUser";
import useMinistry from "@/hooks/useMinistry";
import useRoleSwitcher from "@/hooks/useRoleSwitcher";

const Ministries = () => {
  const { temporaryRole } = useRoleSwitcher();
  const { userData } = useUser();
  const { ministries, ministryLoading } = useMinistry({
    userId: userData?.id,
    temporaryRole,
  });

  return (
    <div className="relative flex h-full flex-col gap-y-5">
      <div className="fixed bottom-20 right-7 z-10 md:bottom-10">
        <CreateMinistry />
      </div>

      <div>
        <Title>Ministry Management</Title>
        <Description>Manage groups within your ministry.</Description>{" "}
      </div>

      {/* Render loading state while fetching data */}
      {ministryLoading ? (
        <Loading />
      ) : (
        <div className="no-scrollbar grid h-full w-full gap-4 overflow-scroll p-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {/* Check if ministries exist after loading */}
          {ministries?.length === 0 ? (
            <p>
              {temporaryRole === ROLES[4]
                ? "No groups have been created yet."
                : "No assigned group yet."}
            </p>
          ) : (
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

export default Ministries;
