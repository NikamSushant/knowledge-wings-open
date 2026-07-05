import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BookForm } from "@/components/admin/book-form";
import { getBookById, updateBook } from "@/lib/books.functions";

export const Route = createFileRoute("/admin/books/edit/$id")({
  head: () => ({
    meta: [
      { title: "Edit Book — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EditBookPage,
});

function EditBookPage() {
  const { id } = useParams({ from: "/admin/books/edit/$id" });
  const navigate = useNavigate();
  const get = useServerFn(getBookById);
  const update = useServerFn(updateBook);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-book", id],
    queryFn: () => get({ data: { id } }),
  });

  return (
    <div className="space-y-6">
      <header>
        <Link to="/admin/books" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to books
        </Link>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Edit book</h1>
      </header>

      {isLoading ? (
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : error || !data ? (
        <p className="text-sm text-destructive">Book not found.</p>
      ) : (
        <BookForm
          submitLabel="Update Book"
          currentCoverUrl={data.coverUrl}
          initial={{
            slug: data.slug,
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            authorNote: data.authorNote,
            language: data.language,
            category: data.category,
            categorySlug: data.categorySlug,
            tags: data.tags,
            year: data.year,
            pages: data.pages,
            coverPath: null,
            pdfPath: data.hasPdf ? "existing" : null,
            allowPdfDownload: data.allowPdfDownload,
            chapters: data.chapters,
            status: data.status as "draft" | "published",
          }}
          onSubmit={async (v) => {
            await update({ data: { ...v, id } });
            toast.success("Book updated");
            navigate({ to: "/admin/books" });
          }}
        />
      )}
    </div>
  );
}