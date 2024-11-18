import * as React from "react";
import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full font-montserrat rounded-3xl border border-neutral-200 bg-primary px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
};

export { Input };
