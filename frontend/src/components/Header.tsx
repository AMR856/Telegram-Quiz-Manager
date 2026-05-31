'use client'

import { useEffect, useState } from 'react'
import { Globe, KeyRound, Activity } from 'lucide-react'
import { HealthState } from '@/types'
import { formatDuration, getHealthLabel } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface HeaderProps {
  health: HealthState
  backendUrl: string
  apiKey: string
  onBackendUrlChange: (value: string) => void
  onApiKeyChange: (value: string) => void
}

export function Header({
  health,
  backendUrl,
  apiKey,
  onBackendUrlChange,
  onApiKeyChange,
}: HeaderProps) {
  const healthLabel = getHealthLabel(health)
  const [since, setSince] = useState<number | null>(null)
  const [, setTick] = useState(0)

  useEffect(() => {
    if (health.state === 'up' || health.state === 'down') {
      setSince(Date.now())
    }
  }, [health.state])

  useEffect(() => {
    const timer = setInterval(() => setTick((prev) => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const uptimeSeconds = since ? (Date.now() - since) / 1000 : 0
  const statusVariant =
    health.state === 'up'
      ? 'success'
      : health.state === 'down'
        ? 'danger'
        : 'warning'

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold gradient-text">Telegram Quiz Manager</h1>
            <p className="text-xs text-slate-400">Manage your Telegram bot quizzes with ease</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Badge variant={statusVariant} className="gap-2">
              <span className="h-2 w-2 rounded-full bg-current" />
              {health.state === 'up' ? 'UP' : health.state === 'down' ? 'DOWN' : 'CHECKING'}
            </Badge>
            <div className="text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Uptime</span>{' '}
              {formatDuration(uptimeSeconds)}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative min-w-[220px]">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                type="text"
                placeholder="Backend URL"
                value={backendUrl}
                onChange={(e) => onBackendUrlChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="relative min-w-[200px]">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                type="text"
                placeholder="x-api-key"
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800/70 bg-slate-900/70 px-5 py-2">
        <p className="mx-auto max-w-7xl text-[11px] uppercase tracking-[0.3em] text-slate-500">
          System status {healthLabel} • {health.at || 'waiting'}
        </p>
      </div>
    </header>
  )
}