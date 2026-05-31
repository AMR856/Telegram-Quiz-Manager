'use client'

import type { ReactNode } from 'react'
import { LayoutDashboard, KeyRound, ImageIcon, HelpCircle, Briefcase } from 'lucide-react'
import { TAB_IDS } from '@/lib/constants'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type TabId = (typeof TAB_IDS)[keyof typeof TAB_IDS]

interface NavigationProps {
  activeTab: TabId
  onTabChange: (tabId: TabId) => void
}

const TABS: Array<{ id: TabId; label: string; icon: ReactNode }> = [
  { id: TAB_IDS.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: TAB_IDS.AUTH, label: 'Auth', icon: <KeyRound className="h-4 w-4" /> },
  { id: TAB_IDS.IMAGES, label: 'Images', icon: <ImageIcon className="h-4 w-4" /> },
  { id: TAB_IDS.QUIZZES, label: 'Quizzes', icon: <HelpCircle className="h-4 w-4" /> },
  { id: TAB_IDS.JOBS, label: 'Jobs', icon: <Briefcase className="h-4 w-4" /> },
]

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="border-b border-slate-800 bg-slate-900/60">
      <div className="mx-auto w-full max-w-7xl px-5">
        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as TabId)} className="w-full">
          <TabsList className="gap-6">
            {TABS.map(({ id, label, icon }) => (
              <TabsTrigger key={id} value={id} className="gap-2">
                {icon}
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </nav>
  )
}