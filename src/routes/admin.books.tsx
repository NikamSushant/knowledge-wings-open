import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Edit3, FileDown, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteBook,
  getBookPdfUrl,
  listAllBooks,
  setBookStatus,
} from "@/lib/books.functions";
import { categories, languages } from "@/lib/books-data";

export const Route = createFileRoute("/admin/books")({
  head: () => ({
    meta: [
      { title: "Manage Books — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ManageBooksPage,
});

function ManageBooksPage() {
  const list = useServerFn(listAllBooks);
  const del = useServerFn(deleteBook);
  const status = useServerFn(setBookStatus);
  const getPdf = useServerFn(getBookPdfUrl);
  const qc = useQueryClient();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["admin-books"],
    queryFn: async () => (await list()) as Awaited<ReturnType<typeof listAllBooks>>,
  });

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [lang, setLang] = useState("all");
  const [stat, setStat] = useState<"all" | "draft" | "published">("all");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return books.filter((b) => {
      if (cat !== "all" && b.categorySlug !== cat) return false;
      if (lang !== "all" && b.language !== lang) return false;
      if (stat !== "all" && b.status !== stat) return false;
      if (term && !`${b.title} ${b.author} ${b.tags.join(" ")}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [books, q, cat, lang, stat]);

  const deleteMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-books"] });
      toast.success("Book deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const statusMut = useMutation({
    mutationFn: (v: { id: string; status: "draft" | "published" }) => status({ data: v }),
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["admin-books"] });
      toast.success(v.status === "published" ? "Published" : "Moved to drafts");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-gold)]">Library</div>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Manage Books</h1>
          <p className="mt-1 text-sm text-muted-foreground">Search, filter, edit, publish or remove books in your library.</p>
        </div>
        <Link to="/admin/books/add" className="btn-cta inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold">
          <Plus className="h-4 w-4" /> Add new book
        </Link>
      </header>

      <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, author, tag…"
              className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary">
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary">
            <option value="all">All languages</option>
            {languages.map((l) => <option key={l}>{l}</option>)}
          </select>
          <select value={stat} onChange={(e) => setStat(e.target.value as typeof stat)} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary">
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="mt-5 overflow-x-auto">
          {isLoading ? (
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No books match the current filters.</p>
          ) : (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2 pr-2">Book</th>
                  <th className="py-2 pr-2">Category</th>
                  <th className="py-2 pr-2">Language</th>
                  <th className="py-2 pr-2">Status</th>
                  <th className="py-2 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-10 shrink-0 overflow-hidden rounded bg-secondary">
                          {b.coverUrl ? (
                            <img src={b.coverUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="grid h-full w-full place-items-center text-[9px] font-bold text-muted-foreground">No cover</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-bold text-foreground">{b.title}</div>
                          <div className="truncate text-xs text-muted-foreground">{b.author}{b.hasPdf ? " · PDF" : ""}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-2 text-xs">{b.category}</td>
                    <td className="py-3 pr-2 text-xs">{b.language}</td>
                    <td className="py-3 pr-2">
                      <select
                        value={b.status}
                        onChange={(e) => statusMut.mutate({ id: b.id, status: e.target.value as "draft" | "published" })}
                        className={`rounded-md border border-input bg-background px-2 py-1 text-xs font-semibold outline-none ${b.status === "published" ? "text-primary" : "text-[color:var(--color-cta)]"}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </td>
                    <td className="py-3 pr-2">
                      <div className="flex justify-end gap-1.5">
                        {b.status === "published" && (
                          <Link
                            to="/books/$slug"
                            params={{ slug: b.slug }}
                            className="rounded-md border border-input px-2.5 py-1.5 text-xs font-semibold hover:bg-secondary"
                          >
                            View
                          </Link>
                        )}
                        {b.hasPdf && (
                          <button
                            onClick={async () => {
                              const r = await getPdf({ data: { slug: b.slug } });
                              if (r.url) window.open(r.url, "_blank");
                              else toast.info("PDF download is disabled for this book.");
                            }}
                            className="inline-flex items-center gap-1 rounded-md border border-input px-2.5 py-1.5 text-xs font-semibold hover:bg-secondary"
                          >
                            <FileDown className="h-3.5 w-3.5" /> PDF
                          </button>
                        )}
                        <Link
                          to="/admin/books/edit/$id"
                          params={{ id: b.id }}
                          className="inline-flex items-center gap-1 rounded-md border border-input px-2.5 py-1.5 text-xs font-semibold hover:bg-secondary"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${b.title}"? This cannot be undone.`)) deleteMut.mutate(b.id);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Delete book"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}