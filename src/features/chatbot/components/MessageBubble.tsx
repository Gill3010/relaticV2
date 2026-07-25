import type { ReactNode } from 'react';

type MessageBubbleProps = {
  role?: 'bot' | 'user';
  children: ReactNode;
};

export function MessageBubble({ role = 'bot', children }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`animate-message-in flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-cyan-400/15 text-slate-100 ring-1 ring-cyan-400/30'
            : 'bg-white/5 text-slate-100 ring-1 ring-white/10 backdrop-blur-sm'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
