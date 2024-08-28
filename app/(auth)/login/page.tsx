"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { login, signup } from "./actions";
import { LogInFormSchema, SignUpFormSchema } from "@/lib/form-schemas";

import { Button } from "@/components/ui/button";
import AuthCard from "@/components/AuthCard";
import {
  Card,
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
import { ErrorAlert, InformativeAlert } from "@/components/ui/alert";
import SeparatorWithText from "@/components/SeparatorWithText";
import { LoadingIcon } from "@/components/LoadingIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string; tab: string };
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginForm = useForm<z.infer<typeof LogInFormSchema>>({
    resolver: zodResolver(LogInFormSchema),
  });

  const signupForm = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
  });

  async function handleLogin(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    loginForm.handleSubmit(async (data) => {
      setIsLoading(true);
      const props = {
        email: data.email,
        password: data.password,
      };

      const res = await login(props);
      if (res.status === 200) {
        window.location.href = "/plans";
      } else if (res.status === 400) {
        setError(res.error);
        setTimeout(() => {
          setError(null);
        }, 3000);
      }

      setIsLoading(false);
    })();
  }

  async function handleSignup(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    signupForm.handleSubmit(async (data) => {
      setIsLoading(true);
      const props = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      const res = await signup(props);
      if (res.status === 200) {
        console.log(res);
        window.location.href =
          "/login?message=Account created successfully. Check your email to verify your account.";
      } else if (res.status === 400) {
        setError(res.error);
        setTimeout(() => {
          setError(null);
        }, 3000);
      }

      setIsLoading(false);
    })();
  }

  return (
    <>
      {isLoading && <LoadingIcon center />}
      <div className="flex items-center justify-center min-h-screen ">
        <Tabs
          defaultValue={searchParams?.tab === "register" ? "register" : "login"}
          className="max-w-sm w-full mx-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Log in</TabsTrigger>
            <TabsTrigger value="register">Create account</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className={cn("max-w-sm w-full mx-auto")}>
              <CardHeader>
                <CardTitle>Log in</CardTitle>
              </CardHeader>
              <CardContent>
                {error && <ErrorAlert className="mb-4" message={error} />}
                {searchParams?.message && (
                  <InformativeAlert
                    className="mb-4"
                    message={searchParams?.message}
                  />
                )}

                <Form {...loginForm}>
                  <form onSubmit={handleLogin}>
                    <FormField
                      control={loginForm.control}
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
                      control={loginForm.control}
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

                    <Button
                      size="full"
                      className="mt-4"
                      type="submit"
                      variant={isLoading ? "outline" : "default"}
                      disabled={isLoading}
                    >
                      Log in
                    </Button>
                    {/* 
                  <SeparatorWithText text="OR" />
                  <Button
                    size="full"
                    variant={isLoading ? "ghost" : "outline"}
                    disabled={isLoading}
                    className="mt-4"
                  >
                    <Image
                      width={30}
                      height={30}
                      src="/assets/google-logo.svg"
                      alt="Google Logo"
                    />
                    Log in with Google
                  </Button> */}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card className={cn("max-w-sm w-full mx-auto")}>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
              </CardHeader>
              <CardContent>
                {error && <ErrorAlert className="mb-4" message={error} />}
                {searchParams?.message && (
                  <InformativeAlert
                    className="mb-4"
                    message={searchParams?.message}
                  />
                )}

                <Form {...signupForm}>
                  <form onSubmit={handleSignup}>
                    <FormField
                      control={signupForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input
                              type="name"
                              placeholder="John Doe"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
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
                      control={signupForm.control}
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

                    <Button
                      size="full"
                      className="mt-4"
                      type="submit"
                      variant={isLoading ? "outline" : "default"}
                      disabled={isLoading}
                    >
                      Sign up
                    </Button>
                    {/* 
                  <SeparatorWithText text="OR" />
                  <Button
                    size="full"
                    variant={isLoading ? "ghost" : "outline"}
                    disabled={isLoading}
                    className="mt-4"
                  >
                    <Image
                      width={30}
                      height={30}
                      src="/assets/google-logo.svg"
                      alt="Google Logo"
                    />
                    Sign up with Google
                  </Button> */}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
