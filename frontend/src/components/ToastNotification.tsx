'use client'

import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { Toast } from '@/types'

interface ToastProps {
  toast: Toast | null
}

export function ToastNotification({ toast }: ToastProps) {
  if (!toast) return null

  const styles =
    toast.type === 'success'
      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-100'
      : toast.type === 'error'
        ? 'border-rose-500/50 bg-rose-500/15 text-rose-100'
        : 'border-cyan-500/50 bg-cyan-500/15 text-cyan-100'

  const Icon =
    toast.type === 'success'
      ? CheckCircle2
      : toast.type === 'error'
        ? AlertTriangle
        : Info

  return (
    <div className="fixed right-4 top-4 z-50">
      <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg ${styles}`}>
        <Icon className="h-4 w-4" />
        <span className="font-medium">{toast.message}</span>
      </div>
    </div>
  )
}