import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import {
  ToastContext,
  type ToastVariant,
  type ToastItem,
} from '../../hooks/useToast';

/* Ícones por variante */
const icons: Record<ToastVariant, ReactNode> = {
  success: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 20'
      fill='currentColor'
      className='h-5 w-5'
    >
      <path
        fillRule='evenodd'
        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z'
        clipRule='evenodd'
      />
    </svg>
  ),
  error: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 20'
      fill='currentColor'
      className='h-5 w-5'
    >
      <path
        fillRule='evenodd'
        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
        clipRule='evenodd'
      />
    </svg>
  ),
  warning: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 20'
      fill='currentColor'
      className='h-5 w-5'
    >
      <path
        fillRule='evenodd'
        d='M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z'
        clipRule='evenodd'
      />
    </svg>
  ),
  info: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 20'
      fill='currentColor'
      className='h-5 w-5'
    >
      <path
        fillRule='evenodd'
        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z'
        clipRule='evenodd'
      />
    </svg>
  ),
};

/* Estilos por variante — fundo escuro para bom contraste */
const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-gray-900/50 border-emerald-500/50 text-emerald-400',
  error: 'bg-gray-900/80 border-red-500/50 text-red-400',
  warning: 'bg-gray-900/50 border-amber-500/50 text-amber-400',
  info: 'bg-gray-900/50 border-blue-500/50 text-blue-400',
};

/* Item individual do Toast */
function ToastItemView({
  toast: t,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(t.id), 300);
  }, [onDismiss, t.id]);

  useEffect(() => {
    timerRef.current = setTimeout(dismiss, t.duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dismiss, t.duration]);

  return (
    <div
      role='alert'
      onClick={dismiss}
      className={`
        flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3
        shadow-lg shadow-black/40 backdrop-blur-md
        transition-all duration-300 ease-out
        ${variantStyles[t.variant]}
        ${exiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      <span className='shrink-0'>{icons[t.variant]}</span>
      <p className='text-sm font-medium leading-snug'>{t.message}</p>
    </div>
  );
}

/* Provider */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 4000) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, variant, duration }]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* Container dos toasts — canto superior direito */}
      <div
        aria-live='polite'
        className='pointer-events-none fixed top-4 right-4 z-9999 flex flex-col items-end gap-2'
      >
        {toasts.map((t) => (
          <div key={t.id} className='pointer-events-auto'>
            <ToastItemView toast={t} onDismiss={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
