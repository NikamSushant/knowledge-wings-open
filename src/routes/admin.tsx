import { createFileRoute, Link, Outlet, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, LayoutDashboard, Loader2, Plus, Trash2, FileDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { checkAdmin, listAllBooks, deleteBook, getBookPdfUrl } from "@/lib/books.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Jai Bhim Knowledge Portal" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const matchRoute = useMatchRoute();
  const navigate = useNavigate();
  const isRoot = matchRoute({ to: "/admin" });
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  const check = useServerFn(checkAdmin);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      try {
        const res = await check();
        if (cancelled) return;
        setState(res.isAdmin ? "ok" : "denied");
      } catch {
        if (!cancelled) setState("denied");
      }
    })();
    return () => { cancelled = true; };
  }, [check, navigate]);

  if (state === "loading") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4">
        <div className="inline-flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Checking access…
        </div>
      </div>
    );
  }
  if (state === "denied") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold">Not authorised</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account does not have admin access. Ask the portal owner to grant the admin role in the Cloud dashboard.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}
            className="rounded-md border-2 border-primary px-4 py-2 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Sign out
          </button>
          <Link to="/" className="btn-cta rounded-md px-4 py-2 text-sm font-bold">Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Admin</div>
            <nav className="space-y-1">
              <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" exact />
              <NavItem to="/admin/add-book" icon={Plus} label="Add Book" />
              <NavItem to="/admin" icon={BookOpen} label="Manage Books" exact />
            </nav>
            <button
              onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}
              className="mt-3 w-full rounded-md border border-input px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
            >
              Sign out
            </button>
          </div>
        </aside>
        <div className="min-w-0">{isRoot ? <Dashboard /> : <Outlet />}</div>
      </div>
    </div>
  );
}

function NavItem({
  to,
  icon: Icon,
  label,
  exact,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  exact?: boolean;
}) {
  return (
    <Link
      to={to as "/admin"}
      activeProps={{ className: "bg-primary text-primary-foreground" }}
      inactiveProps={{ className: "text-foreground/80 hover:bg-secondary" }}
      activeOptions={{ exact }}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold"
    >
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}

function Dashboard() {
  const list = useServerFn(listAllBooks);
  const del = useServerFn(deleteBook);
  const getPdf = useServerFn(getBookPdfUrl);
  const qc = useQueryClient();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["admin-books"],
    queryFn: async () => (await list()) as Awaited<ReturnType<typeof listAllBooks>>,
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-books"] }); toast.success("Book deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const published = books.filter((b) => b.status === "published").length;
  const drafts = books.length - published;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-gold)]">Overview</div>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Author Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add new books, upload covers and PDFs, manage publish status.</p>
        </div>
        <Link to="/admin/add-book" className="btn-cta inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold">
          <Plus className="h-4 w-4" /> Add new book
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: books.length },
          { label: "Published", value: published },
          { label: "Drafts", value: drafts },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-3xl font-extrabold text-primary">{s.value}</div>
          </div>
        ))}
      </div>

      <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-lg font-bold">Your books</h2>
        {isLoading ? (
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : books.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No books yet. Click <em>Add new book</em> to publish your first one.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {books.map((b) => (
              <li key={b.id} className="flex items-center gap-4 py-3">
                <div className="h-16 w-12 shrink-0 overflow-hidden rounded bg-secondary">
                  {b.coverUrl ? (
                    <img src={b.coverUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-[10px] font-bold text-muted-foreground">No cover</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold text-foreground">{b.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {b.language} · {b.category} · <span className={b.status === "published" ? "text-primary" : "text-[color:var(--color-cta)]"}>{b.status}</span>
                    {b.hasPdf && " · PDF"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {b.status === "published" && (
                    <Link
                      to="/books/$slug"
                      params={{ slug: b.slug }}
                      className="rounded-md border border-input px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
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
                      className="inline-flex items-center gap-1 rounded-md border border-input px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
                    >
                      <FileDown className="h-3.5 w-3.5" /> PDF
                    </button>
                  )}
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
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}