import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — MGB Report" },
      { name: "description", content: "Sign in or create your MGB Report account." },
      { property: "og:title", content: "Sign in — MGB Report" },
      { property: "og:description", content: "Sign in or create your MGB Report account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Reset link sent! Check your email.");
        setMode("signin");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back! 🔥");
        navigate({ to: "/", replace: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <Toaster />
      <section className="mx-auto flex max-w-md flex-col px-4 py-12">
        <h1 className="font-display text-5xl">
          {mode === "signin" ? "Sign In" : mode === "signup" ? "Sign Up" : "Reset Password"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Welcome back to MGB Report."
            : mode === "signup"
              ? "Join the MGB fam — stay informed and laugh out loud."
              : "Enter your email and we'll send you a reset link."}
        </p>

        <form onSubmit={submit} className="mgb-shadow mt-6 space-y-4 rounded-md border-2 border-foreground bg-card p-6">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          {mode !== "forgot" && (
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
          </Button>
          {mode === "signin" && (
            <button
              type="button"
              className="w-full text-center text-sm font-semibold text-primary hover:underline"
              onClick={() => setMode("forgot")}
            >
              Forgot password?
            </button>
          )}
          {mode === "forgot" && (
            <button
              type="button"
              className="w-full text-center text-sm font-semibold text-primary hover:underline"
              onClick={() => setMode("signin")}
            >
              ← Back to sign in
            </button>
          )}
        </form>

        {mode !== "forgot" && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New to MGB?" : "Already have an account?"}{" "}
            <button
              className="font-semibold text-primary hover:underline"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        )}

        <Link to="/" className="mt-6 text-center text-sm text-muted-foreground hover:underline">
          ← Back home
        </Link>
      </section>
    </SiteLayout>
  );
}