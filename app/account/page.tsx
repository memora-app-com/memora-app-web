"use client";

import useAuthUser from "@/hooks/useUser";
import { fetchUserPlan } from "@/utils/supabase/queries";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { signOut } from "@/utils/supabase/auth-helpers";
import { LogOut } from "lucide-react";

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
    <div className="relative overflow-hidden h-full">
      <div className="absolute inset-0 small-height:hidden">
        <div className="absolute bottom-[-100px] right-[10px] w-[100vw] h-[100vw] border-2 border-black bg-primary rounded-full translate-x-1/2 translate-y-1/2 shadow-lg"></div>
      </div>
      {authUser && <Navbar />}
      {user && (
        <div className="sm:container mt-16 pl-16">
          <h1 className="text-3xl font-bold">Welcome back,</h1>
          <h1 className="text-3xl font-bold mb-6">{user.name}</h1>
          <div className="flex flex-col space-y-6 sm:grid sm:grid-cols-2">
            <div>
              <h2 className="font-bold mb-4 text-lg">Account info</h2>
              <p>
                Email: <strong>{user.email}</strong>
              </p>
              <p>
                Plan: <strong>{user.plan.name}</strong>
              </p>
              {user.plan.billing_type !== "monthly" && (
                <Button variant="secondary" className="mt-4">
                  <Link href="/plans">View Plans</Link>
                </Button>
              )}
              {user.plan.billing_type === "one_time" && (
                <p>Your plan expires after creating one gallery</p>
              )}
            </div>
            <div className="flex flex-col space-y-6">
              <Button variant="default" className="max-w-40">
                <Link href="/galleries">Your Galleries</Link>
              </Button>
              <form className="" action={signOut}>
                <Button variant="ghost-destructive">
                  <LogOut size={16} className="mr-2" />
                  Log out
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
