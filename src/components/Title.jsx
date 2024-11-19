import { forwardRef } from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

const Title = forwardRef(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn("text-[26px] font-bold text-accent", className)}
    {...props}
  />
));

Title.displayName = "Title";

Title.propTypes = {
  className: PropTypes.string,
};

const Description = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm lg:text-base text-accent opacity-60", className)}
    {...props}
  />
));

Description.displayName = "Description";

Description.propTypes = {
  className: PropTypes.string,
};

export { Title, Description };
