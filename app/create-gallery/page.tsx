"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createEventForUser } from "@/utils/supabase/mutations";
import useAuthUser from "@/hooks/useUser";
import z from "zod";
import { addDays } from "date-fns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { CreateEventFormSchema } from "@/lib/form-schemas";
import { LoadingIcon } from "@/components/LoadingIcon";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { ErrorAlert } from "@/components/ui/alert";
import { fetchRandomEventCode, fetchUser } from "@/utils/supabase/queries";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateGallery() {
  const router = useRouter(); //TODO: Research: router.push vs window.location.href?

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authUser, authLoading, authError } = useAuthUser();
  const [user, setUser] = useState(null);

  const form = useForm<z.infer<typeof CreateEventFormSchema>>({
    resolver: zodResolver(CreateEventFormSchema),
  });

  useEffect(() => {
    if (authUser) {
      fetchUser(authUser.id).then((data) => {
        if (data) {
          setUser(data);
        } else {
          router.push("/login");
        }
      });
    }
  }, [authLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await form
        .handleSubmit(async (formData) => {
          const formValues = CreateEventFormSchema.parse(formData);

          let eventCode = formValues.code;
          if (
            eventCode === undefined ||
            eventCode === null ||
            eventCode === ""
          ) {
            eventCode = await fetchRandomEventCode();
          }

          const createdEvent = await createEventForUser({
            title: formValues.title,
            description: formValues.description,
            code: eventCode,
            startDate: formValues.startDate,
            endDate: formValues.endDate,
            userId: authUser.id,
          });

          router.push(`/event/${createdEvent.code}`);
        })()
        .then(() => {
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 8000);
    }
  };

  return (
    <>
      {isLoading && <LoadingIcon center />}
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
        {authLoading ? (
          <>
            <div className="flex justify-center">
              <LoadingIcon />
            </div>
            <Skeleton className="h-4 mt-4 w-24" />
            <Skeleton className="h-4 mt-1 w-60" />
            <Skeleton className="h-8 mt-4" />
            <Skeleton className="h-4 mt-4 w-24" />
            <Skeleton className="h-4 mt-1 w-60" />
            <Skeleton className="h-8 mt-4" />
            <Skeleton className="h-4 mt-4 w-24" />
            <Skeleton className="h-4 mt-1 w-60" />
            <Skeleton className="h-8 mt-4" />
          </>
        ) : (
          <Form {...form}>
            {error && <ErrorAlert className="mb-4" message={error} />}
            <form onSubmit={handleSubmit}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event title</FormLabel>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description
                      <p className="text-xs text-muted-foreground font-normal">
                        optional
                      </p>
                    </FormLabel>
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

              <div className="sm:grid sm:grid-cols-2 sm:gap-x-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start date</FormLabel>
                      <DateTimePicker
                        hourCycle={24}
                        granularity="minute"
                        displayFormat={{ hour24: "yyyy/MM/dd hh:mm" }}
                        value={field.value || new Date()}
                        onChange={field.onChange}
                        disabled={form.watch("startsNow", true)}
                        placeholder="Pick start of event"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End date</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          hourCycle={24}
                          granularity="minute"
                          displayFormat={{ hour24: "yyyy/MM/dd hh:mm" }}
                          value={field.value || addDays(new Date(), 30)}
                          onChange={field.onChange}
                          disabled={form.watch("startsNow", true)}
                          placeholder="Pick end of event"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startsNow"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 col-span-full mt-2">
                      <FormControl>
                        <Checkbox
                          value={"true"}
                          defaultChecked={true}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Event starts now and ends in 30 days
                        <p className="text-xs text-muted-foreground font-normal mt-2">
                          The gallery will be view-only after the end date.
                          Uncheck this to set a custom start and end date.
                        </p>
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4 flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </form>
            <FormDescription className="text-center mt-4">
              {!user ? (
                <Skeleton className="h-4 " />
              ) : user && user.plan_id === 1 ? (
                <>
                  This event will be limited to 5 photos, since you are on the
                  free trial.{" "}
                  <Link href="/plans" className="text-primary">
                    Upgrade here.
                  </Link>
                </>
              ) : user && user.plan_id === 2 ? (
                <>
                  This is the only event you can create, since you are on the
                  one-time plan.
                </>
              ) : (
                user &&
                user.plan_id === 3 && (
                  <>
                    You can create as many events as you want, since you are on
                    the unlimited plan.
                  </>
                )
              )}
            </FormDescription>
          </Form>
        )}
      </div>
    </>
  );
}
