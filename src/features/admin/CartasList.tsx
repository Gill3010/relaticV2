import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Eye, Pencil, RotateCcw, Search, Trash2 } from 'lucide-react';
import { cartaDownloadUrl, listCartas } from './adminApi';
import type { AdminCarta } from './types';
import { adminErrorMessage, isSessionError } from './adminErrors';
import { Alert, iconActionClass, NivelChip, Spinner } from './AdminUI';
import { CartaPreview } from './CartaPreview';
import { cn } from '../../lib/cn';

type CartasListProps = {
  refreshKey: number;
  papelera?: boolean;
  onEdit: (carta: AdminCarta) => void;
  onDelete: (carta: AdminCarta) => void;
  onRestore?: (carta: AdminCarta) => void;
  onSessionExpired?: () => void;
};

/** Filas por página del listado. Sube o baja este número si hace falta. */
const PAGE_SIZE = 25;

const filtros = [
  { value: '', label: 'Todas' },
  { value: 'maestria', label: 'Maestría' },
  { value: 'doctorado', label: 'Doctorado' },
] as const;

function pageWindow(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const set = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: Array<number | 'ellipsis'> = [];
  for (const n of sorted) {
    const prev = out[out.length - 1];
    if (typeof prev === 'number' && n - prev > 1) out.push('ellipsis');
    out.push(n);
  }
  return out;
}

function formatFecha(value: string | null | undefined) {
  if (!value) return '—';
  return String(value).slice(0, 10);
}

export function CartasList({
  refreshKey,
  papelera = false,
  onEdit,
  onDelete,
  onRestore,
  onSessionExpired,
}: CartasListProps) {
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [nivel, setNivel] = useState<string>('');
  const [items, setItems] = useState<AdminCarta[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<AdminCarta | null>(null);
  const [page, setPage] = useState(1);
  const listTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQ(q), 400);
    return () => window.clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listCartas(debouncedQ, { papelera })
      .then((data) => {
        if (!cancelled) {
          setItems(data.items || []);
          setError('');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (isSessionError(err)) {
            onSessionExpired?.();
            return;
          }
          setError(adminErrorMessage(err, 'No se pudo cargar el listado.'));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQ, refreshKey, papelera]);

  const visibles = useMemo(
    () => (nivel ? items.filter((item) => item.source === nivel) : items),
    [items, nivel],
  );

  const totalPages = Math.max(1, Math.ceil(visibles.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return visibles.slice(start, start + PAGE_SIZE);
  }, [visibles, currentPage]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ, nivel, papelera, refreshKey]);

  function goToPage(next: number) {
    const clamped = Math.min(Math.max(1, next), totalPages);
    setPage(clamped);
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const conteos = useMemo(
    () => ({
      '': items.length,
      maestria: items.filter((item) => item.source === 'maestria').length,
      doctorado: items.filter((item) => item.source === 'doctorado').length,
    }),
    [items],
  );

  return (
    <div className="space-y-4">
      {/* Buscador + filtros */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label htmlFor="cartas-busqueda" className="relative block w-full lg:max-w-sm">
          <span className="sr-only">Buscar por cédula o nombre</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="cartas-busqueda"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por cédula o nombre…"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-cta/60 focus:bg-white/10 focus:ring-2 focus:ring-cta/20"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {filtros.map((filtro) => (
            <button
              key={filtro.value || 'todas'}
              type="button"
              aria-pressed={nivel === filtro.value}
              onClick={() => setNivel(filtro.value)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all',
                nivel === filtro.value
                  ? 'border-cta bg-cta text-slate-900 shadow-lg shadow-cta/20'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:text-cta',
              )}
            >
              {filtro.label}
              <span
                className={cn(
                  'rounded-md px-1.5 py-0.5 text-[0.65rem] font-bold',
                  nivel === filtro.value ? 'bg-slate-900/10 text-slate-900' : 'bg-white/10 text-slate-400',
                )}
              >
                {conteos[filtro.value as keyof typeof conteos]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {error ? <Alert tone="error">{error}</Alert> : null}

      <p className="text-sm text-slate-400">
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="text-slate-400" />
            Cargando…
          </span>
        ) : (
          <>
            <span className="font-semibold text-white">{visibles.length}</span>{' '}
            {visibles.length === 1 ? 'registro' : 'registros'}
            {debouncedQ || nivel ? ' (filtro aplicado)' : ''}
            {visibles.length > PAGE_SIZE
              ? ` · mostrando ${(currentPage - 1) * PAGE_SIZE + 1 }–${Math.min(currentPage * PAGE_SIZE, visibles.length)}`
              : ''}
          </>
        )}
      </p>

      {/* Tabla densa */}
      <div
        ref={listTopRef}
        className="scroll-mt-28 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg"
      >
        <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,2.5fr)_auto] gap-4 border-b border-white/10 bg-white/5 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 lg:grid">
          <span>Nombre</span>
          <span>Cédula</span>
          <span>Título obtenido</span>
          <span>Carta</span>
        </div>

        <div className="divide-y divide-white/5">
          {!loading && !visibles.length ? (
            <p className="px-5 py-10 text-center text-sm text-slate-400">
              {papelera
                ? 'La papelera está vacía. Las cartas eliminadas aparecen aquí durante 30 días.'
                : 'No hay cartas para mostrar.'}
            </p>
          ) : null}

          {pageItems.map((item) => (
            <div
              key={`${item.source}-${item.document_id}`}
              className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-white/5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,2.5fr)_auto] lg:items-center lg:gap-4"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{item.nombre_completo}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <NivelChip nivel={item.source} />
                  <span className="text-xs text-slate-500">{formatFecha(item.fecha)}</span>
                  {papelera && item.days_left != null ? (
                    <span className="text-xs text-amber-300">
                      {item.days_left === 1
                        ? 'Queda 1 día'
                        : `Quedan ${item.days_left} días`}
                    </span>
                  ) : null}
                </div>
              </div>

              <p className="text-sm text-slate-300 lg:truncate">
                <span className="text-slate-500 lg:hidden">Cédula: </span>
                {item.cedula || 'sin cédula'}
              </p>

              <p className="text-sm text-slate-300 lg:truncate" title={item.titulo}>
                {item.titulo}
              </p>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                {item.has_file !== false ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setPreview(item)}
                      title="Vista previa"
                      aria-label={`Ver PDF de ${item.nombre_completo}`}
                      className={`${iconActionClass} bg-cta text-slate-900 shadow-cta/25 hover:bg-yellow-400`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <a
                      href={cartaDownloadUrl(item.source, item.document_id)}
                      title="Descargar"
                      aria-label={`Descargar PDF de ${item.nombre_completo}`}
                      className={`${iconActionClass} bg-emerald-500 shadow-emerald-500/25 hover:bg-emerald-400`}
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-2 text-xs font-medium text-slate-500">
                    Sin PDF
                  </span>
                )}
                {papelera ? (
                  <button
                    type="button"
                    onClick={() => onRestore?.(item)}
                    title="Restaurar"
                    aria-label={`Restaurar carta de ${item.nombre_completo}`}
                    className={`${iconActionClass} bg-emerald-500 shadow-emerald-500/25 hover:bg-emerald-400`}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      title="Editar"
                      aria-label={`Editar carta de ${item.nombre_completo}`}
                      className={`${iconActionClass} bg-sky-500 shadow-sky-500/25 hover:bg-sky-400`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      title="Eliminar"
                      aria-label={`Eliminar carta de ${item.nombre_completo}`}
                      className={`${iconActionClass} bg-red-500 shadow-red-500/25 hover:bg-red-400`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!loading && visibles.length > PAGE_SIZE ? (
        <nav
          aria-label="Paginación de cartas"
          className="flex flex-col items-center justify-between gap-3 sm:flex-row"
        >
          <p className="text-xs text-slate-500">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="Página anterior"
              className="inline-flex h-9 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 text-sm font-medium text-slate-200 transition-colors hover:border-white/25 hover:text-cta disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            {pageWindow(currentPage, totalPages).map((item, index) =>
              item === 'ellipsis' ? (
                <span key={`e-${index}`} className="px-1 text-sm text-slate-500">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => goToPage(item)}
                  aria-label={`Ir a la página ${item}`}
                  aria-current={item === currentPage ? 'page' : undefined}
                  className={cn(
                    'inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-sm font-medium transition-all',
                    item === currentPage
                      ? 'border-cta bg-cta text-slate-900 shadow-lg shadow-cta/20'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/25 hover:text-cta',
                  )}
                >
                  {item}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-label="Página siguiente"
              className="inline-flex h-9 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 text-sm font-medium text-slate-200 transition-colors hover:border-white/25 hover:text-cta disabled:pointer-events-none disabled:opacity-40"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </nav>
      ) : null}

      {preview ? (
        <CartaPreview
          carta={preview}
          onClose={() => setPreview(null)}
          onSessionExpired={onSessionExpired}
        />
      ) : null}
    </div>
  );
}
