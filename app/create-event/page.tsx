"use client";

import { use, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import { createEvent } from "@/utils/supabase/mutations";
import useUser from "@/hooks/useUser";
import z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createEventFormSchema } from "@/lib/form-schemas";
import { LoadingIcon } from "@/components/LoadingIcon";

export default function CreateEventClient() {
  const router = useRouter();
  //TODO: Add error handling
  //TODO: Add loading state
  const [isLoading, setIsLoading] = useState(false);
  const { authUser, userProfile, loading, error } = useUser();

  const form = useForm<z.infer<typeof createEventFormSchema>>({
    resolver: zodResolver(createEventFormSchema),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      //TODO: Add better validation and error handling
      const formValues = createEventFormSchema.parse(data);

      let startDate = formValues.startDate;
      if (formValues.startsNow === true) {
        startDate = new Date().toISOString();
      }

      const createdEvent = await createEvent({
        name: formValues.name,
        description: formValues.description,
        code: formValues.code,
        startDate: startDate,
        endDate: formValues.endDate,
        userId: authUser.id,
      });

      router.push(`/event/${createdEvent.code}`);
    } catch (error) {
      console.error(error.errors);
    }

    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
      {loading ? (
        <LoadingIcon />
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Example: Our wedding"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter the event description (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Event code
                    <p className="text-xs text-muted-foreground font-normal">
                      This code will be used by guests to join the event
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
                        placeholder="Randomly generated if left empty"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start date</FormLabel>

                  <FormField
                    control={form.control}
                    name="startsNow"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
                        <FormControl>
                          <Checkbox
                            value={"true"}
                            defaultChecked={true}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>{" "}
                        <FormLabel className="font-normal">
                          Event starts now
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      disabled={form.watch("startsNow", true)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End date</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4 flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <LoadingIcon /> : "Create Event"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
