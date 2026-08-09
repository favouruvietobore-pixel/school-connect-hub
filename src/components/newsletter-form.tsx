import { useState } from "react";
import { Check, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const subscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    const { error } = await supabase.from("subscribers").insert({ email: email.trim().toLowerCase() });
    if (!error || error.code === "23505") {
      setEmail("");
      setStatus("done");
      return;
    }
    setStatus("error");
  };

  return (
    <form onSubmit={subscribe} className="mt-4 space-y-2">
      <label htmlFor="newsletter-email" className="text-sm font-semibold">Get new reports by email</label>
      <div className="flex gap-2">
        <Input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="min-w-0 bg-background text-foreground"
        />
        <Button type="submit" size="icon" disabled={status === "loading"} aria-label="Subscribe" title="Subscribe">
          {status === "done" ? <Check /> : <Mail />}
        </Button>
      </div>
      {status === "done" && <p className="text-xs text-accent">You're subscribed to MGB updates.</p>}
      {status === "error" && <p className="text-xs text-primary">Could not subscribe. Please try again.</p>}
    </form>
  );
}