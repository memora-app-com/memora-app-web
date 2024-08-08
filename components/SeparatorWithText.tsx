import React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

const SeparatorWithText = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    text: string;
  }
>(
  (
    {
      text,
      className,
      orientation = "horizontal",
      decorative = true,
      ...props
    },
    ref
  ) => (
    <div
      className={cn(
        "flex items-center mt-4",
        orientation === "horizontal" ? "flex-row w-full" : "flex-col h-full",
        className
      )}
    >
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-border",
          orientation === "horizontal"
            ? "h-[1px] flex-grow"
            : "w-[1px] flex-grow",
          className
        )}
        {...props}
      />
      <span
        className={cn(
          "mx-2 text-sm",
          orientation === "horizontal" ? "px-2" : "py-2"
        )}
      >
        {text}
      </span>
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-border",
          orientation === "horizontal"
            ? "h-[1px] flex-grow"
            : "w-[1px] flex-grow",
          className
        )}
        {...props}
      />
    </div>
  )
);
SeparatorWithText.displayName = "SeparatorWithText";

export default SeparatorWithText;
