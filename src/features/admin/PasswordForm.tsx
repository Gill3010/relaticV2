import { useState, type FormEvent } from 'react';
import { changeAdminPassword } from './adminApi';
import { adminErrorMessage, isSessionError } from './adminErrors';
import { Alert, ctaButtonClass, Field, inputClass, Spinner } from './AdminUI';

type PasswordFormProps = {
  onDone: () => void;
  onSessionExpired?: () => void;
};

export function PasswordForm({ onDone, onSessionExpired }: PasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword.length < 10) {
      setError('La nueva clave debe tener al menos 10 caracteres.');
      return;
    }
    if (newPassword !== confirm) {
      setError('La confirmación no coincide.');
      return;
    }
    setLoading(true);
    try {
      const data = await changeAdminPassword(currentPassword, newPassword);
      setSuccess(data.message || 'Clave actualizada.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirm('');
      window.setTimeout(onDone, 1200);
    } catch (err) {
      if (isSessionError(err)) {
        onSessionExpired?.();
        return;
      }
      setError(adminErrorMessage(err, 'No se pudo cambiar la clave.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label="Clave actual" htmlFor="admin-pass-actual">
        <input
          id="admin-pass-actual"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Clave nueva" htmlFor="admin-pass-nueva" hint="Mínimo 10 caracteres.">
        <input
          id="admin-pass-nueva"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Repite la clave nueva" htmlFor="admin-pass-confirm">
        <input
          id="admin-pass-confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
        />
      </Field>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      <button type="submit" disabled={loading} className={`${ctaButtonClass} w-full`}>
        {loading ? (
          <>
            <Spinner />
            Guardando…
          </>
        ) : (
          'Cambiar clave'
        )}
      </button>
      <button
        type="button"
        onClick={onDone}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/20 hover:text-cta disabled:opacity-60"
      >
        Volver a las cartas
      </button>
    </form>
  );
}
