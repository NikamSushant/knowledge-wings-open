import { BookOpen } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_2px_10px_rgba(11,61,145,0.35)]">
        <BookOpen className="h-5 w-5" strokeWidth={2.2} />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border-2 border-gold/70"
          style={{ boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.15)" }}
        />
      </div>
      <div className="min-w-0 leading-tight">
        <div className="text-[15px] font-extrabold tracking-tight text-primary">
          Jai Bhim
        </div>
        {!compact && (
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Knowledge Portal
          </div>
        )}
      </div>
    </div>
  );
}