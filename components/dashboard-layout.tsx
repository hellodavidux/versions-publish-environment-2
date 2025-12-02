"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  Search,
  Home,
  Database,
  RefreshCw,
  Pencil,
  BarChart3,
  Link as LinkIcon,
  Bell,
  HelpCircle,
  TrendingUp,
  User,
  Undo2,
  Redo2,
  Upload,
  Save,
  Play,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { AddElementsPanel } from "@/components/add-elements-panel"
import type { SelectedAction } from "@/lib/types"

interface DashboardLayoutProps {
  children: React.ReactNode
  onActionSelect?: (action: SelectedAction) => void
  onOpenNodeSelector?: (openFn: (position: { x: number; y: number }, source?: "handle" | "replace", tab?: string) => void) => void
}

export function DashboardLayout({ children, onActionSelect, onOpenNodeSelector }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = React.useState("Workflow")
  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 })
  const [panelSource, setPanelSource] = useState<"sidebar" | "handle" | "replace">("handle")
  const [initialTab, setInitialTab] = useState<string | undefined>(undefined)
  const plusButtonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (plusButtonRef.current) {
      const rect = plusButtonRef.current.getBoundingClientRect()
      setPanelPosition({
        top: rect.top - 56, // Account for top bar
        left: 20, // Fixed left position
      })
    }
    setPanelSource("sidebar") // Mark this as coming from sidebar
    setIsNodeSelectorOpen(!isNodeSelectorOpen)
  }

  const handleActionSelect = (action: SelectedAction) => {
    onActionSelect?.(action)
    if (!isPinned) {
      setIsNodeSelectorOpen(false)
    }
  }

  const handlePinToggle = (pinned: boolean) => {
    setIsPinned(pinned)
  }

  const openNodeSelectorAtPosition = (position: { x: number; y: number }, source: "handle" | "replace" = "handle", tab?: string) => {
    setPanelPosition({ left: position.x, top: position.y })
    setPanelSource(source)
    setInitialTab(tab)
    setIsNodeSelectorOpen(true)
  }

  // Expose the function to open node selector at a position
  useEffect(() => {
    if (onOpenNodeSelector) {
      onOpenNodeSelector(openNodeSelectorAtPosition)
    }
  }, [onOpenNodeSelector])

  // Close panel when clicking outside (only if not pinned)
  useEffect(() => {
    if (!isNodeSelectorOpen || isPinned) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (
        panelRef.current &&
        plusButtonRef.current &&
        !panelRef.current.contains(target) &&
        !plusButtonRef.current.contains(target) &&
        !target.closest('[data-nextjs-toast]') // Don't close when clicking Next.js dev tools
      ) {
        setIsNodeSelectorOpen(false)
      }
    }

    // Use both mousedown and click events, with capture phase
    document.addEventListener("mousedown", handleClickOutside, true)
    document.addEventListener("click", handleClickOutside, true)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
      document.removeEventListener("click", handleClickOutside, true)
    }
  }, [isNodeSelectorOpen, isPinned])

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      {/* Top Bar */}
      <div className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
        {/* Left: Logo and Project Name */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-foreground font-bold text-sm border border-border">
            A
          </div>
          <span className="text-sm font-medium text-foreground">Antlio Testing / Sidebar</span>
        </div>

        {/* Center: Navigation Tabs */}
        <div className="flex items-center gap-1">
          {["Workflow", "Export", "Analytics", "Manager"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors rounded-md",
                activeTab === tab
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right: User Profile and Actions */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <Button variant="ghost" size="icon-sm" className="h-8 w-8">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="h-8 w-8">
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="h-8 w-8">
            <Upload className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="h-8 w-8">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <Play className="h-3.5 w-3.5" />
            Run
          </Button>
          <Button variant="default" size="sm" className="h-8 bg-foreground text-background hover:bg-foreground/90">
            Publish
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <TooltipProvider delayDuration={100}>
          <div className="flex w-12 flex-col items-center border-r border-border bg-background py-5">
            <div className="flex flex-col items-center gap-1.5">
              {/* Plus Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    ref={plusButtonRef}
                    onClick={handlePlusClick}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground border border-border hover:bg-foreground hover:text-background transition-colors mb-2"
                    type="button"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} hideArrow>
                  <span>Add node</span>
                </TooltipContent>
              </Tooltip>

              {/* Icons */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Home className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} hideArrow>
                  <span>Home</span>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Database className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} hideArrow>
                  <span>Database</span>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} hideArrow>
                  <span>Refresh</span>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} hideArrow>
                  <span>Edit</span>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <BarChart3 className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} hideArrow>
                  <span>Analytics</span>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Bottom Section: Links, Notifications, Help, Trends, and User Profile */}
            <div className="mt-auto mb-2 flex flex-col items-center gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <LinkIcon className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} hideArrow>
                  <span>Links</span>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Bell className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} hideArrow>
                  <span>Notifications</span>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} hideArrow>
                  <span>Help</span>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <TrendingUp className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} hideArrow>
                  <span>Trends</span>
                </TooltipContent>
              </Tooltip>

              {/* User Profile */}
              <div className="mt-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8} hideArrow>
                    <span>Profile</span>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </TooltipProvider>

        {/* Canvas Area */}
        <div className="flex-1 overflow-hidden relative">
          {children}
          {/* Node Selector Popover */}
          {isNodeSelectorOpen && (
            <div
              ref={panelRef}
              className="absolute z-50"
              style={{
                left: `${panelPosition.left}px`,
                top: `${panelPosition.top}px`,
              }}
            >
              <AddElementsPanel 
                onSelectAction={handleActionSelect} 
                onClose={() => setIsNodeSelectorOpen(false)} 
                source={panelSource}
                isPinned={isPinned}
                onPinToggle={handlePinToggle}
                initialTab={initialTab}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

