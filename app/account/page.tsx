"use client";

import useAuthUser from "@/hooks/useUser";
import { fetchUserPlan } from "@/utils/supabase/queries";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { signOut } from "@/utils/supabase/auth-helpers";

const Account = () => {
  const { authUser, authLoading, authError } = useAuthUser();
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (authUser) {
      fetchUserPlan(authUser.id).then((data) => {
        if (data) {
          setUser(data);
        } else {
          router.push("/login");
        }

        const isFirstTimeLogin = localStorage.getItem("isFirstTimeLogin");
        console.log(isFirstTimeLogin);
        if (
          data.plan.billing_type === "free_trial" &&
          isFirstTimeLogin === null
        ) {
          localStorage.setItem("isFirstTimeLogin", "false");
          router.push("/plans");
        }
      });
    }
  }, [authLoading]);

  return (
    <>
      {authUser && <Navbar />}
      <div className="container mt-4">
        {user && (
          <>
            <h1 className="text-3xl font-bold mb-6">Your account</h1>
            <div>
              <p>Welcome, {user.name}!</p>
              <p>Email: {user.email}</p>
              <p>
                Plan: {user.plan.name}
                {user.plan.billing_type !== "monthly" && (
                  <Link href="/plans" className="text-blue-800">
                    {" - "}
                    view plans
                  </Link>
                )}
              </p>
              {user.plan.billing_type === "one_time" && (
                <p>Your plan expires after creating one gallery</p>
              )}
              <Button variant="outline" className="mt-4">
                <Link href="/galleries">Go to your galleries</Link>
              </Button>
              <form className="mt-4" action={signOut}>
                <Button variant="ghost-destructive">Log out</Button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Account;
