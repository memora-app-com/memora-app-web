"use client";

import { LoadingIcon } from "@/components/LoadingIcon";
import useAuthUser from "@/hooks/useUser";
import { fulfillCheckout } from "@/utils/stripe/server";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

const AfterCheckout = ({ params }: { params: { sessionId: string } }) => {
  const { authUser, authLoading, authError } = useAuthUser();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [error, setError] = React.useState(null);
  const router = useRouter();

  useEffect(() => {
    async function handleCheckoutSession() {
      setIsDialogOpen(true);
      try {
        await fulfillCheckout(params.sessionId);
        router.push("/create-gallery");
      } catch (error) {
        setError(error);
      }
    }

    if (params?.sessionId) {
      handleCheckoutSession();
    } else {
      router.push("/account");
    }
  }, [authLoading]);

  function handleDialogChange(open: boolean): void {
    setIsDialogOpen(open);
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      {error ? (
        <AlertDialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogContent>
            <AlertDialogHeader className="text-destructive-foreground">
              Payment Error
            </AlertDialogHeader>
            <AlertDialogDescription className="text-destructive-foreground">
              An error occurred while processing your payment. Please try again,
              or contact support.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Link href="/plans"> Go back</Link>
              </AlertDialogCancel>
              <AlertDialogCancel>
                <Link href="/support">View support page</Link>
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <>
          Your payment is being completed. Please wait... <LoadingIcon />
        </>
      )}
    </div>
  );
};

export default AfterCheckout;
