import { useState, type FormEvent } from 'react';
import { createCarta } from './adminApi';

type CartaFormProps = {
  onCreated: () => void;
};

export function CartaForm({ onCreated }: CartaFormProps) {
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [nivel, setNivel] = useState<'maestria' | 'doctorado' | ''>('');
  const [titulo, setTitulo] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
    if (!archivo) {
      setError('Adjunta el PDF de la carta.');
      return;
    }

    const form = new FormData();
    form.set('nombre_completo', nombre.trim());
    form.set('cedula', cedula.trim());
    form.set('nivel', nivel);
    form.set('titulo', titulo.trim());
    form.set('archivo', archivo);

    setLoading(true);
    try {
      const data = await createCarta(form);
      setSuccess(data.message || 'Carta registrada.');
      setNombre('');
      setCedula('');
      setNivel('');
      setTitulo('');
      setArchivo(null);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la carta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <label className="block" htmlFor="carta-nombre">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Nombre completo</span>
        <input
          id="carta-nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
        />
      </label>
      <label className="block" htmlFor="carta-cedula">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Cédula</span>
        <input
          id="carta-cedula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
        />
      </label>
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-slate-700">Nivel académico</legend>
        <div className="flex gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-slate-800">
            <input
              type="radio"
              name="nivel"
              checked={nivel === 'maestria'}
              onChange={() => setNivel('maestria')}
            />
            Maestría
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-800">
            <input
              type="radio"
              name="nivel"
              checked={nivel === 'doctorado'}
              onChange={() => setNivel('doctorado')}
            />
            Doctorado
          </label>
        </div>
      </fieldset>
      <label className="block" htmlFor="carta-titulo">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Título obtenido</span>
        <input
          id="carta-titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
        />
      </label>
      <label className="block" htmlFor="carta-pdf">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">PDF de la carta</span>
        <input
          id="carta-pdf"
          type="file"
          accept="application/pdf,.pdf"
          onChange={(e) => setArchivo(e.target.files?.[0] || null)}
          className="w-full text-sm text-slate-700"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? 'Guardando…' : 'Guardar carta'}
      </button>
    </form>
  );
}
