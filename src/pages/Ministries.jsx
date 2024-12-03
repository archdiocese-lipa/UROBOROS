import CreateMinistry from "@/components/Ministry/CreateMinistry";
import MinistryCard from "@/components/Ministry/MinistryCard";
import { Description, Title } from "@/components/Title";
import { useFetchMinistries } from "@/hooks/useFetchMinistries";

const Ministries = () => {
  const { data: ministries } = useFetchMinistries();

  const ministryData = ministries?.data;

  return (
    <div className="relative h-full flex flex-col gap-y-5">
      <div className="fixed bottom-20 right-7 z-10 md:bottom-10">
        <CreateMinistry />
      </div>

      <div>
        <Title>Ministry Management</Title>
        <Description>Manage your ministry.</Description>
      </div>

      {/* Render MinistryCard components if data exists */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-2 h-full overflow-scroll no-scrollbar">
        {ministryData?.map((ministry) => (
          <MinistryCard
            key={ministry.id} // Use `ministry.id` as the key for each card
            ministryId={ministry.id} // Pass the ministry ID to the MinistryCard
            title={ministry.ministry_name} // Pass ministry properties
            description={ministry.ministry_description}
            createdDate={ministry.created_at} // Assuming created_at is the date field
          />
        ))}
      </div>
    </div>
  );
};

export default Ministries;
