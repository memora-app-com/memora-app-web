import React from "react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";

const ErrorAlert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { message: string }
>(({ className, message, ...props }, ref) => (
  <Alert variant="destructive" ref={ref} className={className} {...props}>
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
));
ErrorAlert.displayName = "ErrorAlert";

export default ErrorAlert;
