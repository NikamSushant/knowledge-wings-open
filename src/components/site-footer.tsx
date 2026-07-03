import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Youtube, Mail } from "lucide-react";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-[color:var(--color-navy)] text-cream/85">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="rounded-lg bg-cream/95 p-3 inline-block">
            <Logo />
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/70">
            A free online reading platform featuring original books written by
            Sushant Nikam — inspired by the life, thoughts, struggle, and mission
            of Dr. B. R. Ambedkar Ji.
          </p>
          <p className="mt-4 text-sm font-semibold text-[color:var(--color-gold)]">
            Educate • Agitate • Organize
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-cream">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/books" className="hover:text-[color:var(--color-gold)]">All Books</Link></li>
            <li><Link to="/categories" className="hover:text-[color:var(--color-gold)]">Categories</Link></li>
            <li><Link to="/childrens-books" className="hover:text-[color:var(--color-gold)]">Children’s Books</Link></li>
            <li><Link to="/ambedkar-thoughts" className="hover:text-[color:var(--color-gold)]">Ambedkar Thoughts</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-cream">Portal</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-[color:var(--color-gold)]">About Portal</Link></li>
            <li><Link to="/about-author" className="hover:text-[color:var(--color-gold)]">About Author</Link></li>
            <li><Link to="/contact" className="hover:text-[color:var(--color-gold)]">Contact</Link></li>
            <li><Link to="/policies" className="hover:text-[color:var(--color-gold)]">Usage &amp; Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 text-xs text-cream/70 sm:flex-row sm:items-center sm:px-6">
          <p>
            © 2026 Sushant Nikam. All rights reserved. Books offered here are for
            free online reading only. No reproduction or resale without written permission.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="hover:text-[color:var(--color-gold)]"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-[color:var(--color-gold)]"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="YouTube" className="hover:text-[color:var(--color-gold)]"><Youtube className="h-4 w-4" /></a>
            <a href="mailto:hello@jaibhimportal.org" aria-label="Email" className="hover:text-[color:var(--color-gold)]"><Mail className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}