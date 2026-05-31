import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SliderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number
  onValueChange?: (value: number) => void
}

export function Slider({ className, value, onValueChange, ...props }: SliderProps) {
  return (
    <input
      type="range"
      value={value}
      onChange={(event) => onValueChange?.(Number(event.target.value))}
      className={cn(
        'h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400',
        className,
      )}
      {...props}
    />
  )
}
