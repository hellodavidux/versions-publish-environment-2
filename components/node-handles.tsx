"use client"

import type React from "react"
import { Handle, Position } from "@xyflow/react"
import { Plus } from "lucide-react"
import { useState } from "react"

interface NodeHandlesProps {
  children: React.ReactNode
  onLeftClick?: (e: React.MouseEvent) => void
  onRightClick?: (e: React.MouseEvent) => void
  showHandles?: boolean
}

export function NodeHandles({ children, onLeftClick, onRightClick, showHandles = true }: NodeHandlesProps) {
  const [nodeHovered, setNodeHovered] = useState(false)
  const [leftHovered, setLeftHovered] = useState(false)
  const [rightHovered, setRightHovered] = useState(false)

  return (
    <div
      className="relative flex items-start"
      onMouseEnter={() => setNodeHovered(true)}
      onMouseLeave={() => setNodeHovered(false)}
    >
      {/* Left handle */}
      {showHandles && (
        <>
          <div
            className="absolute left-0 top-4 -translate-x-1/2 z-10 transition-all duration-200"
            onMouseEnter={() => setLeftHovered(true)}
            onMouseLeave={() => setLeftHovered(false)}
            onClick={onLeftClick}
          >
            <div
              className={`flex items-center justify-center shadow-sm cursor-pointer transition-all duration-200 border border-border ${
                leftHovered
                  ? "w-10 h-10 bg-foreground"
                  : nodeHovered
                    ? "w-8 h-8 bg-card"
                    : "w-4 h-4 bg-card opacity-0"
              }`}
            >
              <Plus
                className={`transition-all duration-200 ${
                  leftHovered
                    ? "w-5 h-5 text-background"
                    : nodeHovered
                      ? "w-4 h-4 text-muted-foreground"
                      : "w-0 h-0"
                }`}
              />
            </div>
          </div>
          <Handle
            type="target"
            position={Position.Left}
            className="!w-8 !h-8 !bg-transparent !border-0"
          />
        </>
      )}

      {/* Content */}
      <div className="mx-6">{children}</div>

      {/* Right handle */}
      {showHandles && (
        <>
          <div
            className="absolute right-0 top-4 translate-x-1/2 z-10 transition-all duration-200"
            onMouseEnter={() => setRightHovered(true)}
            onMouseLeave={() => setRightHovered(false)}
            onClick={onRightClick}
          >
            <div
              className={`flex items-center justify-center shadow-sm cursor-pointer transition-all duration-200 border border-border ${
                rightHovered
                  ? "w-10 h-10 bg-foreground"
                  : nodeHovered
                    ? "w-8 h-8 bg-card"
                    : "w-5 h-5 bg-card"
              }`}
            >
              <Plus
                className={`transition-all duration-200 ${
                  rightHovered
                    ? "w-5 h-5 text-background"
                    : nodeHovered
                      ? "w-4 h-4 text-muted-foreground"
                      : "w-3.5 h-3.5 text-muted-foreground"
                }`}
              />
            </div>
          </div>
          <Handle
            type="source"
            position={Position.Right}
            className="!w-8 !h-8 !bg-transparent !border-0 !right-0 !top-4 !translate-x-1/2"
          />
        </>
      )}
    </div>
  )
}
