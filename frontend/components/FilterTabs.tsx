export default function FilterTabs({ statusAtivo, setStatusAtivo }) {
  const statusOptions = ["Todos", "Ativo", "No Radar", "Finalizado"];

  return (
    <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      {statusOptions.map((status) => (
        <button
          key={status}
          onClick={() => setStatusAtivo(status === "Todos" ? "" : status)}
          className={`px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
            (statusAtivo === status || (status === "Todos" && statusAtivo === ""))
              ? "bg-violet-600 text-white font-semibold shadow-md shadow-violet-500/30"
              : "bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}