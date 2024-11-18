import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PersonIcon from "@/assets/icons/person-icon.svg";

const Filter = () => {
  return (
    <div className=" rounded-xl bg-white border border-gray mb-2">
      <div className="  py-3 px-[18px] ">
        <div className="flex justify-between">
          <h3 className=" text-accent font-bold">Group</h3>
          <div className="hover:cursor-pointer flex gap-1 items-center justify-center w-12 h-6 bg-primary text-accent rounded-[18.5px] py-3 px-3">
            <p className=" text-sm text-accent font-semibold">1</p>
            <img src={PersonIcon} alt={`up icon`} className="h-4 w-4" />
          </div>
        </div>
        <p className=" text-accent font-medium pb-1 opacity-60 text-[13px]">
          This shows all group announcements
        </p>
        <div className="flex justify-start relative w-full h-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                left: `${i * 20}px`,
                zIndex: 999 - i,
              }}
              className={`absolute p-[3px] bg-white  rounded-full`}
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
