import { useState, type FormEvent } from 'react';
import type { IdentityPayload } from '../types';

type IdentityFormProps = {
  initialName?: string;
  initialCedula?: string;
  submitLabel?: string;
  helperText?: string;
  loading?: boolean;
  onSubmit: (data: IdentityPayload) => void;
};

export function IdentityForm({
  initialName = '',
  initialCedula = '',
  submitLabel = 'Continuar',
  helperText,
  loading = false,
  onSubmit,
}: IdentityFormProps) {
  const [nombre, setNombre] = useState(initialName);
  const [cedula, setCedula] = useState(initialCedula);
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nombre_completo = nombre.trim();
    if (nombre_completo.length < 3) {
      setError('Ingresa tu nombre completo (mínimo 3 caracteres).');
      return;
    }
    if (cedula.trim() && !/^[0-9A-Za-z\- ]+$/.test(cedula.trim())) {
      setError('La cédula solo puede incluir letras, números, guiones y espacios.');
      return;
    }
    setError('');
    onSubmit({
      nombre_completo,
      cedula: cedula.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3" noValidate>
      {helperText ? (
        <p id="identity-helper" className="text-xs leading-relaxed text-slate-300/90">
          {helperText}
        </p>
      ) : null}

      <label className="block" htmlFor="chat-nombre">
        <span className="mb-1.5 block text-xs font-medium tracking-wide text-slate-300">
          Nombre completo <span className="text-cta">*</span>
        </span>
        <input
          id="chat-nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoComplete="name"
          disabled={loading}
          required
          aria-required="true"
          aria-invalid={Boolean(error)}
          aria-describedby={helperText ? 'identity-helper' : undefined}
          placeholder="Ej. Ana Pérez Gómez"
          className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60"
        />
      </label>

      <label className="block" htmlFor="chat-cedula">
        <span className="mb-1.5 block text-xs font-medium tracking-wide text-slate-300">
          Cédula <span className="font-normal text-slate-500">(opcional)</span>
        </span>
        <input
          id="chat-cedula"
          type="text"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          autoComplete="off"
          disabled={loading}
          placeholder="Ej. 8-123-456"
          className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60"
        />
      </label>

      {error ? (
        <p id="identity-error" role="alert" className="text-xs text-amber-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-cta px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Procesando…' : submitLabel}
      </button>
    </form>
  );
}
