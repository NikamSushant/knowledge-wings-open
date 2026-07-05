import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Menu,
  Minus,
  Moon,
  Plus,
  Search,
  Sun,
  X,
} from "lucide-react";
import { getBookBySlug, COPYRIGHT_NOTE, type Book } from "@/lib/books-data";
import { getPublishedBookBySlug } from "@/lib/books.functions";

export const Route = createFileRoute("/read/$slug")({
  loader: async ({ params }) => {
    const dbBook = await getPublishedBookBySlug({ data: { slug: params.slug } });
    if (dbBook) {
      const hasRealChapterContent = dbBook.chapters.some(
        (c) => c.content && c.content.trim().length > 0,
      );

      let chapters: Book["chapters"];
      if (hasRealChapterContent) {
        chapters = dbBook.chapters;
      } else if (dbBook.hasPdf) {
        chapters = [
          {
            id: "pdf-notice",
            title: "This book is available as a PDF",
            content: `<p>${dbBook.description}</p><p><a href="/books/${dbBook.slug}" style="color:#0B3D91;font-weight:bold;">View book page to download or read the PDF →</a></p>`,
          },
        ];
      } else {
        chapters = [
          { id: "intro", title: "About this book", content: `<p>${dbBook.description}</p>` },
        ];
      }

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
        chapters,
      };
      return { book };
    }
    const book = getBookBySlug(params.slug);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) =>
    loaderData
      ? { meta: [{ title: `Reading: ${loaderData.book.title}` }, { name: "robots", content: "noindex" }] }
      : { meta: [{ title: "Reader" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Book not found</h1>
      <Link to="/books" className="mt-4 inline-flex btn-cta rounded-md px-4 py-2 font-bold">Back to library</Link>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <button onClick={reset} className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground">Try again</button>
    </div>
  ),
  component: Reader,
});

function Reader() {
  const { book } = Route.useLoaderData() as { book: Book };
  const [idx, setIdx] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [dark, setDark] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [query, setQuery] = useState("");
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chapter = book.chapters[idx];
  const isDevanagari = book.language !== "English";

  // Load persisted state
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`reader:${book.slug}`) || "{}");
      if (typeof saved.idx === "number" && saved.idx < book.chapters.length) setIdx(saved.idx);
      if (typeof saved.fontSize === "number") setFontSize(saved.fontSize);
      if (typeof saved.dark === "boolean") setDark(saved.dark);
      if (saved.bookmarks) setBookmarked(saved.bookmarks);
    } catch { /* ignore */ }
  }, [book.slug, book.chapters.length]);

  useEffect(() => {
    localStorage.setItem(
      `reader:${book.slug}`,
      JSON.stringify({ idx, fontSize, dark, bookmarks: bookmarked }),
    );
  }, [book.slug, idx, fontSize, dark, bookmarked]);

  // Reset scroll & progress on chapter change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setProgress(0);
  }, [idx]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const p = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
    setProgress(Math.min(1, Math.max(0, p)));
  };

  const highlightedContent = useMemo(() => {
    if (!query.trim()) return chapter.content;
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return chapter.content.replace(
      new RegExp(`(${safe})`, "gi"),
      `<mark style="background:#D4AF37;color:#061B3A;padding:0 2px;border-radius:2px">$1</mark>`,
    );
  }, [chapter.content, query]);

  const bg = dark ? "bg-[#0e1626]" : "bg-cream";
  const text = dark ? "text-cream" : "text-foreground";
  const chromeBg = dark ? "bg-[#0b1220] border-white/10" : "bg-white/90 border-border";

  return (
    <div className={`${bg} ${text} min-h-[calc(100vh-4rem)] transition-colors`}>
      {/* Top bar */}
      <div className={`sticky top-0 z-20 border-b ${chromeBg} backdrop-blur`}>
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-3 py-2 sm:px-4">
          <button
            className="grid h-9 w-9 place-items-center rounded-md hover:bg-black/5 dark:hover:bg-white/10"
            onClick={() => setSidebar(true)}
            aria-label="Chapters"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link
            to="/books/$slug"
            params={{ slug: book.slug }}
            className="min-w-0 flex-1 truncate text-sm font-bold hover:underline"
          >
            {book.title}
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            <button
              onClick={() => setFontSize((f) => Math.max(14, f - 1))}
              className="grid h-9 w-9 place-items-center rounded-md hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Decrease font size"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-xs font-semibold tabular-nums">{fontSize}</span>
            <button
              onClick={() => setFontSize((f) => Math.min(28, f + 1))}
              className="grid h-9 w-9 place-items-center rounded-md hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Increase font size"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            className="grid h-9 w-9 place-items-center rounded-md hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setBookmarked((m) => ({ ...m, [chapter.id]: !m[chapter.id] }))}
            className="grid h-9 w-9 place-items-center rounded-md hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Bookmark this chapter"
          >
            {bookmarked[chapter.id] ? (
              <BookmarkCheck className="h-4 w-4 text-[color:var(--color-gold)]" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        </div>
        {/* progress */}
        <div className="h-1 w-full bg-black/5 dark:bg-white/10">
          <div
            className="h-full bg-[color:var(--color-gold)] transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Search */}
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search inside this chapter…"
            className={`w-full rounded-md border py-2 pl-9 pr-3 text-sm outline-none focus:border-primary ${
              dark ? "border-white/15 bg-white/5 text-cream placeholder:text-cream/50" : "border-border bg-white"
            }`}
          />
        </label>
      </div>

      {/* Body */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="mx-auto max-h-[calc(100vh-13rem)] max-w-3xl overflow-y-auto px-4 py-8 sm:px-6"
      >
        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--color-gold)]">
          Chapter {idx + 1} of {book.chapters.length}
        </div>
        <h1
          className="mt-1 text-2xl font-extrabold sm:text-3xl"
          style={isDevanagari ? { fontFamily: "var(--font-devanagari)" } : undefined}
        >
          {chapter.title}
        </h1>
        <div className="mt-6 h-[2px] w-16 bg-[color:var(--color-gold)]" />
        <article
          className="reader-prose mt-6"
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: isDevanagari ? "var(--font-devanagari)" : undefined,
          }}
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
        />

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-6 dark:border-white/10">
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="inline-flex items-center gap-2 rounded-md border-2 border-primary px-4 py-2 text-sm font-bold text-primary disabled:opacity-40 hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>
          <div className="text-xs text-muted-foreground">
            {idx + 1} / {book.chapters.length}
          </div>
          <button
            onClick={() => setIdx((i) => Math.min(book.chapters.length - 1, i + 1))}
            disabled={idx === book.chapters.length - 1}
            className="btn-cta inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold disabled:opacity-40"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-10 text-[11px] leading-relaxed text-muted-foreground">{COPYRIGHT_NOTE}</p>
      </div>

      {/* Chapter sidebar */}
      {sidebar && (
        <div className="fixed inset-0 z-30 flex" onClick={() => setSidebar(false)}>
          <div className="flex-1 bg-black/40" />
          <aside
            onClick={(e) => e.stopPropagation()}
            className={`h-full w-80 max-w-[85vw] overflow-y-auto p-4 shadow-2xl ${dark ? "bg-[#0b1220] text-cream" : "bg-cream text-foreground"}`}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold uppercase tracking-wider">Chapters</div>
              <button onClick={() => setSidebar(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="mt-4 space-y-1">
              {book.chapters.map((c, i) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setIdx(i);
                      setSidebar(false);
                    }}
                    className={`flex w-full items-start gap-3 rounded-md px-3 py-2 text-left text-sm ${
                      i === idx ? "bg-primary text-primary-foreground" : "hover:bg-black/5 dark:hover:bg-white/10"
                    }`}
                  >
                    <span className="mt-0.5 text-xs font-bold tabular-nums opacity-80">{i + 1}.</span>
                    <span className="font-semibold" style={isDevanagari ? { fontFamily: "var(--font-devanagari)" } : undefined}>
                      {c.title}
                    </span>
                    {bookmarked[c.id] && <BookmarkCheck className="ml-auto h-4 w-4 text-[color:var(--color-gold)]" />}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
}
