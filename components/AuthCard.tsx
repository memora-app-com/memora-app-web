import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const AuthCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className="flex items-center justify-center min-h-screen ">
    <Card
      ref={ref}
      className={cn("max-w-sm w-full mx-auto", className)}
      {...props}
    />
  </div>
));
AuthCard.displayName = "AuthCard";

export default AuthCard;
// not used