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
import { fulfillCheckout } from "@/utils/stripe/server";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
        user_id: user.id,
        billing_type: plan.billing_type,
      }),
    });

    const body = await res.json();
    window.location.href = body.url;
  };

  return (
    <div className="flex flex-wrap justify-center">
      {isLoading ? (
        <div className="flex-col justify-center">
          <div className="flex justify-center mt-4">
            <LoadingIcon />
          </div>
          <Skeleton className="mt-4 w-80 h-60" />
          <Skeleton className="mt-4 w-80 h-60" />
        </div>
      ) : (
        <div className="mt-10">
          {plans.map((plan: any) => (
            <Card key={plan.id} className="m-4 max-w-80">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{plan.description}</p>
                <p className="font-bold mt-4 text-center text-xl">
                  {plan.price}${" "}
                  <span className="font-normal">
                    {plan.billing_type === "monthly" ? (
                      <>/ month</>
                    ) : (
                      plan.billing_type === "one_time" && <> one time</>
                    )}
                  </span>
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={() => handleClick(plan)}>
                  {user.plan_id === plan.id ? "Chosen" : "Choose Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
          <div className="text-center font-light text-sm text-accent-foreground underline">
            <Link href="/create-event">Continue free trial</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlansPage;
