import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ThemeProvider } from "@/lib/theme-provider"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar role="student" />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}
