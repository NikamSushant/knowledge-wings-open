import { createFileRoute } from "@tanstack/react-router";
import { BookCard } from "@/components/book-card";
import { books } from "@/lib/books-data";

export const Route = createFileRoute("/childrens-books")({
  head: () => ({
    meta: [
      { title: "Children’s Books — Jai Bhim Knowledge Portal" },
      { name: "description", content: "Books for young readers — the story of Babasaheb in simple English, Hindi and Marathi." },
    ],
  }),
  component: ChildrensBooks,
});

function ChildrensBooks() {
  const list = books.filter((b) => b.isChildren);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-gold)]">For Young Readers</div>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Children’s Books</h1>
      <p className="mt-3 max-w-2xl text-foreground/80">
        Simple stories, big ideas. Written for children aged 7 to 12 — with warm words, clear ideas, and the true story of Babasaheb’s courage.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((b) => <BookCard key={b.slug} book={b} />)}
      </div>
    </div>
  );
}