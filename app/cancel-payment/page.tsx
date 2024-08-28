"use client";

import { LoadingIcon } from "@/components/LoadingIcon";
import useAuthUser from "@/hooks/useUser";
import React, { use, useEffect } from "react";

const CancelPayment = () => {
  const { authUser, authLoading, authError } = useAuthUser();

  useEffect(() => {
    async function cancelOrRefund() {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: authUser.id,
        }),
      });

      const body = await res.json();
      window.location.href = body.url;
    }

    if (!authLoading) {
      cancelOrRefund();
    }
  }, [authLoading]);

  return (
    <div className="flex items-center justify-center min-h-screen ">
      Canceling your plan... <LoadingIcon />
    </div>
  );
  //TODO: Add a form to cancel the payment
};

export default CancelPayment;
