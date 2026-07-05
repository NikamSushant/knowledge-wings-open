import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Plus, Trash2, Save, ArrowLeft, Loader2 } from "lucide-react";
import { categories, languages } from "@/lib/books-data";
import { supabase } from "@/integrations/supabase/client";
import { createBook, uploadPdfFromUrl } from "@/lib/books.functions";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const create = useServerFn(createBook);
  const fetchPdf = useServerFn(uploadPdfFromUrl);
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: crypto.randomUUID(), title: "Chapter 1", content: "" },
  ]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pdfSource, setPdfSource] = useState<"upload" | "url">("upload");
  const [pdfUrl, setPdfUrl] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    const slugRaw = String(fd.get("slug") || "").trim();
    const slug = slugRaw || String(fd.get("title") || "")
      .toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) return toast.error("Please provide a title or slug.");

    setBusy(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("You must be signed in.");

      let coverPath: string | null = null;
      if (coverFile) {
        setProgress("Uploading cover…");
        const ext = coverFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${slug}-${Date.now()}.${ext}`;
        const { error } = await supabase.storage
          .from("book-covers")
          .upload(path, coverFile, { upsert: false, contentType: coverFile.type });
        if (error) throw new Error("Cover upload: " + error.message);
        coverPath = path;
      }

      let pdfPath: string | null = null;
      let pdfBlob: Blob | null = null;
      if (pdfSource === "upload" && pdfFile) {
        pdfBlob = pdfFile;
      } else if (pdfSource === "url" && pdfUrl.trim()) {
        setProgress("Fetching PDF from URL on the server…");
        const r = await fetchPdf({ data: { url: pdfUrl.trim(), slug } });
        pdfPath = r.path;
      }
      if (pdfBlob && !pdfPath) {
        setProgress("Uploading PDF…");
        const path = `${slug}-${Date.now()}.pdf`;
        const { error } = await supabase.storage
          .from("book-pdfs")
          .upload(path, pdfBlob, { upsert: false, contentType: "application/pdf" });
        if (error) throw new Error("PDF upload: " + error.message);
        pdfPath = path;
      }

      setProgress("Saving book…");
      await create({
        data: {
          slug,
          title: String(fd.get("title") || ""),
          subtitle: String(fd.get("subtitle") || "") || null,
          description: String(fd.get("description") || ""),
          authorNote: String(fd.get("authorNote") || ""),
          language: String(fd.get("language") || "English"),
          categorySlug: String(fd.get("category") || "ambedkar-thought"),
          category: categories.find((c) => c.slug === String(fd.get("category")))?.name ?? "Ambedkar Thought",
          tags: String(fd.get("tags") || "").split(",").map((t) => t.trim()).filter(Boolean),
          year: Number(fd.get("year") || new Date().getFullYear()),
          pages: Number(fd.get("pages") || 0),
          coverPath,
          pdfPath,
          allowPdfDownload: String(fd.get("allowPdfDownload")) === "yes",
          chapters: chapters.filter((c) => c.title.trim()),
          status: String(fd.get("status") || "draft") as "draft" | "published",
        },
      });
      toast.success("Book saved");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

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

      <form onSubmit={onSubmit} className="space-y-6">
        <Card title="Book details">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title" required>
              <input name="title" required className="input" placeholder="e.g. The Life of Babasaheb" />
            </Field>
            <Field label="Subtitle">
              <input name="subtitle" className="input" placeholder="Optional" />
            </Field>
            <Field label="Slug (URL)">
              <input name="slug" className="input" placeholder="auto from title" />
            </Field>
            <Field label="Copyright year" required>
              <input name="year" required type="number" defaultValue={new Date().getFullYear()} className="input" />
            </Field>
            <Field label="Language" required>
              <select name="language" required className="input">
                {languages.map((l) => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Category" required>
              <select name="category" required className="input">
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Tags (comma-separated)">
              <input name="tags" className="input" placeholder="ambedkar, constitution, youth" />
            </Field>
            <Field label="Publish status" required>
              <select name="status" required className="input" defaultValue="draft">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
            <Field label="Pages">
              <input name="pages" type="number" min={0} defaultValue={0} className="input" />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Short description" required>
              <textarea name="description" required rows={4} className="input" placeholder="1–2 sentences that describe the book to a reader." />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="A note from the author">
              <textarea name="authorNote" rows={3} className="input" placeholder="Optional message shown on the book page." />
            </Field>
          </div>
        </Card>

        <Card title="Cover & files">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Cover image">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setCoverFile(f);
                  if (coverPreview) URL.revokeObjectURL(coverPreview);
                  setCoverPreview(f ? URL.createObjectURL(f) : null);
                }}
                className="input file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground"
              />
              {coverPreview && (
                <img src={coverPreview} alt="preview" className="mt-2 h-32 w-24 rounded object-cover shadow" />
              )}
            </Field>
            <Field label="PDF (optional)">
              <div className="mb-2 inline-flex rounded-md border border-border p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPdfSource("upload")}
                  className={`rounded px-3 py-1 transition-colors ${pdfSource === "upload" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Upload file
                </button>
                <button
                  type="button"
                  onClick={() => setPdfSource("url")}
                  className={`rounded px-3 py-1 transition-colors ${pdfSource === "url" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  From URL
                </button>
              </div>
              {pdfSource === "upload" ? (
                <>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                    className="input file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground"
                  />
                  {pdfFile && <div className="mt-1 text-xs text-muted-foreground">{pdfFile.name} · {(pdfFile.size / 1024 / 1024).toFixed(2)} MB</div>}
                </>
              ) : (
                <>
                  <input
                    type="url"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    placeholder="https://example.com/book.pdf"
                    className="input"
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    The PDF will be fetched and stored in the portal's library. The source must allow cross-origin downloads.
                  </div>
                </>
              )}
            </Field>
            <Field label="Allow PDF download">
              <select name="allowPdfDownload" className="input" defaultValue="no">
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
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
          {progress && (
            <div className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
              <Loader2 className="h-4 w-4 animate-spin" /> {progress}
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="btn-cta inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-bold disabled:opacity-60"
          >
            <Save className="h-4 w-4" /> Save Book
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