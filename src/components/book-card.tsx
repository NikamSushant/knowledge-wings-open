import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Book } from "@/lib/books-data";

export function BookCover({ book, className = "" }: { book: Book; className?: string }) {
  const isDevanagari = book.language !== "English";
  const bg = book.coverUrl
    ? `center/cover no-repeat url("${book.coverUrl}")`
    : book.coverGradient || "linear-gradient(140deg, #0B3D91 0%, #061B3A 100%)";
  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-md shadow-[var(--shadow-card)] ${className}`}
      style={{ background: bg }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
      <div className="absolute left-0 top-6 h-[3px] w-16 bg-[color:var(--color-gold)]" />
      <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
          {book.language} · {book.category}
        </div>
        <div>
          <div
            className={`text-lg font-extrabold leading-tight ${isDevanagari ? "font-[var(--font-devanagari)]" : ""}`}
            style={isDevanagari ? { fontFamily: "var(--font-devanagari)" } : undefined}
          >
            {book.title}
          </div>
          {book.subtitle && (
            <div
              className="mt-1 text-[11px] text-white/85"
              style={isDevanagari ? { fontFamily: "var(--font-devanagari)" } : undefined}
            >
              {book.subtitle}
            </div>
          )}
          <div className="mt-3 border-t border-white/25 pt-2 text-[10px] uppercase tracking-widest text-white/80">
            {book.author}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <Link to="/books/$slug" params={{ slug: book.slug }} className="block p-4 pb-0">
        <BookCover book={book} />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
          {book.category}
        </div>
        <h3 className="mt-1 text-base font-bold leading-snug text-foreground line-clamp-2">
          <Link to="/books/$slug" params={{ slug: book.slug }} className="hover:text-primary">
            {book.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">
          {book.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{book.author}</span>
          <span>{book.language} · {book.pages} pages</span>
        </div>
        <Link
          to="/read/$slug"
          params={{ slug: book.slug }}
          className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-[color:var(--color-navy)]"
        >
          Read Online <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}