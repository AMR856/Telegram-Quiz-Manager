'use client'

import { InsightCard } from '@/types'
import { getToneClass } from '@/lib/utils'
import { Card } from '@/components/ui/card'

interface InsightsProps {
  insights: InsightCard[]
}

export function Insights({ insights }: InsightsProps) {
  const primary = insights.slice(0, 3)
  const secondary = insights.slice(3)

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Action Insights</h2>
        <p className="text-xs text-slate-500">Most recent system actions.</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {primary.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            className={`rounded-xl border p-4 text-sm ${getToneClass(item.tone)}`}
          >
            <p className="text-[11px] uppercase tracking-[0.2em] opacity-80">
              {item.title}
            </p>
            <p className="mt-2 break-all text-base font-semibold">{item.value}</p>
          </article>
        ))}
      </div>

      {secondary.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {secondary.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className={`rounded-xl border p-3 text-sm ${getToneClass(item.tone)}`}
            >
              <p className="text-[11px] uppercase tracking-[0.2em] opacity-70">
                {item.title}
              </p>
              <p className="mt-1 break-all font-medium">{item.value}</p>
            </article>
          ))}
        </div>
      )}
    </Card>
  )
}