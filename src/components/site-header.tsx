import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, User } from "lucide-react";
import { Logo } from "./logo";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/", label: "Home" },
  { to: "/books", label: "My Books" },
  { to: "/categories", label: "Categories" },
  { to: "/childrens-books", label: "Children’s Books" },
  { to: "/ambedkar-thoughts", label: "Ambedkar Thoughts" },
  { to: "/about-author", label: "About Author" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-cream/85 backdrop-blur supports-[backdrop-filter]:bg-cream/70">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 xl:grid-cols-[auto_1fr_auto] xl:gap-6">
        <Link to="/" className="min-w-0 shrink-0" aria-label="Jai Bhim Knowledge Portal home">
          <Logo />
        </Link>
        <nav className="hidden xl:flex xl:justify-center">
          <ul className="flex items-center gap-0.5">
            {nav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  activeProps={{ className: "text-primary bg-secondary/80 ring-1 ring-primary/20" }}
                  inactiveProps={{ className: "text-foreground/75 hover:text-primary hover:bg-secondary/60" }}
                  activeOptions={{ exact: n.to === "/" }}
                  className="whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-semibold transition-colors"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2 justify-self-end">
          <Link
            to={signedIn ? "/admin" : "/auth"}
            className="hidden xl:inline-flex items-center gap-1 rounded-md border border-input px-3 py-2 text-xs font-semibold text-foreground/80 hover:text-primary hover:border-primary"
            aria-label={signedIn ? "Admin dashboard" : "Sign in"}
          >
            <User className="h-3.5 w-3.5" /> {signedIn ? "Admin" : "Sign in"}
          </Link>
          <Link
            to="/books"
            className="hidden sm:inline-flex btn-cta items-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-bold"
          >
            Start Reading Free
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-md text-foreground xl:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-cream xl:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {nav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "text-primary" }}
                  inactiveProps={{ className: "text-foreground/80" }}
                  activeOptions={{ exact: n.to === "/" }}
                  className="block rounded-md px-2 py-3 text-base font-semibold"
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="py-2">
              <Link
                to="/books"
                onClick={() => setOpen(false)}
                className="btn-cta inline-flex w-full items-center justify-center rounded-md px-4 py-3 text-sm font-bold"
              >
                Start Reading Free
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}