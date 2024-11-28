import useUserMinistries from "@/hooks/useUserMinistries";

const Dashboard = () => {
  const { error, isLoading } = useUserMinistries(); // Use the hook

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div className="text-heading font-bold text-accent">Dashboard</div>;
};

export default Dashboard;
