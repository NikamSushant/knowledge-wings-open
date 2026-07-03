import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Jai Bhim Knowledge Portal" },
      { name: "description", content: "Write to the author, request a book, or share your feedback." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-gold)]">Contact</div>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Write to the author</h1>
      <p className="mt-3 max-w-2xl text-foreground/80">
        Requests, corrections, suggestions for future books, or a simple note of thanks — every message is read.
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_320px]">
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="rounded-xl bg-card p-6 shadow-[var(--shadow-card)]"
        >
          {sent ? (
            <div className="py-8 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                <Send className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-xl font-bold">Message received</h2>
              <p className="mt-2 text-sm text-muted-foreground">Thank you for writing. The author will reply personally.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Field label="Your name">
                <input required className="w-full rounded-md border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" />
              </Field>
              <Field label="Email">
                <input type="email" required className="w-full rounded-md border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" />
              </Field>
              <Field label="Message">
                <textarea required rows={6} className="w-full rounded-md border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" />
              </Field>
              <button type="submit" className="btn-cta inline-flex items-center gap-2 rounded-md px-5 py-2.5 font-bold">
                <Send className="h-4 w-4" /> Send message
              </button>
            </div>
          )}
        </form>
        <aside className="space-y-4">
          <div className="rounded-xl bg-[color:var(--color-navy)] p-6 text-cream shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 text-[color:var(--color-gold)]">
              <Mail className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-widest">Email</span>
            </div>
            <a href="mailto:hello@jaibhimportal.org" className="mt-2 block text-sm font-semibold hover:underline">
              hello@jaibhimportal.org
            </a>
          </div>
          <div className="rounded-xl bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 text-primary">
              <MessageSquare className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-widest">Study circles</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Running a reading group or Ambedkar Jayanti event? Write to us — we’ll share printable extracts and study guides.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}