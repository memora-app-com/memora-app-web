"use client";

import { LoadingIcon } from "@/components/LoadingIcon";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuthUser from "@/hooks/useUser";
import { JoinGalleryFormSchema } from "@/lib/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginAnonymously } from "./actions";
import { ErrorAlert } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { fetchGallery } from "@/utils/supabase/queries";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";

const JoinGallery = ({ searchParams }: { searchParams: { code: string } }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authUser, authLoading, authError } = useAuthUser();

  const form = useForm<z.infer<typeof JoinGalleryFormSchema>>({
    resolver: zodResolver(JoinGalleryFormSchema),
  });

  useEffect(() => {
    if (!authLoading && searchParams.code) {
      form.setValue("code", searchParams.code);
      document.getElementById("join-button").click();
    }
  }, [authLoading]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!authLoading && !authUser) {
        await loginAnonymously();
      }

      console.log("form", form);
      await form.handleSubmit(async (data) => {
        console.log("data.code", data.code);
        const gallery = await fetchGallery(data.code);
        if (gallery === null || gallery === undefined) {
          setError("Gallery not found");
        } else {
          router.push(`/gallery/${data.code}`);
        }
      })();
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 4000);
    }
    setIsLoading(false);
  };

  return (
    <>
      {authUser && <Navbar />}
      {isLoading && <LoadingIcon center />}
      <div className="container mx-auto p-4 max-w-lg">
        {authLoading ? (
          <>
            <Skeleton className="h-10 mt-2 w-44" />
            <Skeleton className="h-4 mt-8 w-24" />
            <Skeleton className="h-2 mt-1 w-44" />
            <Skeleton className="h-10 mt-2 " />
            <div className="flex justify-end ">
              <Skeleton className="mt-4 h-10 w-20" />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6">Join Gallery</h1>
            {error && <ErrorAlert className="mb-4" message={error} />}
            <Form {...form}>
              <form onSubmit={handleSubmit}>
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Gallery code
                        <p className="text-xs text-muted-foreground font-normal">
                          Ask the host for the gallery code
                        </p>
                      </FormLabel>
                      <div className="relative table w-full">
                        <span className="px-3 py-1.5 text-sm font-normal leading-none bg-secondary text-secondary-foreground text-center  border w-1 whitespace-nowrap align-middle table-cell rounded-l-md border-r-0">
                          #
                        </span>
                        <FormControl>
                          <Input
                            className="rounded-r-md border-l-0"
                            type="text"
                            placeholder="enter-code"
                            defaultValue={searchParams.code}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-4 flex justify-end">
                  <Button id="join-button" type="submit" disabled={isLoading}>
                    {isLoading ? "Joining..." : "Join Gallery"}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>
    </>
  );
};

export default JoinGallery;
