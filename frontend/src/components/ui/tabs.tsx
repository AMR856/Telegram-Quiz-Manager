'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  value: string
  onValueChange?: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

export function Tabs({
  value,
  onValueChange,
  className,
  children,
}: {
  value: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('flex flex-wrap gap-2', className)}>{children}</div>
}

export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: React.ReactNode
}) {
  const context = React.useContext(TabsContext)
  const isActive = context?.value === value

  return (
    <button
      type="button"
      onClick={() => context?.onValueChange?.(value)}
      className={cn(
        'relative inline-flex items-center gap-2 rounded-none px-1 pb-3 pt-2 text-sm font-semibold transition',
        isActive ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200',
        className,
      )}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-cyan-400" />
      )}
    </button>
  )
}
