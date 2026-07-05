import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Book } from "@/lib/books-data";


// Maps a Supabase `books` row into the same shape the rest of the site
// (BookCard, book detail page, reader page) already expects from the
// mock data file — so those components don't need to change.
function mapDbBookToBook(row: Record<string, any>): Book {
  return {
    slug: row.slug,
    title: row.title,
    subtitle: undefined,
    author: row.author,
    language:
      row.language === "hi" ? "Hindi" : row.language === "mr" ? "Marathi" : "English",
    category: row.category ?? "General",
    categorySlug: (row.category ?? "general").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    pages: 0,
    year: row.published_at ? new Date(row.published_at).getFullYear() : new Date().getFullYear(),
    description: row.description ?? "",
    authorNote: "",
    coverGradient: "linear-gradient(140deg, #0B3D91 0%, #061B3A 100%)",
    coverUrl: row.cover_url ?? null,
    hasPdf: !!row.pdf_url,
    allowPdfDownload: !!row.pdf_url,
    featured: false,
    isChildren: row.category === "Children's Books",
    addedAt: row.published_at ?? row.created_at,
    chapters: row.content
      ? [{ id: "full-text", title: "Full Text", content: row.content }]
      : [],
  };
}

export function usePublishedBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (!active) return;
      if (!error && data) setBooks(data.map(mapDbBookToBook));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { books, loading };
}
