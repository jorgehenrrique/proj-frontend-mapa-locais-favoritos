import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { ConfirmContext, type ConfirmOptions } from '../../hooks/useConfirm';
import { Button } from './Button';

/* Card de confirmação */
function ConfirmCard({
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmOptions & {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [exiting, setExiting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleAction = useCallback(
    (confirmed: boolean) => {
      setExiting(true);
      setTimeout(() => (confirmed ? onConfirm() : onCancel()), 200);
    },
    [onConfirm, onCancel],
  );

  /* Fechar com ESC */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleAction(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleAction]);

  /* Focus trap — manter foco dentro do card */
  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  return (
    /* Overlay */
    <div
      className={`
        fixed inset-0 z-9999 flex items-center justify-center
        transition-opacity duration-200
        ${exiting ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-[hsl(var(--overlay))]/50 backdrop-blur-sm'
        onClick={() => handleAction(false)}
      />

      {/* Card */}
      <div
        ref={cardRef}
        tabIndex={-1}
        role='alertdialog'
        aria-modal='true'
        aria-labelledby='confirm-title'
        aria-describedby='confirm-message'
        className={`
          relative z-10 mx-4 w-full max-w-sm
          rounded-2xl border border-[hsl(var(--destructive))]/50
          bg-[hsl(var(--card))]/70 p-5 shadow-2xl shadow-black/40
          backdrop-blur-md
          transition-all duration-200 ease-out outline-none
          ${exiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        `}
      >
        {/* Ícone de alerta */}
        <div className='mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--destructive))]/45'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className='h-5 w-5 text-[hsl(var(--destructive-foreground))]'
          >
            <path
              fillRule='evenodd'
              d='M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z'
              clipRule='evenodd'
            />
          </svg>
        </div>

        {/* Título */}
        <h3
          id='confirm-title'
          className='text-sm font-semibold text-[hsl(var(--foreground))]'
        >
          {title}
        </h3>

        {/* Mensagem */}
        <p
          id='confirm-message'
          className='mt-1.5 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]'
        >
          {message}
        </p>

        {/* Ações */}
        <div className='mt-5 flex items-center justify-end gap-2'>
          <Button variant='ghost' size='sm' onClick={() => handleAction(false)}>
            {cancelLabel}
          </Button>
          <Button variant='danger' size='sm' onClick={() => handleAction(true)}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* Provider */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    setDialog(options);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleResolve = useCallback((value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setDialog(null);
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <ConfirmCard
          {...dialog}
          onConfirm={() => handleResolve(true)}
          onCancel={() => handleResolve(false)}
        />
      )}
    </ConfirmContext.Provider>
  );
}
