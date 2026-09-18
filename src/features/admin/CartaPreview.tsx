import { useEffect, useState } from 'react';
import { Download, ExternalLink, X } from 'lucide-react';
import { cartaDownloadUrl, fetchCartaPdfObjectUrl } from './adminApi';
import { adminErrorMessage, isCartaGoneError, isSessionError } from './adminErrors';
import type { AdminCarta } from './types';
import { Spinner } from './AdminUI';

type CartaPreviewProps = {
  carta: AdminCarta;
  onClose: () => void;
  onSessionExpired?: () => void;
};

export function CartaPreview({ carta, onClose, onSessionExpired }: CartaPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    setPdfUrl(null);

    fetchCartaPdfObjectUrl(carta.source, carta.document_id)
      .then((url) => {
        if (!cancelled) {
          setPdfUrl(url);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (isSessionError(err)) {
          onSessionExpired?.();
          return;
        }
        setError(
          isCartaGoneError(err)
            ? 'Esta carta ya no está o no tiene PDF.'
            : adminErrorMessage(err, 'No se pudo abrir el PDF.'),
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [carta.document_id, carta.source, onSessionExpired]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Vista previa: ${carta.nombre_completo}`}
        className="flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-white">{carta.nombre_completo}</h2>
            <p className="truncate text-xs text-slate-400">{carta.titulo}</p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <a
              href={cartaDownloadUrl(carta.source, carta.document_id)}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir PDF"
              aria-label={`Abrir PDF de ${carta.nombre_completo}`}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:border-white/20 hover:text-cta"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={cartaDownloadUrl(carta.source, carta.document_id)}
              download
              title="Descargar"
              aria-label={`Descargar PDF de ${carta.nombre_completo}`}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:border-white/20 hover:text-cta"
            >
              <Download className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar vista previa"
              className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:border-white/20 hover:text-cta"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 bg-slate-950">
          {loading ? (
            <div className="flex h-full items-center justify-center gap-3 text-sm text-slate-400">
              <Spinner className="text-cta" />
              Cargando PDF…
            </div>
          ) : null}
          {error ? (
            <p className="p-6 text-center text-sm text-red-300" role="alert">
              {error}
            </p>
          ) : null}
          {pdfUrl ? (
            <iframe
              title={`PDF de ${carta.nombre_completo}`}
              src={pdfUrl}
              className="h-full w-full border-0 bg-white"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
