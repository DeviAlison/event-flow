"use client";

import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/providers/SidebarProvider";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const { sidebarOpen, setSidebarOpen } = useSidebar();

    return (
        <div className={`w-full max-w-[1500px] flex h-[calc(100vh-3rem)] transition-all duration-500 ease-in-out ${sidebarOpen ? "gap-6" : "gap-0"}`}>
            <Sidebar open={sidebarOpen} onToggle={setSidebarOpen} />
            <main className="flex-1 min-w-0 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 overflow-y-auto flex flex-col justify-between relative transition-all duration-500 ease-in-out">
                {children}
            </main>
        </div>
    );
}