import { LoadingIcon } from "@/assets/icons/icons";

const Loading = () => {
  return (
    <div className="flex w-full h-full items-center animate-spin justify-center">
      <LoadingIcon
        className="h-14 w-14"
      />
    </div>
  );
};

export default Loading;
