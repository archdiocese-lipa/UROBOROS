import { Description, Title } from "@/components/Title";
import { useUser } from "@/context/useUser";
import PollCard from "@/components/Poll/PollCard";
import useFetchPolls from "@/hooks/Poll/useFetchPolls";
import CreatePoll from "@/components/Poll/CreatePoll";
import { useState } from "react";

const Polls = () => {
  const { userData, isLoading: isUserLoading } = useUser();
  const { data: polls, isLoading: isPollsLoading, error } = useFetchPolls();
  const [fetchError, setFetchError] = useState(null);

  if (error) {
    setFetchError(error.message);
  }

  if (isUserLoading) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="relative flex flex-col gap-y-5">
      {userData?.role === "admin" && (
        <div className="fixed bottom-20 right-7 z-10 md:bottom-10">
          <CreatePoll />
        </div>
      )}
      <div>
        <Title>Poll Management</Title>
        <Description>Manage polls within your organization.</Description>
      </div>

      {isPollsLoading ? (
        <p>Loading polls...</p>
      ) : fetchError ? (
        <p>Error fetching polls: {fetchError}</p>
      ) : (
        <div className="flex flex-col gap-4 p-2">
          {polls?.length < 1 ? (
            <p>No polls have been created yet.</p>
          ) : (
            polls.map((poll) => (
              <PollCard
                key={poll.poll_id}
                pollId={poll.poll_id}
                title={poll.poll_name}
                description={poll.poll_description}
                createdDate={poll.created_on}
                status={poll.status}
                userRole={userData?.role}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Polls;
