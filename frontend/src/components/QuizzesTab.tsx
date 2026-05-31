'use client'

import { Send, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

interface QuizzesTabProps {
  quizzes: string
  delayMs: number
  retryWrongAfterMinutes: number
  loading: boolean
  onQuizzesChange: (value: string) => void
  onDelayChange: (value: number) => void
  onRetryWrongAfterMinutesChange: (value: number) => void
  onSend: () => void
}

export function QuizzesTab({
  quizzes,
  delayMs,
  retryWrongAfterMinutes,
  loading,
  onQuizzesChange,
  onDelayChange,
  onRetryWrongAfterMinutesChange,
  onSend,
}: QuizzesTabProps) {
  return (
    <Card className="grid gap-4">
      <div>
        <h2 className="text-lg font-semibold">Send Quizzes</h2>
        <p className="text-xs text-slate-400">Paste a JSON array of quizzes to dispatch.</p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-200">Quiz JSON Array</label>
        <textarea
          value={quizzes}
          onChange={(e) => onQuizzesChange(e.target.value)}
          rows={10}
          className="min-h-[220px] w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 font-mono text-sm text-slate-100 focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          placeholder='[
  {
    "question": "...",
    "options": ["..."],
    "correctAnswerId": 0,
    "explanation": "..."
  }
]'
        />
      </div>

      <div className="grid gap-3">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>Send Delay</span>
          <span className="font-semibold text-cyan-300">{delayMs} ms</span>
        </div>
        <Slider min={100} max={5000} step={100} value={delayMs} onValueChange={onDelayChange} />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span>Retry wrong answer after</span>
          <span title="Minutes before retrying incorrect answers.">
            <Info className="h-3 w-3 text-slate-500" />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            step="1"
            value={retryWrongAfterMinutes}
            onChange={(e) =>
              onRetryWrongAfterMinutesChange(Math.max(0, Number(e.target.value) || 0))
            }
            className="max-w-[180px]"
          />
          <span className="text-xs text-slate-500">minutes</span>
        </div>
      </div>

      <Button type="button" onClick={onSend} isLoading={loading} className="h-12">
        <Send className="h-4 w-4" /> Send Quizzes
      </Button>
    </Card>
  )
}