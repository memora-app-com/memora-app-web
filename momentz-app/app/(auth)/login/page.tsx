"use client";

import { useState } from "react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { login, signup } from "./actions";
import { logInFormSchema } from "@/lib/form-schemas";

import { Button } from "@/components/ui/button";
import AuthCard from "@/components/AuthCard";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ErrorAlert from "@/components/ErrorAlert";
import SeparatorWithText from "@/components/SeparatorWithText";
import { LoadingIcon } from "@/components/LoadingIcon";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof logInFormSchema>>({
    resolver: zodResolver(logInFormSchema),
  });

  return (
    <AuthCard>
      <CardHeader>
        <CardTitle>Log in</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <ErrorAlert className="mb-4" message={error} />}

        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="your password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <label htmlFor="email">Email:</label>
          <input id="email" name="email" type="email" required />
          <label htmlFor="password">Password:</label>
          <input id="password" name="password" type="password" required /> */}
            <Button
              size="full"
              className="mt-4"
              type="submit"
              variant={isLoading ? "outline" : "default"}
              disabled={isLoading}
              formAction={login}
            >
              Log in
            </Button>

            <SeparatorWithText text="OR" />

            <Button
              size="full"
              type="submit"
              className="mt-4"
              variant={isLoading ? "outline" : "secondary"}
              disabled={isLoading}
              formAction={signup}
            >
              Sign up
            </Button>

            {/* <CardFooter>
              <p>
                Don&apos;t have an account?{" "}
                <Link
                  href={origin ? `/signup?origin=${origin}` : "/signup"}
                  className="text-primary underline"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter> */}
          </form>
        </Form>
      </CardContent>
    </AuthCard>
  );
}