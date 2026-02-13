import { createContext, useContext } from 'react';

/* Tipos */
export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

/* Contexto */
export const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function useConfirm(): ConfirmContextValue {
  const ctx = useContext(ConfirmContext);
  if (!ctx)
    throw new Error('useConfirm deve ser usado dentro de <ConfirmProvider>');
  return ctx;
}
