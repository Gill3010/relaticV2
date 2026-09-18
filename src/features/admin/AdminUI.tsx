import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/* ── Tokens compartidos del panel (misma familia visual que la landing) ──── */

export const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-cta/60 focus:bg-white/10 focus:ring-2 focus:ring-cta/20';

export const ctaButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-full bg-cta px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-cta/20 transition-all hover:bg-yellow-400 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-60';

export const ghostButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/20 hover:text-cta';

export const iconActionClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105 active:scale-95';

export const cardClass =
  'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg';

/* ── Marca ───────────────────────────────────────────────────────────────── */

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Relatic Panamá"
        className={cn('object-contain flex-shrink-0', compact ? 'h-10 w-10' : 'h-14 w-14')}
      />
      <span className="flex flex-col">
        <span
          className={cn(
            'font-black leading-none tracking-tighter text-white',
            compact ? 'text-xl' : 'text-2xl',
          )}
        >
          RELATIC <span className="text-cta">PANAMÁ</span>
        </span>
        <span
          className={cn(
            'mt-1 text-[0.6rem] font-bold uppercase leading-tight tracking-widest text-slate-400',
            compact ? 'hidden sm:block' : 'block',
          )}
        >
          Panel de cartas
        </span>
      </span>
    </span>
  );
}

/* ── Campos de formulario ────────────────────────────────────────────────── */

type FieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, hint, children }: FieldProps) {
  return (
    <div className="block">
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

/* ── Chip de nivel académico ─────────────────────────────────────────────── */

const nivelStyles: Record<string, string> = {
  doctorado: 'border-cta/30 bg-cta/10 text-cta',
  maestria: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
};

export function NivelChip({ nivel }: { nivel: string }) {
  const key = String(nivel).toLowerCase();
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider',
        nivelStyles[key] || 'border-white/15 bg-white/5 text-slate-300',
      )}
    >
      {key === 'maestria' ? 'Maestría' : key === 'doctorado' ? 'Doctorado' : nivel}
    </span>
  );
}

/* ── Mensajes de estado ──────────────────────────────────────────────────── */

const alertStyles = {
  error: 'border-red-400/30 bg-red-400/10 text-red-200',
  success: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  info: 'border-sky-400/30 bg-sky-400/10 text-sky-100',
} as const;

export function Alert({
  tone,
  children,
}: {
  tone: keyof typeof alertStyles;
  children: ReactNode;
}) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('rounded-xl border px-4 py-2.5 text-sm', alertStyles[tone])}
    >
      {children}
    </p>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent',
        className,
      )}
    />
  );
}
