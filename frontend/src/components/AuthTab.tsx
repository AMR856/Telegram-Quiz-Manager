'use client'

import { Bot, Hash, KeySquare } from 'lucide-react'
import { AuthPayload } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

interface AuthTabProps {
  authData: AuthPayload
  loading: boolean
  onAuthDataChange: (data: AuthPayload) => void
  onSignIn: () => void
}

export function AuthTab({
  authData,
  loading,
  onAuthDataChange,
  onSignIn,
}: AuthTabProps) {
  return (
    <Card className="grid max-w-lg gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Sign In</h2>
          <p className="text-xs text-slate-400">Authorize the bot for quiz delivery.</p>
        </div>
      </div>

      <div className="relative">
        <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          type="text"
          placeholder="chatId"
          value={authData.chatId}
          onChange={(e) =>
            onAuthDataChange({ ...authData, chatId: e.target.value })
          }
          className="pl-9"
        />
      </div>

      <div className="relative">
        <KeySquare className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          type="text"
          placeholder="botToken"
          value={authData.botToken}
          onChange={(e) =>
            onAuthDataChange({ ...authData, botToken: e.target.value })
          }
          className="pl-9"
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-3">
        <div>
          <p className="text-sm font-medium text-slate-200">Is Channel</p>
          <p className="text-xs text-slate-500">Toggle if the chatId is a channel.</p>
        </div>
        <Switch
          checked={authData.isChannel}
          onCheckedChange={(checked) =>
            onAuthDataChange({ ...authData, isChannel: checked })
          }
        />
      </div>

      <Button type="button" onClick={onSignIn} isLoading={loading} className="w-full">
        Sign In
      </Button>
    </Card>
  )
}