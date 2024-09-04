import Navbar from "@/components/Navbar";
import React from "react";

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const errorMessage =
    searchParams?.message ||
    "We're sorry, something went wrong. Please try again later. If the problem persists, please contact us.";

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-semibold leading-none tracking-tight mb-4">
            Internal error
          </h1>
          <p className="max-w-80">{errorMessage}</p>
        </div>
      </div>
    </>
  );
}
