import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md';
}

const variants: Record<Variant, string> = {
  primary:
    'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90',
  secondary:
    'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:opacity-80',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost:
    'bg-transparent text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
};

const sizes: Record<string, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-all disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
