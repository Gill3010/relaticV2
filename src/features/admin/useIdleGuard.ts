import { useCallback, useEffect, useRef, useState } from 'react';
import { adminSession } from './adminApi';

const IDLE_MS = 30 * 60 * 1000;
const WARN_MS = 2 * 60 * 1000;
const HEARTBEAT_MS = 5 * 60 * 1000;

type UseIdleGuardOpts = {
  enabled: boolean;
  onIdle: () => void;
};

export function useIdleGuard({ enabled, onIdle }: UseIdleGuardOpts) {
  const [warning, setWarning] = useState(false);
  const lastActivity = useRef(Date.now());
  const lastBeat = useRef(Date.now());
  const idleFired = useRef(false);
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  const stay = useCallback(() => {
    lastActivity.current = Date.now();
    lastBeat.current = Date.now();
    idleFired.current = false;
    setWarning(false);
    void adminSession().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setWarning(false);
      idleFired.current = false;
      return;
    }

    lastActivity.current = Date.now();
    lastBeat.current = Date.now();
    idleFired.current = false;

    function markActivity() {
      lastActivity.current = Date.now();
      setWarning(false);
      if (Date.now() - lastBeat.current >= HEARTBEAT_MS) {
        lastBeat.current = Date.now();
        void adminSession().catch(() => undefined);
      }
    }

    window.addEventListener('pointerdown', markActivity);
    window.addEventListener('keydown', markActivity);
    window.addEventListener('scroll', markActivity, true);

    const timer = window.setInterval(() => {
      const idleFor = Date.now() - lastActivity.current;
      if (idleFor >= IDLE_MS) {
        if (!idleFired.current) {
          idleFired.current = true;
          setWarning(false);
          onIdleRef.current();
        }
      } else if (idleFor >= IDLE_MS - WARN_MS) {
        setWarning(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener('pointerdown', markActivity);
      window.removeEventListener('keydown', markActivity);
      window.removeEventListener('scroll', markActivity, true);
      window.clearInterval(timer);
    };
  }, [enabled]);

  return { warning, stay };
}
