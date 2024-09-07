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
import SmileyFace from "@/components/SmileyFace";
import H1 from "@/components/H1";

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

    console.log("submitting form");

    try {
      console.log("authLoading", authLoading);
      console.log("authUser", authUser);
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
    <div className="relative overflow-hidden h-full">
      {authUser && <Navbar />}
      {isLoading && <LoadingIcon center />}
      <div className=" justify-center items-center small-height:items-start h-screen grid grid-cols-4 grid-flow-row">
        <div className="hidden md:flex h-full w-full justify-center items-end pb-40">
          <SmileyFace className="hidden md:flex  rotate-45" size={60} />
        </div>
        <div className="md:col-span-2 col-span-4 container pb-40">
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
              <H1>Join Gallery</H1>
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
                          <span className="px-3 py-1.5 text-sm font-normal leading-none bg-primary text-secondary-foreground text-center  border w-1 whitespace-nowrap align-middle table-cell rounded-l-md border-r-0">
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
                      {isLoading ? "Joining..." : "Join Now"}
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}
        </div>
        <div className="hidden md:flex h-full w-full  justify-center pt-40">
          <SmileyFace className="hidden md:flex  " size={120} />
        </div>
      </div>
    </div>
  );
};

export default JoinGallery;
