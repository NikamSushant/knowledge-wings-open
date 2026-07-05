import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { BookForm } from "@/components/admin/book-form";
import { createBook } from "@/lib/books.functions";

export const Route = createFileRoute("/admin/books/add")({
  head: () => ({
    meta: [
      { title: "Add Book — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AddBookPage,
});

function AddBookPage() {
  const navigate = useNavigate();
  const create = useServerFn(createBook);
  return (
    <div className="space-y-6">
      <header>
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Add a new book</h1>
        <p className="mt-1 text-sm text-muted-foreground">Fill in the book details, upload a cover, add chapters, and publish.</p>
      </header>
      <BookForm
        submitLabel="Save Book"
        onSubmit={async (v) => {
          await create({ data: v });
          toast.success("Book saved");
          navigate({ to: "/admin/books" });
        }}
      />
    </div>
  );
}