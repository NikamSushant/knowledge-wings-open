
-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Books table
CREATE TABLE public.books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  author text NOT NULL DEFAULT 'Sushant Nikam',
  description text NOT NULL DEFAULT '',
  author_note text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT 'English',
  category text NOT NULL DEFAULT 'Ambedkar Thought',
  category_slug text NOT NULL DEFAULT 'ambedkar-thought',
  tags text[] NOT NULL DEFAULT '{}',
  year int NOT NULL DEFAULT extract(year from now())::int,
  pages int NOT NULL DEFAULT 0,
  cover_path text,
  cover_url text,
  pdf_path text,
  allow_pdf_download boolean NOT NULL DEFAULT false,
  chapters jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.books TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.books TO authenticated;
GRANT ALL ON public.books TO service_role;

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published books are readable by everyone"
  ON public.books FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert books"
  ON public.books FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update books"
  ON public.books FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete books"
  ON public.books FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER books_set_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage policies (buckets created via tool)
-- book-covers: public read; admins write
CREATE POLICY "Public read book covers"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'book-covers');

CREATE POLICY "Admins upload book covers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'book-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update book covers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'book-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete book covers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'book-covers' AND public.has_role(auth.uid(), 'admin'));

-- book-pdfs: no public read (signed URLs only), admins full write
CREATE POLICY "Admins read book pdfs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'book-pdfs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins upload book pdfs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'book-pdfs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update book pdfs"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'book-pdfs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete book pdfs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'book-pdfs' AND public.has_role(auth.uid(), 'admin'));
