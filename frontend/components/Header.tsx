export default function Header({ onSearch }: { onSearch: (value: string) => void }) {
  // Debounce, cache e cancelamento de requisições obsoletas são tratados no Dashboard (useEffect de busca)
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
      <div>
        <p className="text-sm font-medium text-slate-400 mb-1">Explorar / Eventos</p>
        <h1 className="text-3xl font-bold text-slate-800">Descubra Eventos</h1>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:w-80">
          <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            placeholder="Pesquisar evento, local..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-11 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-sm transition-shadow"
          />
        </div>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-900 transition-colors shadow-md shadow-orange-500/30">
          <i className="bi bi-sliders"></i>
        </button>
      </div>
    </div>
  );
}