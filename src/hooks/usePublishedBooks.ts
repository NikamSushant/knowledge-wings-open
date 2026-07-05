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
    subtitle: row.subtitle ?? undefined,
    author: row.author,
    language: row.language ?? "English",
    category: row.category ?? "General",
    categorySlug:
      row.category_slug ??
      (row.category ?? "general").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    pages: row.pages ?? 0,
    year: row.year ?? new Date().getFullYear(),
    description: row.description ?? "",
    authorNote: row.author_note ?? "",
    coverGradient: "linear-gradient(140deg, #0B3D91 0%, #061B3A 100%)",
    coverUrl: row.cover_path ?? null,
    hasPdf: !!row.pdf_path,
    allowPdfDownload: !!row.allow_pdf_download,
    featured: false,
    isChildren: row.category === "Children's Books",
    addedAt: row.created_at,
    chapters: Array.isArray(row.chapters) ? row.chapters : [],
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
