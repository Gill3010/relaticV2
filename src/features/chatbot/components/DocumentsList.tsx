import type { ChatDocument } from '../types';

function formatDate(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('es-PA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function tipoLabel(tipo?: string) {
  if (!tipo) return 'Documento';
  if (tipo === 'publicacion') return 'Publicación';
  if (tipo === 'carta_aceptacion') return 'Carta de aceptación';
  return tipo;
}

type DocumentsListProps = {
  documents?: ChatDocument[];
};

export function DocumentsList({ documents = [] }: DocumentsListProps) {
  if (!documents.length) return null;

  return (
    <ul className="mt-3 space-y-2">
      {documents.map((doc) => {
        const fecha = formatDate(doc.fecha);
        const viewUrl = doc.external_url?.trim() || null;
        const downloadUrl = doc.download_url?.trim() || null;

        return (
          <li
            key={doc.id}
            className="rounded-xl border border-white/10 bg-slate-900/40 px-3.5 py-3"
          >
            <div className="flex flex-col gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-cyan-400/90">
                  {tipoLabel(doc.tipo)}
                </p>
                <p className="mt-0.5 text-sm font-medium text-slate-50">{doc.titulo}</p>
                {fecha ? <p className="mt-0.5 text-xs text-slate-400">{fecha}</p> : null}
                {viewUrl ? (
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    Su artículo ya fue publicado. Puede consultarlo con el botón{' '}
                    <span className="font-semibold text-slate-100">Ver publicación</span>.
                  </p>
                ) : null}
              </div>
              {viewUrl ? (
                <a
                  href={viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-cta px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-yellow-400"
                >
                  Ver publicación
                </a>
              ) : null}
              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  download={`${(doc.titulo || `documento-${doc.id}`).replace(/[/\\?%*:|"<>]/g, '-').trim() || `documento-${doc.id}`}.pdf`}
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-cta px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-yellow-400"
                >
                  Descargar
                </a>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
