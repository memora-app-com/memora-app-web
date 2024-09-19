"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createGalleryForUser } from "@/utils/supabase/mutations";
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
import { CreateGalleryFormSchema } from "@/lib/form-schemas";
import { LoadingIcon } from "@/components/LoadingIcon";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { ErrorAlert } from "@/components/ui/alert";
import { fetchRandomGalleryCode, fetchUser } from "@/utils/supabase/queries";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import SmileyFace from "@/components/SmileyFace";

export default function CreateGallery() {
  const router = useRouter(); //TODO: Research: router.push vs window.location.href?

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authUser, authLoading, authError } = useAuthUser();
  const [user, setUser] = useState(null);

  const form = useForm<z.infer<typeof CreateGalleryFormSchema>>({
    resolver: zodResolver(CreateGalleryFormSchema),
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
          const formValues = CreateGalleryFormSchema.parse(formData);

          let galleryCode = formValues.code;
          if (
            galleryCode === undefined ||
            galleryCode === null ||
            galleryCode === ""
          ) {
            galleryCode = await fetchRandomGalleryCode();
          }

          const createdGallery = await createGalleryForUser({
            title: formValues.title,
            description: formValues.description,
            code: galleryCode,
            startDate: formValues.startDate,
            endDate: formValues.endDate,
            userId: authUser.id,
          });

          router.push(`/gallery/${createdGallery.code}`);
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
    <div className="relative overflow-hidden h-full">
      {authUser && !authUser.is_anonymous && <Navbar />}

      {isLoading && <LoadingIcon center />}
      <div className="p-4 w-full md:grid  md:grid-cols-2 flex justify-center">
        <div className=" md:pl-16 max-w-md lg:max-w-xl">
          <h1 className="text-3xl font-bold mb-6">Create New Gallery</h1>
          <Card className="">
            <CardContent className="py-8">
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
                          <FormLabel>Gallery title</FormLabel>
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
                            Gallery code
                            <p className="text-xs text-muted-foreground font-normal">
                              This code will be used by guests to join the
                              gallery
                            </p>
                          </FormLabel>
                          <div className="relative table w-full">
                            <span className="relative left-1 px-3 py-1.5 text-sm font-normal leading-none bg-primary text-secondary-foreground text-center  border w-1 whitespace-nowrap align-middle table-cell rounded-l-md border-r-0">
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
                              placeholder="Enter the gallery description (optional)"
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
                              placeholder="Pick start date of gallery"
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
                            <FormLabel>Expiration date</FormLabel>
                            <FormControl>
                              <DateTimePicker
                                hourCycle={24}
                                granularity="minute"
                                displayFormat={{ hour24: "yyyy/MM/dd hh:mm" }}
                                value={field.value || addDays(new Date(), 30)}
                                onChange={field.onChange}
                                disabled={form.watch("startsNow", true)}
                                placeholder="Pick expiration date of gallery"
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
                              Gallery starts now and expires in 30 days
                              <p className="text-xs text-muted-foreground font-normal mt-2">
                                The gallery will be view-only after the
                                expiration date. Uncheck this to set a custom
                                start and expiration date.
                              </p>
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Gallery"}
                      </Button>
                    </div>
                  </form>
                  <FormDescription className="text-center mt-4">
                    {!user ? (
                      <Skeleton className="h-4 " />
                    ) : user && user.plan_id === 1 ? (
                      <>
                        This gallery will be limited to 5 photos, since you are
                        on the free trial.{" "}
                        <Link href="/plans" className="text-primary">
                          Upgrade here.
                        </Link>
                      </>
                    ) : user && user.plan_id === 2 ? (
                      <>
                        This is the only gallery you can create, since you are
                        on the one-time plan.
                      </>
                    ) : (
                      user &&
                      user.plan_id === 3 && (
                        <>
                          You can create as many galleries as you want, since
                          you are on the unlimited plan.
                        </>
                      )
                    )}
                  </FormDescription>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="hidden md:flex justify-center mt-16">
          <SmileyFace />
        </div>
      </div>
    </div>
  );
}
