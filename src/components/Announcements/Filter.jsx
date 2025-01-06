import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {  PersonIcon } from "@/assets/icons/icons";
import { cn, getInitial } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchMinistryMembersFirstNamesAndCount } from "@/services/ministryService";
import PropTypes from "prop-types";
import { memo } from "react";

const Filter = ({
  ministry,
  selectedMinistry,
  setSelectedMinistry,
}) => {
  const { data: ministryData, isLoading } = useQuery({
    queryKey: ["ministryMemberCount", ministry.id],
    queryFn: () => fetchMinistryMembersFirstNamesAndCount(ministry.id),
  });

  if (isLoading) return null;


  return (
    <div
      className={cn(
        "max-h-20 w-full rounded-xl border border-gray bg-white lg:mb-3 lg:h-fit lg:max-h-none",
        {
          "bg-accent": ministry.id === selectedMinistry,
        }
      )}
    >
      <button
        onClick={() => {
          setSelectedMinistry({ministryId:ministry.id})
        }}
        className="relative h-full px-[18px] py-3"
      >
        <div className="flex justify-between gap-3 lg:flex-wrap">
          <h3
            className={cn(
              "text-nowrap text-start font-bold text-accent lg:text-wrap",
              {
                "text-white": ministry.id === selectedMinistry,
              }
            )}
          >
            {ministry.ministry_name}
          </h3>
          <div className="flex h-6 w-12 items-center justify-center gap-1 rounded-[18.5px] bg-primary px-3 py-3 text-accent hover:cursor-pointer">
            <p className="text-sm font-semibold text-accent">
              {ministryData.count}
            </p>
            <PersonIcon className="h-4 w-4 text-accent" />
          </div>
        </div>
        <p
          className={cn(
            "hidden pb-1 text-start text-[13px] font-medium text-accent opacity-60 lg:block",
            {
              "text-white": ministry.id === selectedMinistry,
            }
          )}
        >
          This shows all {ministry.ministry_name} announcements
        </p>
        <div className="relative hidden h-8 w-full flex-row-reverse justify-end lg:flex">
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
              <Avatar className="h-5 w-5">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-xs">
                  {getInitial(name)}
                </AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
        {selectedMinistry === ministry.id && (
          <div className="-left-4 top-1/2 hidden h-8 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-accent lg:absolute lg:block"></div>
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
  selectedMinistry: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  setSelectedMinistry: PropTypes.func.isRequired,
};

export default memo(Filter);
