import { useEffect, useState } from 'react';
import { cartaDownloadUrl, listCartas } from './adminApi';
import type { AdminCarta } from './types';

type CartasListProps = {
  refreshKey: number;
};

function formatFecha(value: string | null | undefined) {
  if (!value) return '—';
  return String(value).slice(0, 10);
}

export function CartasList({ refreshKey }: CartasListProps) {
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [items, setItems] = useState<AdminCarta[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQ(q), 400);
    return () => window.clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listCartas(debouncedQ)
      .then((data) => {
        if (!cancelled) {
          setItems(data.items || []);
          setError('');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'No se pudo cargar el listado.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQ, refreshKey]);

  return (
    <div className="space-y-3">
      <label className="block" htmlFor="cartas-busqueda">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Buscar por cédula o nombre</span>
        <input
          id="cartas-busqueda"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Cargando…</p> : null}
      {!loading ? (
        <p className="text-sm text-slate-600">
          {items.length === 1 ? '1 registro' : `${items.length} registros`}
          {debouncedQ ? ' (filtro aplicado)' : ''}
        </p>
      ) : null}
      {!loading && !items.length ? (
        <p className="text-sm text-slate-500">No hay cartas para mostrar.</p>
      ) : null}
      <ul className="max-h-[70vh] divide-y divide-slate-200 overflow-y-auto rounded-lg border border-slate-200 bg-white">
        {items.map((item) => (
          <li key={`${item.source}-${item.document_id}`} className="px-3 py-3">
            <p className="font-medium text-slate-900">{item.nombre_completo}</p>
            <p className="text-sm text-slate-600">
              {item.cedula || 'sin cédula'} · {item.source} · {formatFecha(item.fecha)}
            </p>
            <p className="text-sm text-slate-700">{item.titulo}</p>
            {item.has_file !== false ? (
              <a
                href={cartaDownloadUrl(item.source, item.document_id)}
                className="mt-1 inline-block text-sm font-medium text-slate-800 underline"
              >
                Descargar carta
              </a>
            ) : (
              <p className="mt-1 text-sm text-slate-500">Sin PDF asociado</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
