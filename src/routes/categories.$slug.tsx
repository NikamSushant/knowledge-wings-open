import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BookCard } from "@/components/book-card";
import { categories, getBooksByCategory, type Book } from "@/lib/books-data";

export const Route = createFileRoute("/categories/$slug")({
  loader: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    return { cat, list: getBooksByCategory(params.slug) };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.cat.name} — Jai Bhim Knowledge Portal` },
            { name: "description", content: `Books in the ${loaderData.cat.name} category by Sushant Nikam.` },
          ],
        }
      : { meta: [{ title: "Category" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Category not found</h1>
      <Link to="/categories" className="mt-4 inline-flex btn-cta rounded-md px-4 py-2 font-bold">All categories</Link>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <button onClick={reset} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Try again</button>
    </div>
  ),
  component: CategoryDetail,
});

function CategoryDetail() {
  const { cat, list } = Route.useLoaderData() as {
    cat: { name: string; slug: string };
    list: Book[];
  };
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link to="/categories" className="hover:text-primary">Categories</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{cat.name}</span>
      </nav>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{cat.name}</h1>
      <p className="mt-2 text-muted-foreground">
        {list.length} book{list.length === 1 ? "" : "s"} available for free online reading.
      </p>
      {list.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No books in this category yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((b) => <BookCard key={b.slug} book={b} />)}
        </div>
      )}
    </div>
  );
}