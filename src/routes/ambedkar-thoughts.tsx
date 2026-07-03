import { createFileRoute, Link } from "@tanstack/react-router";
import { Quote } from "lucide-react";

const quotes: { text: string; context: string }[] = [
  { text: "Educate, Agitate, Organize.", context: "The three-word charter of Babasaheb’s life and of this portal." },
  { text: "I measure the progress of a community by the degree of progress which women have achieved.", context: "On the dignity and rising of women." },
  { text: "Cultivation of mind should be the ultimate aim of human existence.", context: "On education as liberation." },
  { text: "So long as you do not achieve social liberty, whatever freedom is provided by the law is of no avail to you.", context: "On social democracy." },
  { text: "Life should be great rather than long.", context: "On living with purpose." },
  { text: "A great man is different from an eminent one in that he is ready to be the servant of the society.", context: "On leadership." },
  { text: "Constitution is not a mere lawyer's document, it is a vehicle of Life, and its spirit is always the spirit of Age.", context: "On the living Constitution." },
  { text: "Justice has always evoked ideas of equality, of proportion, of compensation.", context: "On justice." },
];

export const Route = createFileRoute("/ambedkar-thoughts")({
  head: () => ({
    meta: [
      { title: "Ambedkar Thoughts — Jai Bhim Knowledge Portal" },
      { name: "description", content: "Selected thoughts and quotations of Dr. B. R. Ambedkar Ji, presented with context for young readers." },
    ],
  }),
  component: Thoughts,
});

function Thoughts() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-gold)]">In his own words</div>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Ambedkar Thoughts</h1>
      <p className="mt-3 max-w-3xl text-foreground/80">
        Babasaheb wrote and spoke prolifically. A small selection of his thoughts is gathered here as an entry-point.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {quotes.map((q, i) => (
          <figure key={i} className="rounded-xl bg-card p-6 shadow-[var(--shadow-card)]">
            <Quote className="h-6 w-6 text-[color:var(--color-gold)]" />
            <blockquote className="mt-3 text-lg font-semibold leading-snug text-foreground">
              “{q.text}”
            </blockquote>
            <figcaption className="mt-3 text-sm text-muted-foreground">
              — Dr. B. R. Ambedkar Ji · <span className="italic">{q.context}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-12 rounded-xl bg-[color:var(--color-navy)] p-8 text-center text-cream shadow-[var(--shadow-elevated)]">
        <p className="text-lg">Ready to read further?</p>
        <Link to="/books" className="mt-4 btn-cta inline-flex rounded-md px-5 py-2.5 font-bold">
          Open the library
        </Link>
      </div>
    </div>
  );
}