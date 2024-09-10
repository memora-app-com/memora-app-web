"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchPlans, fetchUser } from "@/utils/supabase/queries";
import { LoadingIcon } from "@/components/LoadingIcon";
import { Button } from "@/components/ui/button";
import useAuthUser from "@/hooks/useUser";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut } from "@/utils/supabase/auth-helpers";
import Navbar from "@/components/Navbar";
import H1 from "@/components/H1";

function PlansPage({ searchParams }: { searchParams: { canceled: true } }) {
  const [isLoading, setIsLoading] = useState(true);
  const { authUser, authLoading, authError } = useAuthUser();
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const retrievedPlans = await fetchPlans();
      setPlans(retrievedPlans);

      const retrievedUser = await fetchUser(authUser.id);
      setUser(retrievedUser);

      setIsLoading(false);
    }

    if (!authLoading) {
      fetchData();
    }
  }, [authLoading]);

  const handleClick = async (plan) => {
    const res = await fetch("/api/checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_stripe_reference: plan.stripe_reference,
        plan_id: plan.id,
        user_stripe_reference: user.stripe_reference,
        email: user.email,
        user_id: user.id,
        billing_type: plan.billing_type,
      }),
    });

    const body = await res.json();
    window.location.href = body.url;
  };

  return (
    <>
      {authUser && !authUser.is_anonymous && <Navbar />}

      {isLoading ? (
        <div className="flex-col justify-center">
          <div className="flex justify-center mt-4">
            <LoadingIcon />
          </div>
          <Skeleton className="mt-4 w-80 h-60" />
          <Skeleton className="mt-4 w-80 h-60" />
        </div>
      ) : (
        <div className="container">
          <H1 className="mt-10">What&apos;s best for you?</H1>
          <div className="flex-1 justify-center mt-10 flex flex-col items-center lg:flex-row">
            {plans.map((plan: any) => (
              <Card key={plan.id} className="m-4 max-w-80">
                <CardHeader>
                  <CardTitle>
                    <h1 className="text-2xl font-bold">{plan.name}</h1>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="min-h-28">{plan.description}</p>
                  <p className="font-bold mt-4 text-center text-xl">
                    {plan.price}${" "}
                    {plan.billing_type === "monthly" ? (
                      <>/ month</>
                    ) : (
                      plan.billing_type === "one_time" && <> one time</>
                    )}
                  </p>
                </CardContent>
                <CardFooter className="flex-col justify-center">
                  <Button
                    onClick={() => handleClick(plan)}
                    disabled={user.plan_id === plan.id}
                  >
                    {user.plan_id === plan.id ? "Chosen" : "Choose Plan"}
                  </Button>
                  {user.plan_id === plan.id && (
                    <Link
                      href={`/cancel-payment`}
                      className="text-accent-foreground text-sm mt-2"
                    >
                      {plan.billing_type === "monthly"
                        ? "Cancel plan"
                        : plan.billing_type === "one_time" &&
                          "Refund and cancel plan"}
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          {user.plan_id === 1 && (
            <div className="text-center font-light text-sm text-accent-foreground underline mt-10">
              <Link href="/create-gallery">or continue with free trial</Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default PlansPage;
