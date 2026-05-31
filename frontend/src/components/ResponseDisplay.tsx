'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { formatJson } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ResponseDisplayProps {
  meta: string
  response: unknown
}

export function ResponseDisplay({ meta, response }: ResponseDisplayProps) {
  const [copied, setCopied] = useState(false)
  const formatted = formatJson(response)
  const isReady = meta.toLowerCase().includes('ready')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatted)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const highlightJson = (value: string) => {
    const escaped = value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    return escaped.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?)/g,
      (match) => {
        if (match.startsWith('"') && match.trim().endsWith(':')) {
          return `<span class="json-key">${match}</span>`
        }
        if (match.startsWith('"')) {
          return `<span class="json-string">${match}</span>`
        }
        if (match === 'true' || match === 'false') {
          return `<span class="json-boolean">${match}</span>`
        }
        if (match === 'null') {
          return `<span class="json-null">${match}</span>`
        }
        return `<span class="json-number">${match}</span>`
      },
    )
  }

  return (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Latest Response</h2>
          <p className="text-xs text-slate-400">{meta}</p>
        </div>
        <div className="flex items-center gap-2">
          {isReady && <Badge variant="success">Ready</Badge>}
          <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>
      <pre
        className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs"
        dangerouslySetInnerHTML={{ __html: highlightJson(formatted) }}
      />
    </Card>
  )
}