import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { BookOpen, LayoutDashboard, Plus, Settings } from "lucide-react";

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
  const isRoot = matchRoute({ to: "/admin" });
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
              <NavItem to="/admin" icon={Settings} label="Settings" exact />
            </nav>
          </div>
          <p className="mt-3 px-1 text-[11px] text-muted-foreground">
            Author-only area. Connect Lovable Cloud to enable persistent book storage and login.
          </p>
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
  const stats = [
    { label: "Books", value: "8" },
    { label: "Chapters", value: "56" },
    { label: "Languages", value: "3" },
    { label: "Categories", value: "7" },
  ];
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-gold)]">Overview</div>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Author Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your library. Add a new book, edit chapters, publish or unpublish.</p>
        </div>
        <Link to="/admin/add-book" className="btn-cta inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold">
          <Plus className="h-4 w-4" /> Add new book
        </Link>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-3xl font-extrabold text-primary">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-lg font-bold">Recent activity</h2>
        <ul className="mt-3 divide-y divide-border text-sm">
          {[
            { t: "Little Bhim, Big Dream — published", d: "3 days ago" },
            { t: "शिक्षा ही मुक्ति है — chapter 3 updated", d: "1 week ago" },
            { t: "The Constitution for All — cover replaced", d: "2 weeks ago" },
          ].map((a) => (
            <li key={a.t} className="flex items-center justify-between py-3">
              <span className="text-foreground">{a.t}</span>
              <span className="text-xs text-muted-foreground">{a.d}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-[color:var(--color-gold)]/40 bg-[color:var(--color-gold)]/10 p-6 text-sm text-foreground/85">
        <strong className="block text-primary">Ready to make it real?</strong>
        Connect Lovable Cloud to store books, upload cover images and PDFs, and manage publish status from this dashboard.
      </div>
    </div>
  );
}