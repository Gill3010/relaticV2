import { useEffect, useState } from 'react';
import { listActividad } from './adminApi';
import { adminErrorMessage, isSessionError } from './adminErrors';
import type { AdminAuditItem } from './types';
import { Alert, Spinner } from './AdminUI';

type ActividadListProps = {
  refreshKey: number;
  onSessionExpired?: () => void;
};

const actionLabels: Record<string, string> = {
  create: 'Creó',
  update: 'Editó',
  delete: 'Envió a papelera',
  restore: 'Restauró',
  purge: 'Borró de la papelera',
  password: 'Cambió la clave',
};

function formatWhen(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('es-PA', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export function ActividadList({ refreshKey, onSessionExpired }: ActividadListProps) {
  const [items, setItems] = useState<AdminAuditItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listActividad()
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
          setError(adminErrorMessage(err, 'No se pudo cargar la actividad.'));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey, onSessionExpired]);

  return (
    <div className="space-y-4">
      {error ? <Alert tone="error">{error}</Alert> : null}
      {loading ? (
        <p className="inline-flex items-center gap-2 text-sm text-slate-400">
          <Spinner className="text-slate-400" />
          Cargando…
        </p>
      ) : (
        <p className="text-sm text-slate-400">
          Últimas {items.length} acciones. Solo el equipo de Relatic ve esto.
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
        <div className="max-h-[68vh] divide-y divide-white/5 overflow-y-auto">
          {!loading && !items.length ? (
            <p className="px-5 py-10 text-center text-sm text-slate-400">
              Aún no hay actividad registrada.
            </p>
          ) : null}
          {items.map((item) => (
            <div key={item.id} className="px-5 py-4">
              <p className="text-sm font-semibold text-white">
                {actionLabels[item.action] || item.action}{' '}
                {item.nombre_completo ? (
                  <span className="font-medium text-slate-200">{item.nombre_completo}</span>
                ) : null}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {item.username} · {formatWhen(item.created_at)}
                {item.cedula ? ` · ${item.cedula}` : ''}
                {item.source ? ` · ${item.source}` : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
