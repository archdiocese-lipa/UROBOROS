import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PersonIcon from "@/assets/icons/person-icon.svg";
import { cn, getInitial } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchMinistryMembersFirstNamesAndCount  } from "@/services/ministryService";
import PropTypes from "prop-types";


const Filter = ({
  ministry,
  selectedMinistry,
  setSelectedMinistry,
  setVisibility,
}) => {

  const {
    data: ministryData,
    isLoading,
  } = useQuery({
    queryKey: ["ministryMemberCount", ministry.id],
    queryFn: () => fetchMinistryMembersFirstNamesAndCount (ministry.id),
  });

  if (isLoading) return null;
  // if (isError) return <p>Error: {error.message}</p>;


  // console.log("ministry id", ministry.id,"selected id", selectedMinistry)
  return (
    <div
      className={cn(" lg:mb-3 rounded-xl border border-gray w-full   max-h-20 lg:max-h-none lg:h-fit bg-white ", {
        "bg-accent": ministry.id === selectedMinistry,
      })}
    >
      <button
        onClick={() => {
          setSelectedMinistry(ministry.id), setVisibility("private");
        }}
        className="relative h-full px-[18px] py-3"
      >
        <div className="flex gap-3 justify-between lg:flex-wrap">
          <h3
            className={cn("font-bold text-start text-nowrap lg:text-wrap text-accent", {
              "text-white": ministry.id === selectedMinistry,
            })}
          >
            {ministry.ministry_name}
          </h3>
          <div className="flex h-6 w-12 items-center justify-center gap-1 rounded-[18.5px] bg-primary px-3 py-3 text-accent hover:cursor-pointer">
            <p className="text-sm font-semibold text-accent">{ministryData.count}</p>
            <img src={PersonIcon} alt={`up icon`} className="h-4 w-4" />
          </div>
        </div>
        <p
          className={cn(
            "pb-1 hidden lg:block text-start text-[13px] font-medium text-accent opacity-60",
            {
              "text-white": ministry.id === selectedMinistry,
            }
          )}
        >
          This shows all {ministry.ministry_name} announcements
        </p>
        <div className="relative hidden lg:flex h-8 w-full justify-start">
          {ministryData.firstNames.map((name, i) => (
            <div
              key={i}
              style={{
                left: `${i * 20}px`,
                zIndex: 10 - i,
              }}
              className={cn(`absolute rounded-full bg-white p-[3px]`, {
                "bg-accent": ministry.id === selectedMinistry,
              })}
            >
              <Avatar className="h-5 w-5 ">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs bg-primary">{getInitial(name)}</AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
        {selectedMinistry === ministry.id && (
          <div className=" hidden lg:block bg-accent lg:absolute -left-4 top-1/2 h-8 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-md"></div>
        )}
      </button>
    </div>
  );
};
Filter.propTypes = {
  ministry: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    ministry_name: PropTypes.string.isRequired,
  }).isRequired,
  selectedMinistry: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setSelectedMinistry: PropTypes.func.isRequired,
  setVisibility: PropTypes.func.isRequired,
};

export default Filter;
