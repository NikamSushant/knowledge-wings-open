import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const COVERS_BUCKET = "book-covers";
const PDFS_BUCKET = "book-pdfs";
const COVER_EXPIRES_IN = 60 * 60 * 24 * 7; // 7 days for image tags
const PDF_EXPIRES_IN = 60 * 60; // 1 hour download link

function serverPublic() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export type DbBook = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  author: string;
  description: string;
  authorNote: string;
  language: string;
  category: string;
  categorySlug: string;
  tags: string[];
  year: number;
  pages: number;
  status: string;
  allowPdfDownload: boolean;
  hasPdf: boolean;
  coverUrl: string | null;
  chapters: { id: string; title: string; content: string }[];
  createdAt: string;
};

async function signCover(sb: ReturnType<typeof serverPublic>, path: string | null) {
  if (!path) return null;
  const { data } = await sb.storage.from(COVERS_BUCKET).createSignedUrl(path, COVER_EXPIRES_IN);
  return data?.signedUrl ?? null;
}

function shape(row: Database["public"]["Tables"]["books"]["Row"], coverUrl: string | null): DbBook {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    author: row.author,
    description: row.description,
    authorNote: row.author_note,
    language: row.language,
    category: row.category,
    categorySlug: row.category_slug,
    tags: row.tags,
    year: row.year,
    pages: row.pages,
    status: row.status,
    allowPdfDownload: row.allow_pdf_download,
    hasPdf: !!row.pdf_path,
    coverUrl,
    chapters: Array.isArray(row.chapters) ? (row.chapters as DbBook["chapters"]) : [],
    createdAt: row.created_at,
  };
}

export const listPublishedBooks = createServerFn({ method: "GET" }).handler(async () => {
  const sb = serverPublic();
  const { data, error } = await sb
    .from("books")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  const shaped = await Promise.all(
    rows.map(async (r) => shape(r, await signCover(sb, r.cover_path))),
  );
  return shaped;
});

export const getPublishedBookBySlug = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: row, error } = await sb
      .from("books")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    return shape(row, await signCover(sb, row.cover_path));
  });

export const getBookPdfUrl = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const { data: row, error } = await sb
      .from("books")
      .select("pdf_path, status, allow_pdf_download")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row || row.status !== "published" || !row.pdf_path || !row.allow_pdf_download) {
      return { url: null as string | null };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed } = await supabaseAdmin.storage
      .from(PDFS_BUCKET)
      .createSignedUrl(row.pdf_path, PDF_EXPIRES_IN, { download: true });
    return { url: signed?.signedUrl ?? null };
  });

/* --------- Admin --------- */

const bookInput = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/i),
  title: z.string().min(1).max(200),
  subtitle: z.string().max(300).optional().nullable(),
  description: z.string().max(4000).default(""),
  authorNote: z.string().max(2000).default(""),
  language: z.string().min(1).max(40),
  category: z.string().min(1).max(80),
  categorySlug: z.string().min(1).max(80),
  tags: z.array(z.string().max(40)).max(20).default([]),
  year: z.number().int().min(1900).max(2100),
  pages: z.number().int().min(0).max(10000).default(0),
  coverPath: z.string().max(500).nullable().optional(),
  pdfPath: z.string().max(500).nullable().optional(),
  allowPdfDownload: z.boolean().default(false),
  chapters: z
    .array(z.object({ id: z.string(), title: z.string(), content: z.string() }))
    .default([]),
  status: z.enum(["draft", "published"]).default("draft"),
});

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const listAllBooks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const sb = serverPublic();
    const rows = data ?? [];
    const shaped = await Promise.all(
      rows.map(async (r: any) => shape(r, await signCover(sb, r.cover_path))),
    );
    return shaped;
  });

export const createBook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => bookInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("books").insert({
      slug: data.slug,
      title: data.title,
      subtitle: data.subtitle ?? null,
      description: data.description,
      author_note: data.authorNote,
      language: data.language,
      category: data.category,
      category_slug: data.categorySlug,
      tags: data.tags,
      year: data.year,
      pages: data.pages,
      cover_path: data.coverPath ?? null,
      pdf_path: data.pdfPath ?? null,
      allow_pdf_download: data.allowPdfDownload,
      chapters: data.chapters,
      status: data.status,
      created_by: context.userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateBook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    bookInput.extend({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("books")
      .update({
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle ?? null,
        description: data.description,
        author_note: data.authorNote,
        language: data.language,
        category: data.category,
        category_slug: data.categorySlug,
        tags: data.tags,
        year: data.year,
        pages: data.pages,
        cover_path: data.coverPath ?? null,
        pdf_path: data.pdfPath ?? null,
        allow_pdf_download: data.allowPdfDownload,
        chapters: data.chapters,
        status: data.status,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setBookStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({ id: z.string().uuid(), status: z.enum(["draft", "published"]) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("books")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getBookById = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: row, error } = await context.supabase
      .from("books")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    const sb = serverPublic();
    return shape(row, await signCover(sb, row.cover_path));
  });

/**
 * Fetch a PDF from a public URL on the server (bypasses browser CORS) and
 * store it in the book-pdfs bucket. Returns the storage path to save on the
 * book row.
 */
export const uploadPdfFromUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        url: z.string().url().max(2000),
        slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/i),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const res = await fetch(data.url, { redirect: "follow" });
    if (!res.ok) throw new Error(`Failed to fetch PDF (HTTP ${res.status})`);
    const ct = res.headers.get("content-type") ?? "";
    const buf = new Uint8Array(await res.arrayBuffer());
    if (buf.byteLength < 100) throw new Error("Downloaded file is empty");
    // Accept common misconfigured servers, but sniff the %PDF- header too
    const looksPdf =
      ct.toLowerCase().includes("pdf") ||
      (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46);
    if (!looksPdf) throw new Error("URL did not return a PDF file");
    const path = `${data.slug}-${Date.now()}.pdf`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage
      .from(PDFS_BUCKET)
      .upload(path, buf, { contentType: "application/pdf", upsert: false });
    if (error) throw new Error("PDF upload: " + error.message);
    return { path, size: buf.byteLength };
  });

export const deleteBook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: row } = await context.supabase
      .from("books")
      .select("cover_path, pdf_path")
      .eq("id", data.id)
      .maybeSingle();
    const { error } = await context.supabase.from("books").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    if (row?.cover_path) {
      await context.supabase.storage.from(COVERS_BUCKET).remove([row.cover_path]);
    }
    if (row?.pdf_path) {
      await context.supabase.storage.from(PDFS_BUCKET).remove([row.pdf_path]);
    }
    return { ok: true };
  });

export const checkAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error(error.message);
    return { isAdmin: !!data, userId: context.userId };
  });