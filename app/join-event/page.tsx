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
import { JoinEventFormSchema } from "@/lib/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginAnonymously } from "./actions";
import { ErrorAlert } from "@/components/ui/alert";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchEvent } from "@/utils/supabase/queries";

const JoinEvent = ({
  searchParams,
}: {
  searchParams: { error: string; code: string };
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { authUser, authLoading, authError } = useAuthUser();

  const form = useForm<z.infer<typeof JoinEventFormSchema>>({
    resolver: zodResolver(JoinEventFormSchema),
  });

  useEffect(() => {
    if (!authLoading && searchParams.code) {
      form.setValue("code", searchParams.code);
      document.getElementById("join-button").click();
    }
  }, [authLoading]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setIsLoading(true);

    if (!authLoading && !authUser) {
      loginAnonymously();
    }

    const formData = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const formValues = JoinEventFormSchema.parse(formData);
      const event = await fetchEvent(formValues.code);
      console.log(event);

      if (event === null || event === undefined) {
        console.log("SHOULD GO HERE");
        router.push(`/join-event?error=Event not found`);
      } else {
        router.push(`/event/${formValues.code}`);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Join Event</h1>
      {searchParams?.error && (
        <ErrorAlert className="mb-4" message={searchParams?.error} />
      )}
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Event code
                  <p className="text-xs text-muted-foreground font-normal">
                    Ask the host for the event code
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
              {isLoading ? <LoadingIcon /> : "Join Event"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default JoinEvent;
