import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Share2, BookOpen, FileText } from "lucide-react";
import { BookCover } from "@/components/book-card";
import { getBookBySlug, books, COPYRIGHT_NOTE, type Book } from "@/lib/books-data";
import { getPublishedBookBySlug, getBookPdfUrl } from "@/lib/books.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/books/$slug")({
  loader: async ({ params }) => {
    const dbBook = await getPublishedBookBySlug({ data: { slug: params.slug } });
    if (dbBook) {
      const book: Book = {
        slug: dbBook.slug,
        title: dbBook.title,
        subtitle: dbBook.subtitle ?? undefined,
        author: dbBook.author,
        language: dbBook.language,
        category: dbBook.category,
        categorySlug: dbBook.categorySlug,
        pages: dbBook.pages,
        year: dbBook.year,
        description: dbBook.description,
        authorNote: dbBook.authorNote,
        coverUrl: dbBook.coverUrl,
        hasPdf: dbBook.hasPdf,
        allowPdfDownload: dbBook.allowPdfDownload,
        chapters: dbBook.chapters,
      };
      return { book };
    }
    const book = getBookBySlug(params.slug);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Book not found" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${loaderData.book.title} — Jai Bhim Knowledge Portal` },
        { name: "description", content: loaderData.book.description },
        { property: "og:title", content: loaderData.book.title },
        { property: "og:description", content: loaderData.book.description },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Book not found</h1>
      <p className="mt-2 text-muted-foreground">The book you’re looking for isn’t in the library yet.</p>
      <Link to="/books" className="mt-6 inline-flex btn-cta rounded-md px-4 py-2 font-bold">
        Browse all books
      </Link>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <button onClick={reset} className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground">
        Try again
      </button>
    </div>
  ),
  component: BookDetail,
});

function BookDetail() {
  const { book } = Route.useLoaderData() as { book: Book };
  const getPdf = useServerFn(getBookPdfUrl);
  const related = books.filter((b) => b.slug !== book.slug && b.categorySlug === book.categorySlug).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/books" className="hover:text-primary">My Books</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{book.title}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-[minmax(0,280px)_1fr]">
        <div>
          <BookCover book={book} />
          <div className="mt-5 space-y-2">
            <Link
              to="/read/$slug"
              params={{ slug: book.slug }}
              className="btn-cta inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 font-bold"
            >
              <BookOpen className="h-5 w-5" /> Read Online
            </Link>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-primary px-4 py-3 font-bold text-primary hover:bg-primary hover:text-primary-foreground">
              <Share2 className="h-4 w-4" /> Share Book
            </button>
            {book.hasPdf && book.allowPdfDownload ? (
              <button
                onClick={async () => {
                  const r = await getPdf({ data: { slug: book.slug } });
                  if (r.url) window.open(r.url, "_blank");
                  else toast.info("PDF is not available for download.");
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-[color:var(--color-gold)] px-4 py-3 font-bold text-[color:var(--color-navy)] hover:bg-[color:var(--color-gold)]/20"
              >
                <FileText className="h-4 w-4" /> Download PDF
              </button>
            ) : (
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-muted px-4 py-3 text-sm font-semibold text-muted-foreground" disabled>
                <FileText className="h-4 w-4" /> PDF not available
              </button>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-gold)]">
            {book.category}
          </div>
          <h1
            className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl"
            style={book.language !== "English" ? { fontFamily: "var(--font-devanagari)" } : undefined}
          >
            {book.title}
          </h1>
          {book.subtitle && (
            <p className="mt-2 text-lg text-muted-foreground" style={book.language !== "English" ? { fontFamily: "var(--font-devanagari)" } : undefined}>
              {book.subtitle}
            </p>
          )}
          <dl className="mt-6 grid grid-cols-2 gap-3 rounded-lg bg-card p-4 text-sm shadow-[var(--shadow-card)] sm:grid-cols-4">
            <Meta label="Author" value={book.author} />
            <Meta label="Language" value={book.language} />
            <Meta label="Pages" value={String(book.pages)} />
            <Meta label="Year" value={String(book.year)} />
          </dl>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-foreground">About this book</h2>
            <p className="mt-3 leading-relaxed text-foreground/85">{book.description}</p>
          </section>

          <section className="mt-8 rounded-lg border-l-4 border-[color:var(--color-gold)] bg-[color:var(--color-gold)]/10 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[color:var(--color-navy)]">
              A note from the author
            </h2>
            <p className="mt-2 italic text-foreground/85">“{book.authorNote}”</p>
            <p className="mt-2 text-sm font-semibold text-primary">— {book.author}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-foreground">Table of contents</h2>
            <ol className="mt-3 divide-y divide-border overflow-hidden rounded-lg bg-card shadow-[var(--shadow-card)]">
              {book.chapters.map((c, i) => (
                <li key={c.id}>
                  <Link
                    to="/read/$slug"
                    params={{ slug: book.slug }}
                    hash={c.id}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-secondary/60"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-foreground">{c.title}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10 rounded-md border border-border bg-secondary/50 p-4 text-xs leading-relaxed text-muted-foreground">
            {COPYRIGHT_NOTE}
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-foreground">More in {book.category}</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/books/$slug"
                params={{ slug: r.slug }}
                className="rounded-xl bg-card p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)]"
              >
                <BookCover book={r} />
                <div className="mt-3 font-bold text-foreground">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.language} · {r.category}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold text-foreground">{value}</dd>
    </div>
  );
}