import { cn } from "@/lib/utils";
import React from "react";

const HeartCircle: React.FC<{ className?: string }> = (props) => {
  return (
    <div
      className={cn(
        props.className,
        `
        w-12 h-12
        flex items-center justify-center
        rounded-full
        bg-primary
        ring-2
        ring-primary-foreground
      `
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#000000"
        width="40" // Adjust the width
        height="40" // Adjust the height
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke="#FF4D4D"
          stroke-width="0.672"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M19.3 5.71002C18.841 5.24601 18.2943 4.87797 17.6917 4.62731C17.0891 4.37666 16.4426 4.2484 15.79 4.25002C15.1373 4.2484 14.4909 4.37666 13.8883 4.62731C13.2857 4.87797 12.739 5.24601 12.28 5.71002L12 6.00002L11.72 5.72001C10.7917 4.79182 9.53273 4.27037 8.22 4.27037C6.90726 4.27037 5.64829 4.79182 4.72 5.72001C3.80386 6.65466 3.29071 7.91125 3.29071 9.22002C3.29071 10.5288 3.80386 11.7854 4.72 12.72L11.49 19.51C11.6306 19.6505 11.8212 19.7294 12.02 19.7294C12.2187 19.7294 12.4094 19.6505 12.55 19.51L19.32 12.72C20.2365 11.7823 20.7479 10.5221 20.7442 9.21092C20.7405 7.89973 20.2218 6.64248 19.3 5.71002Z"
            fill="#FF4D4D"
          ></path>
        </g>
      </svg>
    </div>
  );
};

export default HeartCircle;
