import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BookCard } from "@/components/book-card";
import { categories, languages } from "@/lib/books-data";
import { usePublishedBooks } from "@/hooks/usePublishedBooks";

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: [
      { title: "My Books — Jai Bhim Knowledge Portal" },
      { name: "description", content: "Every book by Sushant Nikam, free to read online in English, Hindi, and Marathi." },
      { property: "og:title", content: "My Books — Jai Bhim Knowledge Portal" },
      { property: "og:description", content: "Free books inspired by Dr. B. R. Ambedkar Ji, by author Sushant Nikam." },
    ],
  }),
  component: BooksPage,
});

function BooksPage() {
  const { books, loading } = usePublishedBooks();
  const [q, setQ] = useState("");
  const [lang, setLang] = useState<string>("All");
  const [cat, setCat] = useState<string>("All");

  const filtered = useMemo(
    () =>
      books.filter((b) => {
        if (lang !== "All" && b.language !== lang) return false;
        if (cat !== "All" && b.categorySlug !== cat) return false;
        if (q && !`${b.title} ${b.description} ${b.author}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [books, q, lang, cat],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <header>
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-gold)]">Library</div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          My Books
        </h1>
        <p className="mt-3 max-w-2xl text-foreground/80">
          Every book below is written by Sushant Nikam and offered for free online reading.
        </p>
      </header>

      <div className="mt-8 grid gap-3 rounded-xl bg-card p-4 shadow-[var(--shadow-card)] md:grid-cols-[1fr_auto_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search titles or descriptions…"
            className="w-full rounded-md border border-input bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2.5 text-sm font-semibold text-foreground outline-none focus:border-primary"
        >
          <option value="All">All languages</option>
          {languages.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2.5 text-sm font-semibold text-foreground outline-none focus:border-primary"
        >
          <option value="All">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="mt-12 text-center text-muted-foreground">Loading books…</p>
      ) : filtered.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">No books match your filters.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((b) => (
            <BookCard key={b.slug} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}
