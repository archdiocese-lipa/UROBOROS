import { useQuery } from "@tanstack/react-query";
import PollService from "@/services/PollService";

const useFetchPolls = () => {
  return useQuery({
    queryKey: ["polls"],
    queryFn: PollService.getPolls,
  });
};

export default useFetchPolls;
