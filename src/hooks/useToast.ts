import { createContext, useContext } from 'react';

/* Tipos */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

export interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

/* Contexto */
export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error('useToast deve ser usado dentro de <ToastProvider>');
  return ctx;
}
