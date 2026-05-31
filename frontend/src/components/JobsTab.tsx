'use client'

import { Search } from 'lucide-react'
import { formatJson } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface JobsTabProps {
  jobId: string
  jobStatus: unknown
  loading: boolean
  onJobIdChange: (value: string) => void
  onCheckJob: () => void
}

export function JobsTab({
  jobId,
  jobStatus,
  loading,
  onJobIdChange,
  onCheckJob,
}: JobsTabProps) {
  const statusData = jobStatus as Record<string, unknown> | null
  const stateValue =
    (statusData?.data as Record<string, unknown> | undefined)?.state ||
    (statusData?.data as Record<string, unknown> | undefined)?.status ||
    'unknown'
  const stateLabel = String(stateValue).toLowerCase()
  const stateVariant =
    stateLabel === 'completed'
      ? 'success'
      : stateLabel === 'failed'
        ? 'danger'
        : 'warning'
  const progressValue = (statusData?.data as Record<string, unknown> | undefined)?.progress
  const progress =
    typeof progressValue === 'number' && Number.isFinite(progressValue)
      ? Math.max(0, Math.min(100, progressValue))
      : null

  return (
    <Card className="grid gap-4">
      <div>
        <h2 className="text-lg font-semibold">Job Status</h2>
        <p className="text-xs text-slate-400">Track quiz dispatch jobs in real time.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          type="text"
          placeholder="Job ID"
          value={jobId}
          onChange={(e) => onJobIdChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Button
        type="button"
        onClick={onCheckJob}
        isLoading={loading}
        disabled={!jobId.trim()}
        className="max-w-[160px]"
      >
        Check Job
      </Button>

      {jobStatus && (
        <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-200">Job Result</p>
            <Badge variant={stateVariant}>{stateLabel}</Badge>
          </div>
          {progress !== null && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-cyan-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs">
            {formatJson(jobStatus)}
          </pre>
        </div>
      )}
    </Card>
  )
}