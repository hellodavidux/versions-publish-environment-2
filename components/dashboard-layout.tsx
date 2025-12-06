"use client"

import React from "react"
import Image from "next/image"
import confetti from "canvas-confetti"
import {
  MoreVertical,
  Trash2,
  Archive,
  Copy,
  Settings,
  ChevronDown,
  Share2,
  Plus,
  Link2,
  Pencil,
  Cloud,
  GitBranch,
  History,
  Lock,
  ArrowRight,
  Minus,
  X,
  RotateCw,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  onRun?: () => void
}

export function DashboardLayout({ children, onRun }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = React.useState("Workflow")
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [isPublishOpen, setIsPublishOpen] = React.useState(false)
  const [isDraftOpen, setIsDraftOpen] = React.useState(false)
  const [isPublished, setIsPublished] = React.useState(true)
  const [isVersionSidebarOpen, setIsVersionSidebarOpen] = React.useState(false)
  const [selectedVersion, setSelectedVersion] = React.useState<string | null>(null)
  const [isPreviewing, setIsPreviewing] = React.useState(false)
  const [environment, setEnvironment] = React.useState("production")
  const [publishEnvironment, setPublishEnvironment] = React.useState("production")
  const [showPublishDot, setShowPublishDot] = React.useState(true)
  const [showPublishedDot, setShowPublishedDot] = React.useState(true)
  const [showReviewChangesDot, setShowReviewChangesDot] = React.useState(true)
  const [isPullRequestApproved, setIsPullRequestApproved] = React.useState(false)
  const [isPullRequestRejected, setIsPullRequestRejected] = React.useState(false)
  const [restoredVersion, setRestoredVersion] = React.useState<string | null>(null)
  const [isDescriptionOpen, setIsDescriptionOpen] = React.useState(false)
  const [description, setDescription] = React.useState("")
  const [hasPublishedWorkflow, setHasPublishedWorkflow] = React.useState(false)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [isOlderVersionsOpen, setIsOlderVersionsOpen] = React.useState(false)

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      {/* Top Bar */}
      <div className="relative flex h-14 items-center justify-between border-b border-border bg-background px-4">
        {/* Left: Logo and Project Name */}
        <div className="flex items-center gap-3">
          <Image
            src="/icon.svg"
            alt="StackAI Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-sm font-medium text-foreground">Antlio Testing / Sidebar</span>
          <span className="text-xs text-muted-foreground/70 font-normal ml-2 px-2 py-0.5 rounded bg-muted/40">autosaved</span>
        </div>

        {/* Center: Navigation Tabs */}
        {!isPreviewing && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
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
        )}

        {/* Right: User Profile and Actions */}
        {!isPreviewing && (
          <TooltipProvider>
            <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative flex items-center">
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="cursor-pointer flex items-center p-0 m-0 border-0 bg-transparent hover:opacity-70 transition-opacity"
                  >
                    <Image
                      src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                      alt="Profile"
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-lg border border-white object-cover"
                    />
                  </button>
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-gray-200 border border-white p-0 hover:bg-gray-400 flex items-center justify-center cursor-pointer transition-colors"
                    onClick={() => setIsShareModalOpen(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-black shrink-0 flex-shrink-0" style={{ width: '10px', height: '10px', minWidth: '10px', minHeight: '10px', maxWidth: '10px', maxHeight: '10px' }}>
                      <path d="M5 12h14"/>
                      <path d="M12 5v14"/>
                    </svg>
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white text-foreground border border-border" hideArrow sideOffset={8}>
                <p>share workflow</p>
              </TooltipContent>
            </Tooltip>
          <div className="h-4 w-px bg-border"></div>
          <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="h-8 w-8 bg-muted hover:bg-muted/70 cursor-pointer transition-colors">
                    <Settings className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent className="bg-white text-foreground border border-border" hideArrow sideOffset={8}>
                <p>Workflow settings</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent align="end" className="w-64" sideOffset={12}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                      <path d="M2 12h20"/>
                    </svg>
                    Environment
                  </Label>
                  <Select value={environment} onValueChange={setEnvironment}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-2 border-t border-border">
                  <button 
                    className="text-sm text-foreground hover:text-foreground/80 transition-colors text-left"
                    onClick={() => {
                      // Handle manage environments click
                      setIsSettingsOpen(false);
                    }}
                  >
                    Manage environments
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover open={isDraftOpen} onOpenChange={setIsDraftOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button 
                    variant={isPublished ? "outline" : "ghost"} 
                    size="icon-sm" 
                    className={`h-8 w-auto gap-1.5 cursor-pointer transition-colors relative px-2 ${
                      isPublished 
                        ? "bg-white hover:bg-white border-border" 
                        : "bg-muted hover:bg-muted/70"
                    }`}
                  >
                    <div className={`h-2 w-2 rounded-full border ${isPublished ? 'bg-green-500 border-green-300' : 'bg-gray-400 border-gray-300'}`}></div>
                    <span className="text-muted-foreground">{isPublished ? "v.2.3.9" : "Draft"}</span>
                    {showPublishedDot && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-black border-2 border-gray-200"></span>}
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent className="bg-white text-foreground border border-border" hideArrow sideOffset={8}>
                <p>Review versions or unpublish</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent align="end" className="w-80 p-0" sideOffset={12}>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {isPublished ? "Project published" : "Project unpublished"}
                      <span className="ml-2 text-muted-foreground font-normal text-xs">v.2.3.9</span>
                    </span>
                    <span className="text-xs text-muted-foreground/70 font-normal">Production Environment</span>
                  </div>
                  <Switch checked={isPublished} onCheckedChange={setIsPublished} className="cursor-pointer">
                    <Cloud className="h-3 w-3" />
                  </Switch>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase mb-2">Version history</h3>
                <div className="space-y-0 relative">
                  {/* Vertical line connecting dots - aligned with header */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
                  {/* Restored Version - Show first */}
                   {restoredVersion === "Draft" && (
                   <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                     <Image
                       src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                       alt="Profile"
                       width={24}
                       height={24}
                       className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                     />
                     <div className="flex-1 min-w-0 -ml-2">
                       <div className="flex items-center gap-1.5">
                         <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                         <span className="font-normal text-sm text-muted-foreground">Draft</span>
                       </div>
                       <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> Now</span>
                     </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedVersion("Draft"); setIsDraftOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setRestoredVersion("Draft");
                            setShowPublishDot(true);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <RotateCw className="h-3.5 w-3.5 mr-2" />
                            Restore version
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            triggerConfetti();
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  {restoredVersion === "v2.3.9" && (
                  <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                    <Image
                      src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                      alt="Profile"
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                    />
                    <div className="flex-1 min-w-0 -ml-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-green-500 border border-green-300 flex-shrink-0"></div>
                        <span className="font-normal text-sm text-muted-foreground">v2.3.9</span>
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> 2m ago</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedVersion("v2.3.9"); setIsDraftOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setRestoredVersion("v2.3.9");
                            setShowPublishDot(true);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <RotateCw className="h-3.5 w-3.5 mr-2" />
                            Restore version
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            triggerConfetti();
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  {restoredVersion === "v2.3.8" && (
                  <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                      <span className="text-[10px] font-medium text-gray-600">SM</span>
                    </div>
                    <div className="flex-1 min-w-0 -ml-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                        <span className="font-normal text-sm text-muted-foreground">v2.3.8</span>
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">Sarah Miller <span className="mx-0.5">·</span> 1w ago</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedVersion("v2.3.8"); setIsDraftOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setRestoredVersion("v2.3.8");
                            setShowPublishDot(true);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <RotateCw className="h-3.5 w-3.5 mr-2" />
                            Restore version
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            triggerConfetti();
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  
                  {/* v2.4.0 Version - Show first when approved */}
                   {isPullRequestApproved && (
                   <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                     <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                       <span className="text-[10px] font-medium text-gray-600">AC</span>
                     </div>
                     <div className="flex-1 min-w-0 -ml-2">
                       <div className="flex items-center gap-1.5">
                         <div className="h-2 w-2 rounded-full bg-black border border-gray-500 flex-shrink-0"></div>
                         <span className="font-normal text-sm text-muted-foreground">v2.4.0</span>
                       </div>
                       <span className="text-xs text-muted-foreground block mt-0.5">Alex Chen <span className="mx-0.5">·</span> 2d ago</span>
                     </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedVersion("v2.4.0"); setIsDraftOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Review
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setShowPublishedDot(false);
                            setIsPullRequestApproved(true);
                            setShowPublishDot(true);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <Check className="h-3.5 w-3.5 mr-2" />
                            Approve version
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            triggerConfetti();
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  
                  {/* Draft Version - Hide if restored */}
                  {restoredVersion !== "Draft" && (
                  <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                    <Image
                      src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                      alt="Profile"
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                    />
                    <div className="flex-1 min-w-0 -ml-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                        <span className="font-normal text-sm text-muted-foreground">Draft</span>
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> Now</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedVersion("Draft"); setIsDraftOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setRestoredVersion("Draft");
                            setShowPublishDot(true);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <RotateCw className="h-3.5 w-3.5 mr-2" />
                            Restore version
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            triggerConfetti();
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  
                  {/* v2.4.0 Version - Show in original position when not approved and not rejected */}
                  {!isPullRequestApproved && !isPullRequestRejected && (
                  <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                      <span className="text-[10px] font-medium text-gray-600">AC</span>
                    </div>
                    <div className="flex-1 min-w-0 -ml-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-black border border-gray-500 flex-shrink-0"></div>
                        <span className="font-normal text-sm text-muted-foreground">v2.4.0</span>
                        {!isPullRequestApproved && <span className="px-2 py-0.5 rounded-lg text-xs font-medium text-black bg-gray-200">Pull Request</span>}
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">Alex Chen <span className="mx-0.5">·</span> 2d ago</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedVersion("v2.4.0"); setIsDraftOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Review
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setShowPublishedDot(false);
                            setIsPullRequestApproved(true);
                            setShowPublishDot(true);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <Check className="h-3.5 w-3.5 mr-2" />
                            Approve version
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setIsPullRequestRejected(true);
                            setShowPublishedDot(false);
                          }}>
                            <X className="h-3.5 w-3.5 mr-2" />
                            Reject version
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            triggerConfetti();
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  
                  {/* v2.3.9 Live Version - Hide if restored */}
                  {restoredVersion !== "v2.3.9" && (
                  <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                    <Image
                      src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                      alt="Profile"
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                    />
                    <div className="flex-1 min-w-0 -ml-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-green-500 border border-green-300 flex-shrink-0"></div>
                        <span className="font-normal text-sm text-muted-foreground">v2.3.9</span>
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> 2m ago</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedVersion("v2.3.9"); setIsDraftOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setRestoredVersion("v2.3.9");
                            setShowPublishDot(true);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <RotateCw className="h-3.5 w-3.5 mr-2" />
                            Restore version
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            triggerConfetti();
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  
                  {/* v2.3.8 Version - Hide if restored */}
                  {restoredVersion !== "v2.3.8" && (
                  <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                      <span className="text-[10px] font-medium text-gray-600">SM</span>
                    </div>
                    <div className="flex-1 min-w-0 -ml-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                        <span className="font-normal text-sm text-muted-foreground">v2.3.8</span>
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">Sarah Miller <span className="mx-0.5">·</span> 1w ago</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedVersion("v2.3.8"); setIsDraftOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setRestoredVersion("v2.3.8");
                            setShowPublishDot(true);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <RotateCw className="h-3.5 w-3.5 mr-2" />
                            Restore version
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            triggerConfetti();
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                </div>
                
                {/* See Older Versions Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => {
                    setIsDraftOpen(false);
                    setIsOlderVersionsOpen(true);
                  }}
                >
                  View all history
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <div className="h-4 w-px bg-border"></div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors" onClick={onRun}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                  <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
                </svg>
                Run
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white text-foreground border border-border" hideArrow sideOffset={8}>
              <p>Run Workflow</p>
            </TooltipContent>
          </Tooltip>
          <Popover open={isPublishOpen} onOpenChange={setIsPublishOpen}>
            {!hasPublishedWorkflow && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="default" size="sm" className="h-8 gap-1.5 bg-foreground text-background hover:bg-foreground/85 relative cursor-pointer transition-colors">
                      Publish
                      <ChevronDown className="h-3.5 w-3.5" />
                      {showPublishDot && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-black border-2 border-white"></span>}
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-foreground border border-border" hideArrow sideOffset={8}>
                  <p>See publish Options</p>
                </TooltipContent>
              </Tooltip>
            )}
            {hasPublishedWorkflow && (
              <PopoverTrigger asChild>
                <Button variant="default" size="sm" className="h-8 gap-1.5 bg-foreground text-background hover:bg-foreground/85 relative cursor-pointer transition-colors">
                  Publish
                  <ChevronDown className="h-3.5 w-3.5" />
                  {showPublishDot && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-black border-2 border-white"></span>}
                </Button>
              </PopoverTrigger>
            )}
            <PopoverContent align="end" className="w-64 p-0" sideOffset={12}>
              <div className="space-y-0 px-4 pt-4">
                  <Popover open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                    <PopoverTrigger asChild>
                      <button 
                        className="w-full flex items-center gap-2 text-sm text-foreground hover:text-foreground/80 transition-colors text-left py-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add description
                      </button>
                    </PopoverTrigger>
                    <PopoverContent 
                      align="start" 
                      className="w-80 p-4" 
                      sideOffset={8}
                    >
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Description</Label>
                        <Textarea
                          placeholder="Add a description..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="min-h-[200px] resize-none text-sm"
                          autoFocus
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                          onClick={() => setIsDescriptionOpen(false)}
                        >
                          Done
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <div className="h-px bg-border"></div>
                  <button 
                    className="w-full flex items-center gap-2 text-sm text-foreground hover:text-foreground/80 transition-colors text-left py-2"
                    onClick={() => {
                      setShowPublishDot(false);
                      setShowReviewChangesDot(false);
                    }}
                  >
                    <Link2 className="h-4 w-4" />
                    Review the changes{showReviewChangesDot && <span className="h-3 w-3 rounded-full bg-black border-2 border-gray-200 ml-0.25 inline-block"></span>}
                  </button>
                  <div className="h-px bg-border"></div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full flex items-center gap-2 text-sm text-foreground hover:text-foreground/80 transition-colors text-left py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                          <path d="M2 12h20"/>
                        </svg>
                        Environment: {publishEnvironment === "production" ? "Production" : "Staging"}<ChevronDown className="h-4 w-4 ml-0" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setPublishEnvironment("staging")}>
                        Staging
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPublishEnvironment("production")}>
                        Production
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="px-4 pt-4 pb-4">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full bg-foreground text-background hover:bg-foreground/90"
                    onClick={() => {
                      triggerConfetti();
                      setShowPublishDot(false);
                      setIsPublishOpen(false);
                      setHasPublishedWorkflow(true);
                    }}
                  >
                    Publish workflow
                  </Button>
                </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="h-8 w-8 -mr-2 cursor-pointer hover:bg-accent/80 transition-colors">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={12}>
              <DropdownMenuItem onClick={() => setIsShareModalOpen(true)}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsOlderVersionsOpen(true)}>
                <History className="mr-2 h-4 w-4" />
                See version history
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Lock className="mr-2 h-4 w-4" />
                Lock project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </TooltipProvider>
        )}
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 overflow-hidden bg-gray-100 flex flex-col relative ${isRefreshing ? 'refresh-flicker' : ''}`}>
        {/* Preview Banner */}
        {isPreviewing && selectedVersion && (
          <div className="absolute top-20 left-[42%] -translate-x-1/2 z-20 p-4">
            <div className="bg-white rounded-lg shadow-lg border border-border p-6 flex flex-col items-center gap-4 min-w-[400px]">
              <History className="h-8 w-8 text-foreground" />
              <h3 className="text-base font-semibold text-center">
                Previewing version "{selectedVersion}"
              </h3>
              <div className="flex flex-col gap-2 w-full">
                {selectedVersion === "v2.4.0" ? (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-black hover:bg-black/90 text-white"
                      onClick={() => {
                        setIsPreviewing(false);
                        setIsVersionSidebarOpen(false);
                      }}
                    >
                      Accept this Version
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-white border-border"
                      onClick={() => {
                        setIsPullRequestRejected(true);
                        setShowPublishedDot(false);
                        setIsPreviewing(false);
                        setIsVersionSidebarOpen(false);
                      }}
                    >
                      Reject this version
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full bg-white"
                      onClick={() => {
                        setIsPreviewing(false);
                        setIsVersionSidebarOpen(false);
                      }}
                    >
                      Back to current draft
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        setIsPreviewing(false);
                        setIsVersionSidebarOpen(false);
                      }}
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      Restore this version as new draft
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full bg-white"
                      onClick={() => {
                        setIsPreviewing(false);
                        setIsVersionSidebarOpen(false);
                      }}
                    >
                      Back to current draft
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
        {isVersionSidebarOpen && (
          <div className="absolute top-0 right-0 h-full w-[320px] bg-white border-l border-border overflow-y-auto z-10">
              <div className="p-4 border-b border-border space-y-3">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-sm text-foreground hover:text-foreground/80"
                    onClick={() => {
                      setIsPreviewing(false);
                      setIsVersionSidebarOpen(false);
                      setIsOlderVersionsOpen(true);
                    }}
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    Back to History
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      setIsPreviewing(false);
                      setIsVersionSidebarOpen(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h2 className="text-lg font-medium">
                    Version name: {selectedVersion || "Version"}
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Owner Info */}
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  {selectedVersion === "Draft" || selectedVersion === "v2.3.9" ? (
                    <Image
                      src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                      alt="Profile"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : selectedVersion === "v2.4.0" ? (
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">AC</span>
                    </div>
                  ) : selectedVersion === "v2.3.8" ? (
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">SM</span>
                    </div>
                  ) : null}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {selectedVersion === "Draft" || selectedVersion === "v2.3.9" 
                        ? "You" 
                        : selectedVersion === "v2.4.0" 
                        ? "Alex Chen" 
                        : selectedVersion === "v2.3.8" 
                        ? "Sarah Miller" 
                        : "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedVersion === "Draft" 
                        ? "Now" 
                        : selectedVersion === "v2.3.9" 
                        ? "2m ago" 
                        : selectedVersion === "v2.4.0" 
                        ? "2d ago" 
                        : selectedVersion === "v2.3.8" 
                        ? "1w ago" 
                        : ""}
                    </p>
                  </div>
                </div>
                {/* Currently Deployed Card */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Name of this version</h3>
                    <p className="text-lg font-semibold">{selectedVersion || "v2.3.9"}</p>
                  </div>
                  
                  {/* Changes from v2.4.0 */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Changes from v2.4.0</p>
                    <div className="flex items-center gap-3">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">47 files</span>
                      <span className="text-sm text-green-600 font-medium">+312</span>
                      <span className="text-sm text-red-600 font-medium">-89</span>
                    </div>
                  </div>
                </div>

                {/* Code Changes Diff */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Code Changes</h3>
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <div className="p-3 font-mono text-xs space-y-1">
                      <div className="flex">
                        <span className="text-gray-500 mr-4 select-none">1</span>
                        <span className="text-gray-700">{`{`}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 mr-4 select-none">2</span>
                        <span className="text-gray-700 ml-4">{`"api_url":`}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 mr-4 select-none">3</span>
                        <span className="text-red-600 line-through ml-8">{`"api.staging.liveoa.com"`}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 mr-4 select-none">4</span>
                        <span className="text-green-600 ml-8">{`"api.prod.liveoa.com"`}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 mr-4 select-none">5</span>
                        <span className="text-gray-700 ml-4">{`,`}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 mr-4 select-none">6</span>
                        <span className="text-gray-700 ml-4">{`"debug_mode":`}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 mr-4 select-none">7</span>
                        <span className="text-red-600 line-through ml-8">{`true`}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 mr-4 select-none">8</span>
                        <span className="text-green-600 ml-8">{`false`}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 mr-4 select-none">9</span>
                        <span className="text-gray-700">{`}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             </div>
           )}
        {isOlderVersionsOpen && (
          <div className="absolute top-0 right-0 h-full w-[320px] bg-white border-l border-border overflow-y-auto z-10">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-sm font-medium">Version history</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsOlderVersionsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <div className="space-y-0 relative">
                {/* Vertical line connecting dots */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
                
                {/* Restored Version - Show first */}
                {restoredVersion === "Draft" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                  <Image
                    src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                    alt="Profile"
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                  />
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">Draft</span>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> Now</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("Draft"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Cloud className="h-3.5 w-3.5 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("Draft");
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                {restoredVersion === "v2.3.9" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                  <Image
                    src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                    alt="Profile"
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                  />
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-green-500 border border-green-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v2.3.9</span>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> 2m ago</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v2.3.9"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Cloud className="h-3.5 w-3.5 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v2.3.9");
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                {restoredVersion === "v2.3.8" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">SM</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v2.3.8</span>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">Sarah Miller <span className="mx-0.5">·</span> 1w ago</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v2.3.8"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Cloud className="h-3.5 w-3.5 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v2.3.8");
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                {restoredVersion === "v2.3.7" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">AC</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v2.3.7</span>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">Alex Chen <span className="mx-0.5">·</span> 2w ago</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v2.3.7"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Cloud className="h-3.5 w-3.5 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v2.3.7");
                          setShowPublishDot(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                {restoredVersion === "v2.3.6" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                  <Image
                    src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                    alt="Profile"
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                  />
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v2.3.6</span>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> 3w ago</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v2.3.6"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Cloud className="h-3.5 w-3.5 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v2.3.6");
                          setShowPublishDot(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                {restoredVersion === "v2.3.5" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">SM</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v2.3.5</span>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">Sarah Miller <span className="mx-0.5">·</span> 1mo ago</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v2.3.5"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Cloud className="h-3.5 w-3.5 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v2.3.5");
                          setShowPublishDot(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                
                {/* v2.4.0 Version - Show first when approved (not rejected) */}
                {isPullRequestApproved && !isPullRequestRejected && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">AC</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-black border border-gray-500 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v2.4.0</span>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">Alex Chen <span className="mx-0.5">·</span> 2d ago</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v2.4.0"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Cloud className="h-3.5 w-3.5 mr-2" />
                          Review changes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setShowPublishedDot(false);
                          setIsPullRequestApproved(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <Check className="h-3.5 w-3.5 mr-2" />
                          Approve changes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setIsPullRequestRejected(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <X className="h-3.5 w-3.5 mr-2" />
                          Reject changes
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                
                {/* Draft Version - Hide if restored */}
                {restoredVersion !== "Draft" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                  <Image
                    src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                    alt="Profile"
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                  />
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">Draft</span>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> Now</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("Draft"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Cloud className="h-3.5 w-3.5 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("Draft");
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                
                {/* v2.4.0 Version - Show in original position when not approved and not rejected */}
                {!isPullRequestApproved && !isPullRequestRejected && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">AC</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-black border border-gray-500 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v2.4.0</span>
                      {!isPullRequestApproved && <span className="px-2 py-0.5 rounded-lg text-xs font-medium text-black bg-gray-200">Pull Request</span>}
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">Alex Chen <span className="mx-0.5">·</span> 2d ago</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v2.4.0"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Cloud className="h-3.5 w-3.5 mr-2" />
                          Review changes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setShowPublishedDot(false);
                          setIsPullRequestApproved(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <Check className="h-3.5 w-3.5 mr-2" />
                          Approve changes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setIsPullRequestRejected(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <X className="h-3.5 w-3.5 mr-2" />
                            Reject version
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            triggerConfetti();
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  
                  {/* v2.3.9 Live Version - Hide if restored */}
                  {restoredVersion !== "v2.3.9" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                  <Image
                    src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                    alt="Profile"
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                  />
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-green-500 border border-green-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v2.3.9</span>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> 2m ago</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v2.3.9"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Cloud className="h-3.5 w-3.5 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v2.3.9");
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                
                {/* v2.3.8 Version - Hide if restored */}
                {restoredVersion !== "v2.3.8" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">SM</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v2.3.8</span>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">Sarah Miller <span className="mx-0.5">·</span> 1w ago</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v2.3.8"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Cloud className="h-3.5 w-3.5 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v2.3.8");
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                
                {/* v2.3.7 Version - Hide if restored */}
                {restoredVersion !== "v2.3.7" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">AC</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v2.3.7</span>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">Alex Chen <span className="mx-0.5">·</span> 2w ago</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v2.3.7"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Cloud className="h-3.5 w-3.5 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v2.3.7");
                          setShowPublishDot(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                
                {/* v2.3.6 Version - Hide if restored */}
                {restoredVersion !== "v2.3.6" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                  <Image
                    src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                    alt="Profile"
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                  />
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v2.3.6</span>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> 3w ago</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v2.3.6"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Cloud className="h-3.5 w-3.5 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v2.3.6");
                          setShowPublishDot(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                
                {/* v2.3.5 Version - Hide if restored */}
                {restoredVersion !== "v2.3.5" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors ml-1">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">SM</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v2.3.5</span>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">Sarah Miller <span className="mx-0.5">·</span> 1mo ago</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v2.3.5"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Cloud className="h-3.5 w-3.5 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v2.3.5");
                          setShowPublishDot(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        )}
       </div>
 
       {/* Share Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Share the workflow</DialogTitle>
            <DialogDescription className="text-base mt-2">
              How would you like to share this workflow?
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {/* Option 1: Copy link to workflow builder */}
            <button
              onClick={() => {
                // Handle copy link to workflow builder
                setIsShareModalOpen(false)
              }}
              className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground">
                  <rect x="3" y="3" width="10" height="10" rx="2" />
                  <rect x="11" y="11" width="10" height="10" rx="2" />
                </svg>
              </div>
              <span className="text-sm font-medium text-center">Copy link to workflow builder</span>
            </button>

            {/* Option 2: Copy link to interface */}
            <button
              onClick={() => {
                // Handle copy link to interface
                setIsShareModalOpen(false)
              }}
              className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-center">Copy link to interface</span>
            </button>

            {/* Option 3: Export as a project */}
            <button
              onClick={() => {
                // Handle export as project
                setIsShareModalOpen(false)
              }}
              className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </div>
              <span className="text-sm font-medium text-center">Export as a project</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

