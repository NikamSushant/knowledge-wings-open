import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Portal — Jai Bhim Knowledge Portal" },
      { name: "description", content: "Why Jai Bhim Knowledge Portal exists — a free, respectful online library of books inspired by Babasaheb Ambedkar." },
    ],
  }),
  component: AboutPortal,
});

function AboutPortal() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-gold)]">About the Portal</div>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        A free library, built in the spirit of Babasaheb.
      </h1>
      <div className="mt-8 space-y-5 text-foreground/85 leading-relaxed">
        <p>
          Jai Bhim Knowledge Portal is a free online reading platform. It exists for one reason: to make original books
          inspired by the life, thoughts and mission of Dr. B. R. Ambedkar Ji available to anyone with a phone or a laptop,
          in language that any reader can understand.
        </p>
        <p>
          Every book here is written by <strong>Sushant Nikam</strong>. Every chapter is offered for free online reading.
          There is no subscription, no login wall, and no advertising in the reader.
        </p>
        <p>
          The portal is not a commercial project. It is a small contribution to the movement Babasaheb started — the movement
          of education, equality, dignity, self-respect, and social transformation.
        </p>
        <h2 className="pt-4 text-xl font-bold text-primary">What you can do here</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Read complete books online, chapter by chapter.</li>
          <li>Change font size, switch to a dark theme, and bookmark your place.</li>
          <li>Search inside a book to find a passage you remember.</li>
          <li>Share books with friends, students and study circles.</li>
        </ul>
        <h2 className="pt-4 text-xl font-bold text-primary">Copyright &amp; usage</h2>
        <p>
          The books are the author’s original work and copyright. They are offered for free online reading only.
          Reproduction, resale, modification, or republication without written permission from the author is not allowed.
        </p>
        <div className="pt-4">
          <Link to="/books" className="btn-cta inline-flex rounded-md px-5 py-2.5 font-bold">
            Open the library
          </Link>
        </div>
      </div>
    </div>
  );
}