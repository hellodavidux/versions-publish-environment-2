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
  Globe,
  Save,
  Eye,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
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
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
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
  const [environment, setEnvironment] = React.useState("development")
  const [publishEnvironment, setPublishEnvironment] = React.useState("production")
  const [showPublishDot, setShowPublishDot] = React.useState(true)
  const [showPublishedDot, setShowPublishedDot] = React.useState(true)
  const [showReviewChangesDot, setShowReviewChangesDot] = React.useState(true)
  const [isPullRequestApproved, setIsPullRequestApproved] = React.useState(false)
  const [isPullRequestRejected, setIsPullRequestRejected] = React.useState(false)
  const [restoredVersion, setRestoredVersion] = React.useState<string | null>(null)
  const [currentDraftVersion, setCurrentDraftVersion] = React.useState<string>("v19")
  const [isAnimatingVersion, setIsAnimatingVersion] = React.useState<string | null>(null)
  const [isDescriptionOpen, setIsDescriptionOpen] = React.useState(false)
  const [isDescriptionInputOpen, setIsDescriptionInputOpen] = React.useState(false)
  const [description, setDescription] = React.useState("")
  const [hasPublishedWorkflow, setHasPublishedWorkflow] = React.useState(false)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [isOlderVersionsOpen, setIsOlderVersionsOpen] = React.useState(false)
  const [publishedVersion, setPublishedVersion] = React.useState<string>("v16")
  const [isEnvironmentSelectorOpen, setIsEnvironmentSelectorOpen] = React.useState(false)
  const [hasOpenedEnvironmentDropdown, setHasOpenedEnvironmentDropdown] = React.useState(false)
  const { toast } = useToast()

  // Trigger animation when a version is restored
  React.useEffect(() => {
    if (restoredVersion && restoredVersion !== "Draft") {
      setIsAnimatingVersion(restoredVersion)
      // Clear animation state after animation completes (800ms animation duration)
      const timer = setTimeout(() => {
        setIsAnimatingVersion(null)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [restoredVersion])

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  return (
    <>
      <Toaster />
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="h-8 w-8 bg-muted hover:bg-muted/70 cursor-pointer transition-colors">
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white text-foreground border border-border" hideArrow sideOffset={8}>
              <p>Save</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenu onOpenChange={(open) => {
            if (open) {
              setHasOpenedEnvironmentDropdown(true)
            }
          }}>
            <Tooltip>
              <TooltipTrigger asChild>
                {!hasOpenedEnvironmentDropdown ? (
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8 bg-muted hover:bg-muted/70 cursor-pointer transition-colors">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                ) : (
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8 bg-muted hover:bg-muted/70 cursor-pointer transition-colors">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                )}
              </TooltipTrigger>
              <TooltipContent className="bg-white text-foreground border border-border" hideArrow sideOffset={8}>
                <p>Select environment</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-muted-foreground font-normal">Select Environment</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setEnvironment("development")}>
                <div className="flex items-center justify-between w-full">
                  <span>Development</span>
                  {environment === "development" && <Check className="h-4 w-4" />}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEnvironment("production")}>
                <div className="flex items-center justify-between w-full">
                  <span>Production</span>
                  {environment === "production" && <Check className="h-4 w-4" />}
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover open={isDraftOpen} onOpenChange={setIsDraftOpen}>
            <Tooltip open={!isDraftOpen ? undefined : false}>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button 
                    variant={isPublished ? "outline" : "ghost"} 
                    size="icon-sm" 
                    className={`h-8 w-18 gap-1 cursor-pointer transition-colors relative px-1.5 ${
                      isPublished 
                        ? "bg-white hover:bg-white border-border" 
                        : "bg-muted hover:bg-muted/70"
                    }`}
                  >
                    <div className={`h-2 w-2 rounded-full border ${isPublished ? 'bg-green-500 border-green-300' : 'bg-gray-400 border-gray-300'}`}></div>
                    <span className="text-muted-foreground">{isPublished && publishedVersion !== "Draft" ? publishedVersion : "Draft"}</span>
                    {showPublishedDot && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-black border-2 border-gray-200"></span>}
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent className="bg-white text-foreground border border-border" hideArrow sideOffset={8}>
                <p>Change published status and versions</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent align="end" className="w-80 p-0" sideOffset={12}>
              <div className="px-4 py-3 bg-gray-100 border">
                <div className="group relative flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-2 w-2 rounded-full border flex-shrink-0 ${isPublished ? 'bg-green-500 border-green-300' : 'bg-gray-400 border-gray-300'}`}></div>
                      <span className="font-medium text-sm text-muted-foreground">{publishedVersion}</span>
                      <span className="px-2 py-0.5 rounded-lg text-xs font-normal text-muted-foreground   flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Production
                      </span>
                    </div>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Switch 
                          checked={isPublished} 
                          onCheckedChange={(checked) => {
                            setIsPublished(checked)
                            toast({
                              title: checked ? "Project published" : "Project unpublished",
                              description: checked ? "This project is now published" : "This project is now unpublished",
                            })
                          }} 
                          className="cursor-pointer scale-125"
                        >
                          <Cloud className="h-3 w-3 text-gray-500" />
                        </Switch>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-foreground border border-border" hideArrow sideOffset={8}>
                      <p>{isPublished ? "Unpublish this version" : "Republish version"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase mb-2">Version history</h3>
                <div className="space-y-0 relative">
                  {/* Restored Version - Show first when restored/approved */}
                   {restoredVersion && restoredVersion !== "Draft" && (
                   <div className={`group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 ${
                     isAnimatingVersion === restoredVersion 
                       ? 'animate-slideUp' 
                       : ''
                   }`}>
                     {restoredVersion === "v16" || restoredVersion === "v13" ? (
                       <Image
                         src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                         alt="Profile"
                         width={24}
                         height={24}
                         className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                       />
                     ) : restoredVersion === "v15" || restoredVersion === "v17" || restoredVersion === "v12" ? (
                       <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                         <span className="text-[10px] font-medium text-gray-600">SM</span>
                       </div>
                     ) : restoredVersion === "v18" || restoredVersion === "v14" ? (
                       <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                         <span className="text-[10px] font-medium text-gray-600">AC</span>
                       </div>
                     ) : (
                       <Image
                         src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                         alt="Profile"
                         width={24}
                         height={24}
                         className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                       />
                     )}
                     <div className="flex-1 min-w-0 -ml-2">
                       <div className="flex items-center gap-1.5">
                         <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                         <span className="font-normal text-sm text-muted-foreground">{restoredVersion}</span>
                         <span className="px-2 py-0.5 rounded-full text-xs font-medium text-gray-600 bg-gray-200 flex items-center gap-1">Draft</span>
                       </div>
                       <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> current</span>
                     </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setPublishedVersion("Draft");
                            setIsPublished(true);
                            setIsDraftOpen(false);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  {false && restoredVersion === "v16" && (
                  <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Image
                      src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                      alt="Profile"
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                    />
                    <div className="flex-1 min-w-0 -ml-2">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full border flex-shrink-0 ${isPublished ? 'bg-green-500 border-green-300' : 'bg-gray-400 border-gray-300'}`}></div>
                        <span className="font-normal text-sm text-muted-foreground">v16</span>
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
                          <DropdownMenuItem onClick={() => { setSelectedVersion("v16"); setIsDraftOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            View version
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setRestoredVersion("v16");
                            setCurrentDraftVersion("v16");
                            setShowPublishDot(true);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <RotateCw className="h-3.5 w-3.5 mr-2" />
                            Restore version as draft
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            triggerConfetti();
                            setIsPublished(false);
                            toast({
                              title: "Project unpublished",
                              description: "This project is now unpublished",
                            })
                          }}>
                            <div className="relative h-3.5 w-3.5 mr-2">
                              <Cloud className="h-3.5 w-3.5" />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="h-[18px] w-[1.5px] bg-foreground rotate-45 origin-center"></div>
                              </div>
                            </div>
                            Unpublish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  
                  {/* Draft Version v19 - Always show as second item */}
                  <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Image
                      src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                      alt="Profile"
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                    />
                    <div className="flex-1 min-w-0 -ml-2">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full border flex-shrink-0 ${currentDraftVersion === "v19" ? 'bg-gray-400 border-gray-300' : 'bg-gray-400 border-gray-300'}`}></div>
                        <span className="font-normal text-sm text-muted-foreground">v19</span>
                        {currentDraftVersion === "v19" && <span className="px-2 py-0.5 rounded-full text-xs font-medium text-gray-600 bg-gray-200 flex items-center gap-1">Draft</span>}
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> Now <span className="mx-0.5">·</span> <Globe className="h-3 w-3 inline-block mr-1 align-middle" /> Development</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setPublishedVersion("v18");
                            setIsPublished(true);
                            setIsDraftOpen(false);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {false && restoredVersion === "v15" && (
                  <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                      <span className="text-[10px] font-medium text-gray-600">SM</span>
                    </div>
                    <div className="flex-1 min-w-0 -ml-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                        <span className="font-normal text-sm text-muted-foreground">v15</span>
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">Sarah Miller <span className="mx-0.5">·</span> 3m ago</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedVersion("v15"); setIsDraftOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            View version
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setRestoredVersion("v15");
                            setCurrentDraftVersion("v15");
                            setShowPublishDot(true);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <RotateCw className="h-3.5 w-3.5 mr-2" />
                            Restore version as draft
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setPublishedVersion("v18");
                            setIsPublished(true);
                            setIsDraftOpen(false);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  {false && restoredVersion === "v17" && (
                  <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                      <span className="text-[10px] font-medium text-gray-600">SM</span>
                    </div>
                    <div className="flex-1 min-w-0 -ml-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                        <span className="font-normal text-sm text-muted-foreground">v17</span>
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">Sarah Miller <span className="mx-0.5">·</span> m ago</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedVersion("v17"); setIsDraftOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            View version
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setRestoredVersion("v17");
                            setCurrentDraftVersion("v17");
                            setShowPublishDot(true);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <RotateCw className="h-3.5 w-3.5 mr-2" />
                            Restore version as draft
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setPublishedVersion("v18");
                            setIsPublished(true);
                            setIsDraftOpen(false);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  
                  {/* v18 Version - Show first when approved but not restored */}
                  {isPullRequestApproved && restoredVersion !== "v18" && (
                   <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                     <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                       <span className="text-[10px] font-medium text-gray-600">AC</span>
                     </div>
                     <div className="flex-1 min-w-0 -ml-2">
                       <div className="flex items-center gap-1.5">
                         <div className="h-2 w-2 rounded-full bg-black border border-gray-500 flex-shrink-0"></div>
                         <span className="font-normal text-sm text-muted-foreground">v18</span>
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
                          <DropdownMenuItem onClick={() => { setSelectedVersion("v18"); setIsDraftOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            Review Changes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setShowPublishedDot(false);
                            setIsPullRequestApproved(true);
                            setRestoredVersion("v18");
                            setCurrentDraftVersion("v18");
                            setShowPublishDot(true);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <Check className="h-3.5 w-3.5 mr-2" />
                            Accept as a draft
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setPublishedVersion("v18");
                            setIsPublished(true);
                            setIsDraftOpen(false);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  
                  {/* v18 Version - Show in original position when not approved, not rejected, and not restored */}
                  {!isPullRequestApproved && !isPullRequestRejected && restoredVersion !== "v18" && (
                  <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                      <span className="text-[10px] font-medium text-gray-600">AC</span>
                    </div>
                    <div className="flex-1 min-w-0 -ml-2">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full border flex-shrink-0 ${isPullRequestApproved ? 'bg-gray-400 border-gray-300' : 'bg-black border-gray-500'}`}></div>
                        <span className="font-normal text-sm text-muted-foreground">v18</span>
                        {!isPullRequestApproved && <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gray-800 flex items-center gap-1"><GitBranch className="h-3 w-3 text-white" />Pull Request</span>}
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
                          <DropdownMenuItem onClick={() => { setSelectedVersion("v18"); setIsDraftOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            Review Changes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setShowPublishedDot(false);
                            setIsPullRequestApproved(true);
                            setRestoredVersion("v18");
                            setCurrentDraftVersion("v18");
                            setShowPublishDot(true);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <Check className="h-3.5 w-3.5 mr-2" />
                            Accept as a draft
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setIsPullRequestRejected(true);
                            setShowPublishedDot(false);
                          }}>
                            <X className="h-3.5 w-3.5 mr-2" />
                            Reject Changes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setIsDraftOpen(false);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  
                  {/* v16 Live Version - Hide if restored */}
                  {restoredVersion !== "v16" && (
                  <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Image
                      src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                      alt="Profile"
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                    />
                    <div className="flex-1 min-w-0 -ml-2">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full border flex-shrink-0 ${isPublished ? 'bg-green-500 border-green-300' : 'bg-gray-400 border-gray-300'}`}></div>
                        <span className="font-normal text-sm text-muted-foreground">v16</span>
                        {isPublished && <span className="px-2 py-0.5 rounded-full text-xs font-medium text-green-600 bg-green-100 flex items-center gap-1">Published</span>}
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> 2m ago <span className="mx-0.5">·</span> <Globe className="h-3 w-3 inline-block mr-1 align-middle" /> Production</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { 
                            setSelectedVersion("v16"); 
                            setIsDraftOpen(false); 
                            setIsVersionSidebarOpen(true); 
                            setIsPreviewing(true); 
                          }}>
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            View version
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            triggerConfetti();
                            setIsPublished(false);
                            toast({
                              title: "Project unpublished",
                              description: "This project is now unpublished",
                            })
                          }}>
                            <div className="relative h-3.5 w-3.5 mr-2">
                              <Cloud className="h-3.5 w-3.5" />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="h-[18px] w-[1.5px] bg-foreground rotate-45 origin-center"></div>
                              </div>
                            </div>
                            Unpublish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  
                  {/* v15 Version - Hide if restored */}
                  {restoredVersion !== "v15" && (
                  <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                      <span className="text-[10px] font-medium text-gray-600">SM</span>
                    </div>
                    <div className="flex-1 min-w-0 -ml-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                        <span className="font-normal text-sm text-muted-foreground">v15</span>
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">Sarah Miller <span className="mx-0.5">·</span> 3m ago</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedVersion("v15"); setIsDraftOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            View version
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setRestoredVersion("v15");
                            setCurrentDraftVersion("v15");
                            setShowPublishDot(true);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <RotateCw className="h-3.5 w-3.5 mr-2" />
                            Restore version as draft
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setIsDraftOpen(false);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  
                  {/* v17 Version - Sarah Miller duplicate */}
                  {restoredVersion !== "v17" && (
                  <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                      <span className="text-[10px] font-medium text-gray-600">SM</span>
                    </div>
                    <div className="flex-1 min-w-0 -ml-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                        <span className="font-normal text-sm text-muted-foreground">v17</span>
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">Sarah Miller <span className="mx-0.5">·</span> m ago</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedVersion("v17"); setIsDraftOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            View version
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setRestoredVersion("v17");
                            setCurrentDraftVersion("v17");
                            setShowPublishDot(true);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <RotateCw className="h-3.5 w-3.5 mr-2" />
                            Restore version as draft
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setIsDraftOpen(false);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
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
                  View all versions
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
              <Tooltip open={!isPublishOpen ? undefined : false}>
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
            <PopoverContent align="end" className="w-72 p-0" sideOffset={12}>
              <div className="space-y-0 w-full">
                  <div className="px-4 py-3 bg-gray-100 border flex items-center justify-between">
                    <div className="text-xs text-muted-foreground ">Last Published<span className="mx-0.5">·</span> {publishedVersion} <span className="mx-0.5">·</span> 1m ago</div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Switch 
                            checked={isPublished} 
                            onCheckedChange={(checked) => {
                              setIsPublished(checked)
                              toast({
                                title: checked ? "Project published" : "Project unpublished",
                                description: checked ? "This project is now published" : "This project is now unpublished",
                              })
                            }} 
                            className="cursor-pointer scale-125"
                          >
                            <Cloud className="h-3 w-3 text-gray-500" />
                          </Switch>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white text-foreground border border-border" hideArrow sideOffset={8}>
                        <p>{isPublished ? "Unpublish version" : "Republish version"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="px-2 py-2 w-full">
                    <div className="w-full">
                      <button 
                        className="w-full flex items-center gap-2 text-sm text-foreground hover:bg-muted/50 transition-colors text-left py-1.5 px-2 rounded-md "
                        onClick={() => {
                          setShowPublishDot(false);
                          setShowReviewChangesDot(false);
                        }}
                      >
                        <Link2 className="h-4 w-4" />
                        <span className="">Review Changes</span>
                        {showReviewChangesDot && <span className="h-3 w-3 rounded-full bg-black border-2 border-gray-200 flex-shrink-0"></span>}
                      </button>
                    </div>
                    <div className="w-full">
                      <div className="space-y-2.5 w-full">
                        <button 
                          className="w-full flex items-center gap-2 text-sm text-foreground hover:bg-muted/50 transition-colors text-left py-1.5 px-2 rounded-md "
                          onClick={() => setIsDescriptionInputOpen(!isDescriptionInputOpen)}
                        >
                          <Plus className="h-4 w-4" />
                          Add description
                        </button>
                        {isDescriptionInputOpen && (
                          <div className="space-y-2 px-2 -mx-2">
                            <Textarea
                              placeholder="Add a description..."
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className="min-h-[100px] resize-none text-sm"
                              autoFocus
                            />
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-full"
                              onClick={() => setIsDescriptionInputOpen(false)}
                            >
                              Done
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button 
                            className="w-full flex items-center gap-2 text-sm text-foreground hover:bg-muted/50 transition-colors text-left py-1.5 px-2 rounded-md "
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                              <path d="M2 12h20"/>
                            </svg>
                            <span className="text-sm text-foreground font-normal capitalize">{publishEnvironment}</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                          <DropdownMenuLabel className="text-muted-foreground font-normal">Select environment</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setPublishEnvironment("development")}>
                            <div className="flex items-center justify-between w-full">
                              <span>Development</span>
                              {publishEnvironment === "development" && <Check className="h-4 w-4" />}
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setPublishEnvironment("production")}>
                            <div className="flex items-center justify-between w-full">
                              <span>Production</span>
                              {publishEnvironment === "production" && <Check className="h-4 w-4" />}
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
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
                      Publish changes
                    </Button>
                  </div>
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
                {selectedVersion === "v18" ? (
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
                  {selectedVersion === "Draft" || selectedVersion === "v16" ? (
                    <Image
                      src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                      alt="Profile"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : selectedVersion === "v18" ? (
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">AC</span>
                    </div>
                  ) : selectedVersion === "v15" ? (
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">SM</span>
                    </div>
                  ) : null}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {selectedVersion === "Draft" || selectedVersion === "v16" 
                        ? "You" 
                        : selectedVersion === "v18" 
                        ? "Alex Chen" 
                        : selectedVersion === "v15" 
                        ? "Sarah Miller" 
                        : "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedVersion === "Draft" 
                        ? "current" 
                        : selectedVersion === "v16" 
                        ? "2m ago" 
                        : selectedVersion === "v18" 
                        ? "2d ago" 
                        : selectedVersion === "v15" 
                        ? "1w ago" 
                        : ""}
                    </p>
                  </div>
                </div>
                {/* Currently Deployed Card */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Name of this version</h3>
                    <p className="text-lg font-semibold">{selectedVersion || "v16"}</p>
                  </div>
                  
                  {/* Changes from v18 */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Changes from v18</p>
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
                {/* Restored Version - Show first when restored/approved */}
                {restoredVersion && restoredVersion !== "Draft" && (
                <div className={`group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 ${
                  isAnimatingVersion === restoredVersion 
                    ? 'animate-slideUp' 
                    : ''
                }`}>
                  {restoredVersion === "v16" ? (
                    <Image
                      src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                      alt="Profile"
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                    />
                  ) : restoredVersion === "v15" || restoredVersion === "v17" ? (
                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                      <span className="text-[10px] font-medium text-gray-600">SM</span>
                    </div>
                  ) : restoredVersion === "v18" ? (
                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                      <span className="text-[10px] font-medium text-gray-600">AC</span>
                    </div>
                  ) : (
                    <Image
                      src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                      alt="Profile"
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                    />
                  )}
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">{restoredVersion}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium text-gray-600 bg-gray-200 border border-gray-300 flex items-center gap-1">Draft</span>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> current</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setIsOlderVersionsOpen(false);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <Cloud className="h-3.5 w-3.5 mr-2" />
                          Publish version
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                
                {/* Draft Version v19 - Always show as second item */}
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Image
                    src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                    alt="Profile"
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                  />
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-2 w-2 rounded-full border flex-shrink-0 ${currentDraftVersion === "v19" ? 'bg-blue-500 border-blue-300' : 'bg-gray-500 border-gray-300'}`}></div>
                      <span className="font-normal text-sm text-muted-foreground">v19</span>
                      {currentDraftVersion === "v19" && <span className="px-2 py-0.5 rounded-full text-xs font-medium text-blue-500 bg-blue-50 flex items-center gap-1">Draft</span>}
                    </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> current <span className="mx-0.5">·</span> <Globe className="h-3 w-3 inline-block mr-1 align-middle" /> Development</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setIsOlderVersionsOpen(false);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                
                {false && restoredVersion === "v16" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
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
                      <span className="font-normal text-sm text-muted-foreground">v16</span>
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> 2m ago <span className="mx-0.5">·</span> <Globe className="h-3 w-3 inline mr-1" /> rProduction</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v16"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          View version
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v16");
                          setCurrentDraftVersion("v16");
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version as draft
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                {false && restoredVersion === "v15" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">SM</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v15</span>
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
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v15"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          View version
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v15");
                          setCurrentDraftVersion("v15");
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version as draft
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                {false && restoredVersion === "v14" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">AC</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v14</span>
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
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v14"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          View version
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v14");
                            setCurrentDraftVersion("v14");
                            setShowPublishDot(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version as draft
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                {false && restoredVersion === "v13" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
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
                      <span className="font-normal text-sm text-muted-foreground">v13</span>
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
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v13"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          View version
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v13");
                            setCurrentDraftVersion("v13");
                            setShowPublishDot(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version as draft
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                {false && restoredVersion === "v12" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">SM</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v12</span>
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
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v12"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          View version
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v12");
                            setCurrentDraftVersion("v12");
                            setShowPublishDot(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version as draft
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                
                {/* v18 Version - Show first when approved (not rejected) but not restored */}
                {isPullRequestApproved && !isPullRequestRejected && restoredVersion !== "v18" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">AC</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-black border border-gray-500 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v18</span>
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
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v18"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          Review Changes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setShowPublishedDot(false);
                          setIsPullRequestApproved(true);
                          setRestoredVersion("v18");
                          setCurrentDraftVersion("v18");
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
                
                {/* v18 Version - Show in original position when not approved, not rejected, and not restored */}
                {!isPullRequestApproved && !isPullRequestRejected && restoredVersion !== "v18" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">AC</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-black border border-gray-500 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v18</span>
                      {!isPullRequestApproved && <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gray-800 border border-gray-500 flex items-center gap-1"><GitBranch className="h-3 w-3 text-white" />Pull Request</span>}
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
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v18"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          Review Changes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setShowPublishedDot(false);
                          setIsPullRequestApproved(true);
                          setRestoredVersion("v18");
                          setCurrentDraftVersion("v18");
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
                            Reject Changes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setIsDraftOpen(false);
                            setIsRefreshing(true);
                            setTimeout(() => setIsRefreshing(false), 600);
                          }}>
                            <Cloud className="h-3.5 w-3.5 mr-2" />
                            Publish version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  
                  {/* v16 Live Version - Hide if restored */}
                  {restoredVersion !== "v16" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Image
                    src="https://ca.slack-edge.com/T03V7MR4L9Y-U0451BQJQLD-917cf565ddd2-512"
                    alt="Profile"
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover flex-shrink-0 ml-2 -ml-2 mr-2"
                  />
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-2 w-2 rounded-full border flex-shrink-0 ${isPublished ? 'bg-green-500 border-green-300' : 'bg-gray-400 border-gray-300'}`}></div>
                      <span className="font-normal text-sm text-muted-foreground">v16</span>
                      {isPublished && <span className="px-2 py-0.5 rounded-full text-xs font-medium text-green-600 bg-green-100 border border-green-300 flex items-center gap-1">Published</span>}
                    </div>
                    <span className="text-xs text-muted-foreground block mt-0.5">You <span className="mx-0.5">·</span> 2m ago <span className="mx-0.5">·</span> <Globe className="h-3 w-3 inline mr-1" /> rProduction</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v16"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          View version
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v16");
                          setCurrentDraftVersion("v16");
                          setShowPublishDot(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version as draft
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          triggerConfetti();
                          setIsPublished(false);
                          toast({
                            title: "Project unpublished",
                            description: "This project is now unpublished",
                          })
                        }}>
                          <div className="relative h-3.5 w-3.5 mr-2">
                            <Cloud className="h-3.5 w-3.5" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="h-[18px] w-[1.5px] bg-foreground rotate-45 origin-center"></div>
                            </div>
                          </div>
                          Unpublish version
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                
                {/* v15 Version - Hide if restored */}
                {restoredVersion !== "v15" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">SM</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v15</span>
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
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v15"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          View version
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v15");
                          setCurrentDraftVersion("v15");
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version as draft
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                
                {/* v14 Version - Hide if restored */}
                {restoredVersion !== "v14" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">AC</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v14</span>
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
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v14"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          View version
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v14");
                            setCurrentDraftVersion("v14");
                            setShowPublishDot(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version as draft
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                
                {/* v13 Version - Hide if restored */}
                {restoredVersion !== "v13" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
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
                      <span className="font-normal text-sm text-muted-foreground">v13</span>
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
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v13"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          View version
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v13");
                            setCurrentDraftVersion("v13");
                            setShowPublishDot(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version as draft
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                )}
                
                {/* v12 Version - Hide if restored */}
                {restoredVersion !== "v12" && (
                <div className="group relative flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2 -ml-2 mr-2">
                    <span className="text-[10px] font-medium text-gray-600">SM</span>
                  </div>
                  <div className="flex-1 min-w-0 -ml-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
                      <span className="font-normal text-sm text-muted-foreground">v12</span>
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
                        <DropdownMenuItem onClick={() => { setSelectedVersion("v12"); setIsOlderVersionsOpen(false); setIsVersionSidebarOpen(true); setIsPreviewing(true); }}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          View version
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setRestoredVersion("v12");
                            setCurrentDraftVersion("v12");
                            setShowPublishDot(true);
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 600);
                        }}>
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Restore version as draft
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
    <Toaster />
    </>
  )
}

