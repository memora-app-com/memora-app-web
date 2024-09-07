import { cn } from "@/lib/utils";
import React from "react";

const H1 = (props: { children: React.ReactNode; className?: string }) => {
  return (
    <h1 className={cn("text-3xl font-bold mb-6 text-budge", props.className)}>
      {props.children}
    </h1>
  );
};

export default H1;
