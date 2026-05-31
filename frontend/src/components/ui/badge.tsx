import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline'
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/40',
  success: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40',
  warning: 'bg-amber-500/15 text-amber-200 border-amber-500/40',
  danger: 'bg-rose-500/15 text-rose-200 border-rose-500/40',
  outline: 'border border-slate-700 text-slate-200',
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
