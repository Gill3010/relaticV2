import type { ReactNode } from 'react';
import { X } from 'lucide-react';

type ChatShellProps = {
  children: ReactNode;
  onClose: () => void;
};

export function ChatShell({ children, onClose }: ChatShellProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 text-slate-50 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(253,224,71,0.08),_transparent_45%)]"
      />

      <header className="relative z-10 flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/logo.png"
            alt="Relatic Panamá"
            className="h-10 w-10 flex-shrink-0 rounded-full object-contain ring-1 ring-white/15"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">
              RELATIC <span className="text-cta">PANAMÁ</span>
            </p>
            <p className="truncate text-xs text-slate-400">Asistente de documentos</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar asistente"
          className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-cta"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col p-4">{children}</main>

      <footer className="relative z-10 border-t border-white/10 px-4 py-2.5 text-center text-[11px] text-slate-500">
        Nombre obligatorio · cédula opcional · registro no obligatorio
      </footer>
    </div>
  );
}
