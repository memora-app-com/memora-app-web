import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
// import { useQuery } from "@tanstack/react-query";
// import { fetchUserProfile } from "@/utils/supabase/queries";

const supabase = createClient();

const useAuthUser = () => {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: authGetUser, error } = await supabase.auth.getUser();
      if (error) {
        setAuthError(error);
      }
      if (authGetUser?.user) {
        setAuthUser(authGetUser.user);
      }
      setAuthLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setAuthUser(session.user);
        } else {
          setAuthUser(null);
        }
        setAuthLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // TODO: Review if I need to fetch the user from the db here, or should I do that separately, only when needed
  // const {
  //   data: userProfile,
  //   error,
  //   isLoading: profileLoading,
  // } = useQuery({
  //   queryKey: ["userProfile", authUser?.id],
  //   queryFn: async () => fetchUserProfile(authUser?.id),
  //   enabled: !!authUser, // Only enable the query when user is truthy
  // });

  // return {
  //   authUser,
  //   userProfile,
  //   loading: loading || profileLoading,
  //   error,
  // };

  return {
    authUser,
    authLoading: authLoading,
    authError,
  };
};

export default useAuthUser;
