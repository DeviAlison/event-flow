import DashboardShell from "@/components/DashboardShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 flex justify-center font-sans">
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}