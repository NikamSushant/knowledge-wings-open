import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Save, ArrowLeft, CheckCircle2 } from "lucide-react";
import { categories, languages } from "@/lib/books-data";

export const Route = createFileRoute("/admin/add-book")({
  head: () => ({
    meta: [
      { title: "Add Book — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AddBook,
});

type Chapter = { id: string; title: string; content: string };

function AddBook() {
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: crypto.randomUUID(), title: "Chapter 1", content: "" },
  ]);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Add a new book</h1>
          <p className="mt-1 text-sm text-muted-foreground">Fill in the book details, upload a cover, add chapters, and publish.</p>
        </div>
      </header>

      <form
        onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 3000); }}
        className="space-y-6"
      >
        <Card title="Book details">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title" required>
              <input required className="input" placeholder="e.g. The Life of Babasaheb" />
            </Field>
            <Field label="Subtitle">
              <input className="input" placeholder="Optional" />
            </Field>
            <Field label="Author" required>
              <input required defaultValue="Sushant Nikam" className="input" />
            </Field>
            <Field label="Copyright year" required>
              <input required type="number" defaultValue={2026} className="input" />
            </Field>
            <Field label="Language" required>
              <select required className="input">
                {languages.map((l) => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Category" required>
              <select required className="input">
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Tags (comma-separated)">
              <input className="input" placeholder="ambedkar, constitution, youth" />
            </Field>
            <Field label="Publish status" required>
              <select required className="input" defaultValue="draft">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Short description" required>
              <textarea required rows={4} className="input" placeholder="1–2 sentences that describe the book to a reader." />
            </Field>
          </div>
        </Card>

        <Card title="Cover & files">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Cover image">
              <input type="file" accept="image/*" className="input file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground" />
            </Field>
            <Field label="PDF file (optional)">
              <input type="file" accept="application/pdf" className="input file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground" />
            </Field>
            <Field label="Allow PDF download">
              <select className="input"><option>No</option><option>Yes</option></select>
            </Field>
          </div>
        </Card>

        <Card
          title="Chapters"
          action={
            <button
              type="button"
              onClick={() => setChapters((cs) => [...cs, { id: crypto.randomUUID(), title: `Chapter ${cs.length + 1}`, content: "" }])}
              className="inline-flex items-center gap-1 rounded-md border-2 border-primary px-3 py-1.5 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="h-4 w-4" /> Add chapter
            </button>
          }
        >
          <div className="space-y-4">
            {chapters.map((c, i) => (
              <div key={c.id} className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                  <input
                    className="input flex-1"
                    value={c.title}
                    onChange={(e) => setChapters((cs) => cs.map((x) => x.id === c.id ? { ...x, title: e.target.value } : x))}
                    placeholder="Chapter title"
                  />
                  <button
                    type="button"
                    onClick={() => setChapters((cs) => cs.filter((x) => x.id !== c.id))}
                    className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove chapter"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  rows={5}
                  className="input mt-3"
                  placeholder="Chapter content (plain text or basic HTML)"
                  value={c.content}
                  onChange={(e) => setChapters((cs) => cs.map((x) => x.id === c.id ? { ...x, content: e.target.value } : x))}
                />
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {saved && (
            <div className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
              <CheckCircle2 className="h-4 w-4" /> Draft saved locally (connect Lovable Cloud to persist)
            </div>
          )}
          <button type="button" className="rounded-md border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground">
            Save as draft
          </button>
          <button type="submit" className="btn-cta inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-bold">
            <Save className="h-4 w-4" /> Save & Publish
          </button>
        </div>
      </form>

      <style>{`.input{width:100%;border:1px solid var(--color-input);background:var(--color-background);border-radius:0.5rem;padding:0.6rem 0.75rem;font-size:0.9rem;outline:none}.input:focus{border-color:var(--color-primary)}`}</style>
    </div>
  );
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}{required && <span className="text-[color:var(--color-cta)]"> *</span>}
      </span>
      {children}
    </label>
  );
}