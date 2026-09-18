import { useRef, useState, type DragEvent, type FormEvent } from 'react';
import { FileText, UploadCloud } from 'lucide-react';
import { createCarta, updateCarta } from './adminApi';
import { adminErrorMessage, isCartaGoneError, isSessionError } from './adminErrors';
import { validateCartaPdf } from './pdfValidation';
import type { AdminCarta } from './types';
import { Alert, ctaButtonClass, Field, inputClass, Spinner } from './AdminUI';
import { cn } from '../../lib/cn';

type CartaFormProps = {
  carta?: AdminCarta | null;
  onSaved: () => void;
  onCartaGone?: () => void;
  onSessionExpired?: () => void;
};

const niveles = [
  { value: 'maestria', label: 'Maestría' },
  { value: 'doctorado', label: 'Doctorado' },
] as const;

export function CartaForm({ carta, onSaved, onCartaGone, onSessionExpired }: CartaFormProps) {
  const isEdit = Boolean(carta);
  const [nombre, setNombre] = useState(carta?.nombre_completo || '');
  const [cedula, setCedula] = useState(carta?.cedula || '');
  const [nivel, setNivel] = useState<'maestria' | 'doctorado' | ''>(carta?.source || '');
  const [titulo, setTitulo] = useState(carta?.titulo || '');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function clearFileInput() {
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function applyFile(file: File | undefined) {
    if (!file) {
      setArchivo(null);
      return;
    }
    const problem = await validateCartaPdf(file);
    if (problem) {
      setArchivo(null);
      clearFileInput();
      setSuccess('');
      setError(problem);
      return;
    }
    setError('');
    setArchivo(file);
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    void applyFile(e.dataTransfer.files?.[0]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (nombre.trim().length < 3) {
      setError('Ingresa el nombre completo.');
      return;
    }
    if (!cedula.trim() || !/\d/.test(cedula)) {
      setError('Ingresa la cédula (debe incluir un número).');
      return;
    }
    if (!nivel) {
      setError('Selecciona maestría o doctorado.');
      return;
    }
    if (titulo.trim().length < 3) {
      setError('Ingresa el título obtenido.');
      return;
    }
    if (!isEdit && !archivo) {
      setError('Adjunta el PDF de la carta.');
      return;
    }
    if (archivo) {
      const problem = await validateCartaPdf(archivo);
      if (problem) {
        setArchivo(null);
        clearFileInput();
        setError(problem);
        return;
      }
    }

    const form = new FormData();
    form.set('nombre_completo', nombre.trim());
    form.set('cedula', cedula.trim());
    form.set('nivel', nivel);
    form.set('titulo', titulo.trim());
    if (archivo) form.set('archivo', archivo);

    setLoading(true);
    try {
      const data =
        isEdit && carta
          ? await updateCarta(carta.source, carta.document_id, form)
          : await createCarta(form);
      setSuccess(data.message || (isEdit ? 'Carta actualizada.' : 'Carta registrada.'));
      if (!isEdit) {
        setNombre('');
        setCedula('');
        setNivel('');
        setTitulo('');
        setArchivo(null);
        clearFileInput();
      }
      onSaved();
    } catch (err) {
      if (isSessionError(err)) {
        onSessionExpired?.();
        return;
      }
      if (isCartaGoneError(err)) {
        onCartaGone?.();
        return;
      }
      setError(adminErrorMessage(err, 'No se pudo guardar la carta.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label="Nombre completo" htmlFor="carta-nombre">
        <input
          id="carta-nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Cédula" htmlFor="carta-cedula">
        <input
          id="carta-cedula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          className={inputClass}
        />
      </Field>

      <fieldset>
        <legend className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
          Nivel académico
        </legend>
        {isEdit ? (
          <p className="mb-2 text-xs text-slate-500">
            El nivel no se cambia al editar. Si quedó mal, elimina la carta y créala de nuevo.
          </p>
        ) : null}
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {niveles.map((option) => (
            <label
              key={option.value}
              className={cn(
                'inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium transition-colors',
                nivel === option.value ? 'text-cta' : 'text-slate-300 hover:text-white',
              )}
            >
              <input
                type="radio"
                name="nivel"
                checked={nivel === option.value}
                onChange={() => setNivel(option.value)}
                disabled={isEdit}
                className="h-4 w-4 cursor-pointer accent-cta disabled:cursor-not-allowed"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Título obtenido" htmlFor="carta-titulo">
        <input
          id="carta-titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className={inputClass}
        />
      </Field>

      <div>
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">
          PDF de la carta
        </span>
        <label
          htmlFor="carta-pdf"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-8 text-center transition-colors',
            dragging
              ? 'border-cta bg-cta/10'
              : archivo
                ? 'border-cta/40 bg-cta/5'
                : error.toLowerCase().includes('pdf') ||
                    error.toLowerCase().includes('archivo') ||
                    error.toLowerCase().includes('imagen') ||
                    error.toLowerCase().includes('word')
                  ? 'border-red-400/50 bg-red-400/5'
                  : 'border-white/15 bg-white/5 hover:border-white/30',
          )}
        >
          {archivo ? (
            <>
              <FileText className="h-6 w-6 text-cta" />
              <span className="text-sm font-medium text-white">{archivo.name}</span>
              <span className="text-xs text-slate-400">Clic para reemplazar el archivo</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-6 w-6 text-slate-400" />
              <span className="text-sm font-medium text-white">
                Arrastra el PDF o <span className="text-cta">búscalo</span>
              </span>
              <span className="text-xs text-slate-400">
                {isEdit
                  ? 'Opcional: el PDF actual se mantiene si no subes otro'
                  : 'Solo PDF, máximo 10 MB'}
              </span>
            </>
          )}
          <input
            id="carta-pdf"
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => {
              void applyFile(e.target.files?.[0]);
            }}
            className="sr-only"
          />
        </label>
      </div>

      {error ? <Alert tone="error">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}

      <button type="submit" disabled={loading} className={`${ctaButtonClass} w-full`}>
        {loading ? (
          <>
            <Spinner />
            Guardando…
          </>
        ) : isEdit ? (
          'Guardar cambios'
        ) : (
          'Guardar carta'
        )}
      </button>
    </form>
  );
}
