"use client"

import React, { useState, useEffect, useRef } from "react"
import { ReactFlow, Background, ReactFlowProvider, useNodesState, useEdgesState, useReactFlow } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { DashboardLayout } from "@/components/dashboard-layout"
import WorkflowNode from "@/components/workflow-node"
import { NodeSettingsSidebar } from "@/components/node-settings-sidebar"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Link2, Play, Zap, StickyNote, Clipboard, ClipboardX, Square } from "lucide-react"
import type { Node } from "@xyflow/react"
import type { WorkflowNodeData, SelectedAction } from "@/lib/types"

const nodeTypes = {
  workflowNode: WorkflowNode,
}

function FlowCanvas({
  onActionSelectRef,
  onOpenNodeSelectorRef,
}: {
  onActionSelectRef: React.MutableRefObject<((action: SelectedAction) => void) | null>
  onOpenNodeSelectorRef: React.MutableRefObject<((position: { x: number; y: number }, source?: "handle" | "replace", tab?: string) => void) | null>
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [selectedNodeData, setSelectedNodeData] = useState<{
    id: string
    appName: string
    actionName: string
    description: string
    type?: "trigger" | "action"
  } | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const { screenToFlowPosition, getViewport } = useReactFlow()

  const handleActionSelect = (action: SelectedAction, sourceNodeId?: string, side?: "left" | "right") => {
    // Check if we're replacing a node
    const replaceNodeId = (window as any).__replaceNodeId
    if (replaceNodeId) {
      // Replace the existing node
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === replaceNodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                appName: action.appName,
                actionName: action.actionName,
                description: action.description,
                type: action.type,
                version: "v1.0.0",
                onDeleteNode: handleDeleteNode,
              },
            }
          }
          return node
        })
      )
      delete (window as any).__replaceNodeId
      return
    }

    let newNodePosition = { x: 0, y: 0 }
    
    if (sourceNodeId && side) {
      // Position next to the source node
      const sourceNode = nodes.find((n) => n.id === sourceNodeId)
      if (sourceNode) {
        const offsetX = side === "right" ? 450 : -450 // Position to the right or left
        newNodePosition = {
          x: sourceNode.position.x + offsetX,
          y: sourceNode.position.y,
        }
      }
    } else {
      // Create a new node at the center of the viewport
      const viewportWidth = window.innerWidth - 48 // Subtract sidebar width
      const viewportHeight = window.innerHeight - 56 // Subtract top bar height
      newNodePosition = {
        x: viewportWidth / 2 - 190, // Approximate center accounting for node width (380px)
        y: viewportHeight / 2 - 100, // Approximate center accounting for node height
      }
    }

    const newNodeData: WorkflowNodeData = {
      appName: action.appName,
      actionName: action.actionName,
      description: action.description,
      type: action.type,
      version: "v1.0.0",
      onDeleteNode: handleDeleteNode,
    }

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: "workflowNode",
      position: newNodePosition,
      data: newNodeData,
    }

    setNodes((nds) => [...nds, newNode])
  }

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId))
    setEdges((eds) => eds.filter((e: any) => e.source !== nodeId && e.target !== nodeId))
    if (selectedNodeData?.id === nodeId) {
      setIsSidebarOpen(false)
      setSelectedNodeData(null)
    }
  }

  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    if (node.type === "workflowNode") {
      const data = node.data as WorkflowNodeData
      setSelectedNodeData({
        id: node.id,
        appName: data.appName,
        actionName: data.actionName,
        description: data.description,
        type: data.type,
      })
      setIsSidebarOpen(true)
    }
  }

  const handlePaneClick = () => {
    setIsSidebarOpen(false)
    setSelectedNodeData(null)
    setContextMenuPosition(null)
  }

  // Store the last mouse position for context menu
  const lastMousePosition = useRef<{ x: number; y: number } | null>(null)
  
  const handleMouseMove = (event: React.MouseEvent) => {
    lastMousePosition.current = { x: event.clientX, y: event.clientY }
  }
  
  const handleContextMenuOpenChange = (open: boolean) => {
    if (open && lastMousePosition.current) {
      setContextMenuPosition(lastMousePosition.current)
    }
  }

  const handleAddNode = (event?: React.MouseEvent) => {
    // Get the current mouse position or use stored context menu position
    let position: { x: number; y: number } | null = null
    
    if (event) {
      // Use the event position if available
      position = { x: event.clientX, y: event.clientY }
    } else if (contextMenuPosition) {
      // Fallback to stored context menu position
      position = contextMenuPosition
    }
    
    // Open node selector at cursor position
    if (position) {
      // Position is already in screen coordinates
      if (onOpenNodeSelectorRef.current) {
        // Direct screen coordinates for the ref function
        onOpenNodeSelectorRef.current({ x: position.x, y: position.y }, "handle")
      } else if ((window as any).__openNodeSelector) {
        // Fallback: convert screen to flow coordinates for window function
        const flowPosition = screenToFlowPosition({
          x: position.x,
          y: position.y,
        })
        ;(window as any).__openNodeSelector(flowPosition, "handle")
      }
    }
    setContextMenuPosition(null)
  }

  const handleAddAction = () => {
    // Open node selector in Actions & Outputs tab at cursor position
    if (contextMenuPosition) {
      // Use screen coordinates directly
      if (onOpenNodeSelectorRef.current) {
        onOpenNodeSelectorRef.current({ x: contextMenuPosition.x, y: contextMenuPosition.y }, "handle", "Core Nodes")
      } else if ((window as any).__openNodeSelector) {
        // Fallback: convert screen to flow coordinates for window function
        const flowPosition = screenToFlowPosition({
          x: contextMenuPosition.x,
          y: contextMenuPosition.y,
        })
        ;(window as any).__openNodeSelector(flowPosition, "handle", "Core Nodes")
      }
    }
    setContextMenuPosition(null)
  }

  const handleAddTrigger = () => {
    // Open node selector in Triggers tab at cursor position
    if (contextMenuPosition) {
      // Use screen coordinates directly
      if (onOpenNodeSelectorRef.current) {
        onOpenNodeSelectorRef.current({ x: contextMenuPosition.x, y: contextMenuPosition.y }, "handle", "Triggers")
      } else if ((window as any).__openNodeSelector) {
        // Fallback: convert screen to flow coordinates for window function
        const flowPosition = screenToFlowPosition({
          x: contextMenuPosition.x,
          y: contextMenuPosition.y,
        })
        ;(window as any).__openNodeSelector(flowPosition, "handle", "Triggers")
      }
    }
    setContextMenuPosition(null)
  }

  const handleAddNote = () => {
    // Create a note node at cursor position
    if (contextMenuPosition) {
      const position = screenToFlowPosition({
        x: contextMenuPosition.x,
        y: contextMenuPosition.y,
      })
      
      const newNodeData: WorkflowNodeData = {
        appName: "Note",
        actionName: "Note",
        description: "A note",
        type: "action",
        version: "v1.0.0",
        onDeleteNode: handleDeleteNode,
      }
      
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: "workflowNode",
        position,
        data: newNodeData,
      }
      
      setNodes((nds) => [...nds, newNode])
    }
    setContextMenuPosition(null)
  }

  const handlePaste = () => {
    // TODO: Implement paste functionality
    setContextMenuPosition(null)
  }

  const handleClearClipboard = () => {
    // TODO: Implement clear clipboard functionality
    setContextMenuPosition(null)
  }

  const handleRun = () => {
    // TODO: Implement run functionality
    setContextMenuPosition(null)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (event: React.DragEvent) => {
      event.preventDefault()

      const data = event.dataTransfer.getData("application/reactflow")
    
      if (!data) return

    try {
      const action: SelectedAction = JSON.parse(data)
      
      // Calculate position in flow coordinates
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      
      const nodeId = `node-${Date.now()}`
      const newNodeData: WorkflowNodeData = {
        appName: action.appName,
        actionName: "", // Leave empty so user must select an action
        description: "",
        type: action.type,
        version: "v1.0.0",
        onDeleteNode: handleDeleteNode,
      }
      
      const newNode: Node = {
        id: nodeId,
        type: "workflowNode",
        position,
        data: newNodeData,
      }
      
      setNodes((nds) => [...nds, newNode])
      
      // Open the configuration sidebar for the new node without a selected action
      setSelectedNodeData({
        id: nodeId,
        appName: action.appName,
        actionName: "", // Leave empty so user must select an action
        description: "",
        type: action.type,
      })
      setIsSidebarOpen(true)
    } catch (error) {
      console.error("Error parsing drag data:", error)
    }
  }

  const handleNodeUpdate = (
    nodeId: string,
    data: { appName: string; actionName: string; description: string; type: "trigger" | "action" }
  ) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== nodeId) return node
        return {
          ...node,
          data: {
            ...node.data,
            appName: data.appName,
            actionName: data.actionName,
            description: data.description,
            type: data.type,
            onDeleteNode: handleDeleteNode,
          },
        }
      })
    )
    // Update the sidebar data
    if (selectedNodeData?.id === nodeId) {
      setSelectedNodeData({
        id: nodeId,
        appName: data.appName,
        actionName: data.actionName,
        description: data.description,
        type: data.type,
      })
    }
  }

  useEffect(() => {
    onActionSelectRef.current = (action: SelectedAction) => {
      const sourceInfo = (window as any).__handleClickSourceNode
      if (sourceInfo) {
        handleActionSelect(action, sourceInfo.nodeId, sourceInfo.side)
        delete (window as any).__handleClickSourceNode
      } else {
        handleActionSelect(action)
      }
    }
  }, [onActionSelectRef, nodes])

  const handleOpenNodeSelector = (position: { x: number; y: number }, source: "handle" | "replace" = "handle", tab?: string) => {
    if (onOpenNodeSelectorRef.current) {
      // Convert flow position to screen position
      const viewport = getViewport()
      const screenX = (position.x * viewport.zoom) + viewport.x + 48 // Add sidebar width
      const screenY = (position.y * viewport.zoom) + viewport.y + 56 // Add top bar height
      onOpenNodeSelectorRef.current({ x: screenX, y: screenY }, source, tab)
    }
  }

  useEffect(() => {
    ;(window as any).__openNodeSelector = handleOpenNodeSelector
  }, [])

  // Handle Command+K keyboard shortcut to open node selector
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Command+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        
        // Get viewport center position
        const viewportWidth = window.innerWidth - 48 // Subtract sidebar width
        const viewportHeight = window.innerHeight - 56 // Subtract top bar height
        const centerX = viewportWidth / 2
        const centerY = viewportHeight / 2
        
        // Open node selector at center of viewport
        if (onOpenNodeSelectorRef.current) {
          onOpenNodeSelectorRef.current({ x: centerX, y: centerY }, "handle")
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onOpenNodeSelectorRef])

  useEffect(() => {
    if (!isInitialized) {
      // Center the default workflow node on the canvas
      // Position it at the center of the viewport (accounting for sidebar width ~44px)
      const viewportWidth = window.innerWidth - 44 // Subtract sidebar width
      const viewportHeight = window.innerHeight - 56 // Subtract top bar height
      const centerX = viewportWidth / 2 - 190 // Approximate center accounting for node width (380px)
      const centerY = viewportHeight / 2 - 100 // Approximate center accounting for node height
      
      const defaultNodeData: WorkflowNodeData = {
        appName: "Slack",
        actionName: "On App Mention",
        description: "Triggered when your app is mentioned in a channel",
        type: "trigger",
        version: "v1.0.0",
        onDeleteNode: handleDeleteNode,
      }
      
      const defaultNode: Node = {
        id: "default-node",
        type: "workflowNode",
        position: { x: Math.max(0, centerX), y: Math.max(0, centerY) },
        data: defaultNodeData,
      }
      setNodes([defaultNode])
      setIsInitialized(true)
    }
  }, [isInitialized, setNodes])

  return (
    <>
      <ContextMenu onOpenChange={handleContextMenuOpenChange}>
        <ContextMenuTrigger asChild>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onMouseMove={handleMouseMove}
            className="w-full h-full"
          >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
              defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
          className="bg-muted/30"
        >
          <Background gap={20} size={1} />
        </ReactFlow>
      </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
            <ContextMenuItem onClick={(e) => handleAddNode(e.nativeEvent as any)}>
              <Link2 className="mr-2 h-4 w-4" />
              <span>Add a node</span>
              <ContextMenuShortcut>⌘ K</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleAddAction}>
              <Play className="mr-2 h-4 w-4" />
              <span>Add an action</span>
              <ContextMenuShortcut>⇧ A</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleAddTrigger}>
              <Zap className="mr-2 h-4 w-4" />
              <span>Add a trigger</span>
              <ContextMenuShortcut>⇧ T</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleAddNote}>
              <StickyNote className="mr-2 h-4 w-4" />
              <span>Add a note</span>
              <ContextMenuShortcut>⇧ N</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={handlePaste}>
              <Clipboard className="mr-2 h-4 w-4" />
              <span>Paste (1 node)</span>
              <ContextMenuShortcut>⌘ V</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleClearClipboard}>
              <ClipboardX className="mr-2 h-4 w-4" />
              <span>Clear Clipboard</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleRun}>
              <Play className="mr-2 h-4 w-4" />
              <span>Run</span>
              <ContextMenuShortcut>⌘ ⏎</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
      </ContextMenu>
      <NodeSettingsSidebar
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false)
          setSelectedNodeData(null)
        }}
        nodeData={selectedNodeData}
        onNodeUpdate={handleNodeUpdate}
        onReplaceNode={(nodeId) => {
          const node = nodes.find((n) => n.id === nodeId)
          if (node) {
            const viewport = getViewport()
            const nodeHeight = 60
            const screenX = (node.position.x * viewport.zoom) + viewport.x + 48
            const screenY = (node.position.y * viewport.zoom) + viewport.y + 56 + nodeHeight + 8
            ;(window as any).__replaceNodeId = nodeId
            if ((window as any).__openNodeSelector) {
              ;(window as any).__openNodeSelector({ x: screenX, y: screenY })
            }
          }
        }}
      />
    </>
  )
}

export default function Page() {
  const actionSelectRef = React.useRef<((action: SelectedAction) => void) | null>(null)
  const openNodeSelectorRef = React.useRef<((position: { x: number; y: number }, source?: "handle" | "replace", tab?: string) => void) | null>(null)

  const handleActionSelect = (action: SelectedAction) => {
    if (actionSelectRef.current) {
      actionSelectRef.current(action)
    }
  }

  const handleOpenNodeSelector = (openFn: (position: { x: number; y: number }) => void) => {
    openNodeSelectorRef.current = openFn
  }

  return (
    <DashboardLayout onActionSelect={handleActionSelect} onOpenNodeSelector={handleOpenNodeSelector}>
    <ReactFlowProvider>
        <FlowCanvas onActionSelectRef={actionSelectRef} onOpenNodeSelectorRef={openNodeSelectorRef} />
    </ReactFlowProvider>
    </DashboardLayout>
  )
}
