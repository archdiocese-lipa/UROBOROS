import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[#d9cdc7] dark:bg-neutral-800",
        className
      )}
      {...props}
    />
  );
};

Skeleton.propTypes = {
  className: PropTypes.string,
};

export { Skeleton };
