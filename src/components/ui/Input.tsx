import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium text-[hsl(var(--muted-foreground))]"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none transition-colors focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] ${className}`}
        {...props}
      />
    </div>
  );
}
