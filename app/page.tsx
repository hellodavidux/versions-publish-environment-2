"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function Page() {
  const handleRun = () => {
    // Run functionality can be added here
  }

  return (
    <DashboardLayout onRun={handleRun}>
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Content area</p>
      </div>
    </DashboardLayout>
  )
}
