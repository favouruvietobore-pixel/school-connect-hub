import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let roleRequest = 0;

    const loadRole = async (sessionUser: User) => {
      const request = ++roleRequest;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sessionUser.id)
        .eq("role", "admin")
        .limit(1)
        .maybeSingle();

      if (!mounted || request !== roleRequest) return;
      setIsAdmin(!error && data?.role === "admin");
      setLoading(false);
    };

    const applySession = (session: Session | null) => {
      if (!mounted) return;
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      setIsAdmin(false);

      if (!sessionUser) {
        roleRequest += 1;
        setLoading(false);
        return;
      }

      setLoading(true);
      void loadRole(sessionUser);
    };

    supabase.auth.getSession().then(({ data }) => applySession(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Keep the auth callback synchronous. Awaiting another backend request
      // inside it can block the auth client's session lock on some browsers.
      window.setTimeout(() => applySession(session), 0);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading };
}