import EyeIcon from "@/assets/icons/eye-icon.svg";
import { Separator } from "@/components/ui/separator";
import GlobeIcon from "@/assets/icons/globe-icon.svg";
import KebabIcon from "@/assets/icons/horizontal-kebab-icon.svg";
import LikeIcon from "@/assets/icons/like-icon.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const dummyData = [
  {
    image: "",
    name: "Tristan Santos",
    content:
      " Hi this is my sample comment Hi this is my sample comment Hi this is my sample comment Hi this is my sample comment Hi this is my sample comment Hi this is my sample comment Hi this is my sample comment Hi this is my sample comment",
  },
  {
    image: "",
    name: "Kerby Sarcia",
    content: " Hi this another sample comment",
  },
];


const Announcement = () => {
  return (
    <div>
      <div className="flex justify-between mb-3">
        <div>
          <h2 className="text-lg text-accent font-bold">Group A</h2>
          <div className=" flex gap-2">
            <p className="font-bold text-accent text-sm">John Doe</p>
            <p className="text-accent text-sm">14-Oct-2024, 13:50</p>
            <img src={GlobeIcon} alt="icon" />
          </div>
        </div>
        <img className="hover:cursor-pointer" src={KebabIcon} alt="icon" />
      </div>
      <p className="text-accent text-justify mb-4">
        This is a sample announcement containing a LINK. This is a sample
        announcement containing a LINK. This is a sample announcement containing
        a LINK. This is a sample announcement containing a LINK. This is a
        sample announcement containing a LINK. This is a sample announcement
        containing a LINK.
      </p>
      <div className="flex justify-between items-end">
        <div className="hover:cursor-pointer flex items-center justify-center w-14 h-8 bg-blue text-white rounded-[18.5px] py-3 px-3">
          <img src={LikeIcon} alt={`up icon`} className="h-5 w-5" />
          <p>1</p>
        </div>
        <div className="hover:cursor-pointer flex gap-1 items-center justify-center w-12 h-6 bg-primary text-accent rounded-[18.5px] py-3 px-3">
          <img src={EyeIcon} alt={`up icon`} className="h-5 w-5" />
          <p className=" font-semibold text-sm text-accent">1</p>
        </div>
      </div>
      <Separator className="my-5" />
      <div>
        {dummyData.map((comment, i) => (
          <div className="flex items-start gap-2 mb-2" key={i}>
            <Avatar className=" w-7 h-7">
              <AvatarImage src={comment.image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className=" relative bg-primary rounded-2xl text-justify py-3 px-5">
              <p>{comment.content}</p>
              <div className="absolute right-7 p-1 bg-white rounded-full">
                <div className=" hover:cursor-pointer flex gap-1 items-center justify-center w-12 h-6 bg-blue text-accent rounded-[18.5px] py-3 px-3">
                  <img src={LikeIcon} alt={`up icon`} className="h-5 w-5" />
                  <p className=" font-semibold text-sm text-white">1</p>
                </div>
              </div>
            </div>
            <img className="hover:cursor-pointer" src={KebabIcon} alt="icon" />
          </div>
        ))}
        <button className=" ml-12 text-accent opacity-85 font-semibold">
          View all comments ({dummyData.length})
        </button>
      </div>

      <div className=" flex items-center gap-2">
        <Avatar className=" w-7 h-7">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Input placeholder="Write a comment..." />
      </div>
    </div>
  );
};

export default Announcement;
