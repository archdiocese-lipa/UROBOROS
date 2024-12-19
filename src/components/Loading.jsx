import { Icon } from "@iconify/react";

const Loading = () => {
return (
    <div className="flex w-full h-full items-center justify-center">
        <Icon className="h-14 w-14 animate-spin" icon="eos-icons:loading" />
    </div>
);
};

export default Loading;
