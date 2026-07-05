import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/reports", label: "Reports" },
  { to: "/school", label: "School" },
  { to: "/memes", label: "Memes" },
  { to: "/design", label: "Design" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-foreground bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="rounded-sm bg-primary px-2 py-1 font-display text-xl leading-none text-primary-foreground">
            MGB
          </span>
          <span className="font-display text-xl leading-none">REPORT</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-accent"
              activeProps={{ className: "bg-foreground text-background" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAdmin && (
            <Link to="/admin">
              <Button size="sm" variant="default">Admin</Button>
            </Link>
          )}
          {user ? (
            <Button size="sm" variant="outline" onClick={signOut}>Sign out</Button>
          ) : (
            <Link to="/auth">
              <Button size="sm" variant="secondary">Sign in</Button>
            </Link>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t-2 border-foreground bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 font-semibold hover:bg-accent"
                activeProps={{ className: "bg-foreground text-background" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-foreground/20 pt-3">
              {isAdmin && (
                <Link to="/admin" onClick={() => setOpen(false)} className="flex-1">
                  <Button className="w-full" size="sm">Admin</Button>
                </Link>
              )}
              {user ? (
                <Button className="flex-1" size="sm" variant="outline" onClick={signOut}>Sign out</Button>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)} className="flex-1">
                  <Button className="w-full" size="sm" variant="secondary">Sign in</Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}