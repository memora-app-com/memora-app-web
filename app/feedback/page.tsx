"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingIcon } from "@/components/LoadingIcon";

const FeedbackPage = () => {
  const { push } = useRouter();

  useEffect(() => {
    push(
      "https://docs.google.com/forms/d/e/1FAIpQLScrNvo78-QEA1X3l-6Q5J6DA8ddNa96mx22FQDStjg5Ywfnxg/viewform?usp=sf_link"
    );
  }, [push]);

  return <LoadingIcon center />;
};

export default FeedbackPage;
