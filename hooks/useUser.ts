import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { fetchUserProfile } from "@/utils/supabase/queries";

const supabase = createClient();

const useUser = () => {
  const [authUser, setAuthUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: authUser } = await supabase.auth.getUser();
      if (authUser?.user) {
        setAuthUser(authUser.user);
      }
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setAuthUser(session.user);
        } else {
          setAuthUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const {
    data: userProfile,
    error,
    isLoading: profileLoading,
  } = useQuery({
    queryKey: ["userProfile", authUser?.id],
    queryFn: async () => fetchUserProfile(authUser?.id),
    enabled: !!authUser, // Only enable the query when user is truthy
  });

  return {
    authUser,
    userProfile,
    loading: loading || profileLoading,
    error,
  };
};

export default useUser;
