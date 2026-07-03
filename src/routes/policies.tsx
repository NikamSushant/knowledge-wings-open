import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/policies")({
  head: () => ({
    meta: [
      { title: "Policies — Jai Bhim Knowledge Portal" },
      { name: "description", content: "Copyright, usage, and privacy policy for Jai Bhim Knowledge Portal." },
    ],
  }),
  component: Policies,
});

function Policies() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 space-y-8">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-gold)]">Policies</div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Copyright, usage &amp; privacy</h1>
      </div>
      <section>
        <h2 className="text-xl font-bold text-primary">Copyright</h2>
        <p className="mt-2 text-foreground/85 leading-relaxed">
          © 2026 Sushant Nikam. All books on this portal are the original work of the author.
          Reproduction, resale, modification, or republication in any form — print or digital —
          without written permission from the author is not allowed.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-primary">Usage policy</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-foreground/85">
          <li>Books are offered for free online reading only.</li>
          <li>You may share links to any page on this portal freely.</li>
          <li>You may quote short passages for study, discussion or review, with attribution.</li>
          <li>PDF downloads, when available, are for personal reading only.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold text-primary">Privacy policy</h2>
        <p className="mt-2 text-foreground/85 leading-relaxed">
          This portal does not require sign-up and does not track individual readers. Reading preferences
          (theme, font size, current chapter) are stored on your own device only. If you write to us through
          the contact form, your message is used solely to reply to you.
        </p>
      </section>
    </div>
  );
}