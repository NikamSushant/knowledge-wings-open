import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { books, categories } from "@/lib/books-data";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Jai Bhim Knowledge Portal" },
      { name: "description", content: "Browse books by category: Life of Ambedkar, Constitution, Education, Social Justice, Economics, Buddhism, and more." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-gold)]">Categories</div>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Browse by subject</h1>
      <p className="mt-3 max-w-2xl text-foreground/80">
        Every category is a doorway into Babasaheb’s thinking. Choose the one you want to walk through today.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const count = books.filter((b) => b.categorySlug === c.slug).length;
          return (
            <Link
              key={c.slug}
              to="/categories/$slug"
              params={{ slug: c.slug }}
              className="group flex items-center justify-between rounded-xl bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">{count} book{count === 1 ? "" : "s"}</div>
                <div className="mt-1 text-xl font-extrabold text-foreground group-hover:text-primary">{c.name}</div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}