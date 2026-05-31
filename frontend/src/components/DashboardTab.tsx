'use client'

import { QuickStat } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DashboardTabProps {
  healthLabel: string
  quickStats: QuickStat[]
}

export function DashboardTab({ healthLabel, quickStats }: DashboardTabProps) {
  const getTone = (value: string) => {
    const normalized = value.toLowerCase()
    if (normalized.includes('down') || normalized.includes('missing')) return 'danger'
    if (normalized.includes('idle') || normalized.includes('none') || normalized === '0')
      return 'warning'
    return 'success'
  }

  const getBadgeLabel = (value: string) => {
    const normalized = value.toLowerCase()
    if (normalized.includes('down')) return 'down'
    if (normalized.includes('missing')) return 'missing'
    if (normalized.includes('idle')) return 'idle'
    if (normalized.includes('none')) return 'none'
    return 'ok'
  }

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Backend Health</h2>
          <p className="text-sm text-slate-400">Checked every 5 seconds.</p>
        </div>
        <Badge variant="default" className="uppercase">
          {healthLabel}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
              {item.label}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="truncate text-sm font-semibold text-slate-100">
                {item.value}
              </p>
              <Badge variant={getTone(item.value)}>{getBadgeLabel(item.value)}</Badge>
            </div>
          </article>
        ))}
      </div>
    </Card>
  )
}