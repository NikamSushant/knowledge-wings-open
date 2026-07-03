import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Sparkles, Smartphone, HeartHandshake, GraduationCap, Users } from "lucide-react";
import { BookCard } from "@/components/book-card";
import { books, categories, featuredBooks, latestBooks } from "@/lib/books-data";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #0B3D91 0, transparent 40%), radial-gradient(circle at 80% 60%, #D4AF37 0, transparent 40%)",
          }}
        />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.15fr_1fr] md:py-20 md:gap-16">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Free Knowledge Movement
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-primary sm:text-5xl md:text-6xl">
              Read Books Inspired by <span className="text-[color:var(--color-navy)]">Babasaheb’s Vision</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/80 md:text-lg">
              Welcome to <strong>Jai Bhim Knowledge Portal</strong> — a free online reading platform featuring
              original books written by <strong>Sushant Nikam</strong>, inspired by the life, thoughts, struggle,
              and mission of Dr. B. R. Ambedkar Ji.
            </p>
            <div className="mt-4 h-[3px] w-24 ashoka-divider" />
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/books"
                className="btn-cta inline-flex items-center gap-2 rounded-md px-6 py-3 text-base font-bold"
              >
                Start Reading Free <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 rounded-md border-2 border-primary bg-transparent px-6 py-3 text-base font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Explore Books
              </Link>
            </div>
            <p className="mt-6 text-sm font-semibold text-[color:var(--color-navy)]">
              Free Books for Education, Equality and Self-Respect.
            </p>
          </div>
          <div className="relative">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {featuredBooks.slice(0, 3).map((b, i) => (
                <div
                  key={b.slug}
                  className="transition-transform"
                  style={{
                    transform:
                      i === 0 ? "translateY(20px) rotate(-4deg)" : i === 2 ? "translateY(20px) rotate(4deg)" : "translateY(-8px)",
                  }}
                >
                  <Link to="/books/$slug" params={{ slug: b.slug }}>
                    <div
                      className="aspect-[3/4] w-full overflow-hidden rounded-lg shadow-[var(--shadow-elevated)] p-3 text-white"
                      style={{ background: b.coverGradient }}
                    >
                      <div className="h-[3px] w-10 bg-[color:var(--color-gold)]" />
                      <div
                        className="mt-6 text-sm font-extrabold leading-tight"
                        style={b.language !== "English" ? { fontFamily: "var(--font-devanagari)" } : undefined}
                      >
                        {b.title}
                      </div>
                      <div className="mt-6 text-[9px] uppercase tracking-widest text-white/80">
                        {b.author}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg bg-white/70 p-4 text-center text-sm text-foreground/80 shadow-[var(--shadow-card)] backdrop-blur">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Now Available</div>
              <div className="mt-1 font-bold text-foreground">{books.length} original books · 3 languages · 100% free</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeading eyebrow="Featured" title="Latest books by Sushant Nikam" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBooks.map((b) => (
            <BookCard key={b.slug} book={b} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white/60 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Browse" title="Read by category or language" />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/categories/$slug"
                params={{ slug: c.slug }}
                className="group rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground group-hover:text-primary">{c.name}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </Link>
            ))}
            {(["English", "Hindi", "Marathi"] as const).map((lang) => (
              <Link
                key={lang}
                to="/books"
                className="group rounded-lg border border-[color:var(--color-gold)]/50 bg-[color:var(--color-gold)]/10 p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[color:var(--color-navy)]">{lang}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Author Mission */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading eyebrow="Author Mission" title="Why this portal was created" alignLeft />
            <p className="mt-5 text-base leading-relaxed text-foreground/85">
              Books changed my life. Babasaheb’s books, most of all. But too many young readers in
              our villages, colleges, and small towns still cannot find these books — because of cost,
              because of language, because of distance.
            </p>
            <p className="mt-4 text-base leading-relaxed text-foreground/85">
              Jai Bhim Knowledge Portal is my small answer to that gap. Every book here is written by
              me, in simple English, Hindi, or Marathi, and offered for free online reading. No sign-up
              wall. No price tag. Just knowledge, placed carefully in your hands.
            </p>
            <p className="mt-4 font-semibold text-primary">— Sushant Nikam</p>
          </div>
          <div className="rounded-2xl bg-[color:var(--color-navy)] p-8 text-cream shadow-[var(--shadow-elevated)] md:p-10">
            <div className="text-[color:var(--color-gold)] text-5xl leading-none">“</div>
            <blockquote className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">
              Educate, Agitate, Organize.
            </blockquote>
            <p className="mt-4 text-sm text-cream/75">
              — Dr. B. R. Ambedkar Ji
            </p>
            <div className="mt-6 h-[2px] w-16 bg-[color:var(--color-gold)]" />
            <p className="mt-4 text-sm text-cream/85">
              These three words are the working principle of this portal. Read to educate yourself.
              Speak to agitate injustice. Come together to organize change.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Added */}
      <section className="bg-white/60 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Fresh Off the Press" title="Latest added books" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestBooks.slice(0, 3).map((b) => (
              <BookCard key={b.slug} book={b} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/books"
              className="inline-flex items-center gap-2 rounded-md border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground"
            >
              View all books <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reader Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeading eyebrow="Why Read Here" title="Made for every reader" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { Icon: BookOpen, title: "Free Reading", desc: "Every book, every chapter — always free to read online." },
            { Icon: GraduationCap, title: "Easy Language", desc: "Simple English, Hindi, and Marathi. No jargon." },
            { Icon: Smartphone, title: "Mobile Friendly", desc: "Optimised reader for phones, tablets, and desktops." },
            { Icon: Users, title: "Youth Focused", desc: "Written with students and first-generation readers in mind." },
            { Icon: HeartHandshake, title: "Knowledge for All", desc: "No login, no paywall, no gatekeeping. Ever." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="rounded-xl bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-bold text-foreground">{title}</div>
              <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-[color:var(--color-navy)] p-8 text-center text-cream shadow-[var(--shadow-elevated)] sm:p-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Start your free reading journey today.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-cream/80 sm:text-base">
            Open any book. Read online. Come back tomorrow. This library will always be here — free,
            respectful, and made for you.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/books" className="btn-cta rounded-md px-6 py-3 text-base font-bold">
              Start Reading Free
            </Link>
            <Link
              to="/about"
              className="rounded-md border-2 border-cream/80 px-6 py-3 text-base font-bold text-cream hover:bg-cream/10"
            >
              About the Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  alignLeft = false,
}: {
  eyebrow: string;
  title: string;
  alignLeft?: boolean;
}) {
  return (
    <div className={alignLeft ? "" : "text-center"}>
      <div className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-gold)]">
        {eyebrow}
      </div>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
        {title}
      </h2>
      <div className={`mt-3 h-[3px] w-16 ashoka-divider ${alignLeft ? "" : "mx-auto"}`} />
    </div>
  );
}
