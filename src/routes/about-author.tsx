import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about-author")({
  head: () => ({
    meta: [
      { title: "About the Author — Sushant Nikam" },
      { name: "description", content: "About Sushant Nikam, author of every book on Jai Bhim Knowledge Portal." },
    ],
  }),
  component: AboutAuthor,
});

function AboutAuthor() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-gold)]">About the Author</div>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Sushant Nikam</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr] md:items-start">
        <div
          className="mx-auto aspect-square w-52 rounded-full shadow-[var(--shadow-elevated)]"
          style={{ background: "linear-gradient(140deg,#0B3D91 0%,#061B3A 60%,#D4AF37 100%)" }}
          aria-hidden
        />
        <div className="space-y-4 text-foreground/85 leading-relaxed">
          <p>
            Sushant Nikam is an independent author writing on the life, thought and legacy of Dr. B. R. Ambedkar Ji.
            His books are written in simple English, Hindi and Marathi, and are aimed at students, first-generation readers,
            and anyone who has ever felt shut out of ideas by the price of a book.
          </p>
          <p>
            He began Jai Bhim Knowledge Portal to give his own writing back to readers, freely and directly — no publisher,
            no paywall, no gatekeeping. Every book on this portal is his original work, released for free online reading.
          </p>
          <p>
            His mission is quiet but firm: to place Babasaheb’s ideas in the hands of one more young reader today than there was yesterday.
          </p>
          <blockquote className="border-l-4 border-[color:var(--color-gold)] pl-4 italic text-foreground/80">
            “If knowledge is a lamp, our job is to keep the wick trimmed and the door open.” — Sushant Nikam
          </blockquote>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/books" className="btn-cta rounded-md px-4 py-2 font-bold">Read his books</Link>
            <Link to="/contact" className="rounded-md border-2 border-primary px-4 py-2 font-bold text-primary hover:bg-primary hover:text-primary-foreground">Contact the author</Link>
          </div>
        </div>
      </div>
    </div>
  );
}