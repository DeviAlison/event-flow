import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 flex justify-center font-sans">
      <div className="w-full max-w-[1400px] flex gap-6 h-[calc(100vh-3rem)]">
        
        {/* A Sidebar fica fixa aqui! */}
        <Sidebar />

        {/* A tag main vai receber o conteúdo dinâmico (a lista de eventos OU o formulário) */}
        <main className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 overflow-y-auto flex flex-col justify-between relative">
          {children}
        </main>

      </div>
    </div>
  );
}