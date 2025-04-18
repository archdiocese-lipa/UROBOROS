import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef(
  ({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-64 origin-[--radix-hover-card-content-transform-origin] rounded-md border border-neutral-200 bg-white p-4 text-neutral-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50",
        className
      )}
      {...props}
    />
  )
);
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

HoverCardContent.propTypes = {
  className: PropTypes.string,
  align: PropTypes.oneOf(["start", "center", "end"]),
  sideOffset: PropTypes.number,
  children: PropTypes.node,
};

export { HoverCard, HoverCardTrigger, HoverCardContent };
