export default function EventCard({ evento }) {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col">
      <div className={`relative w-full h-48 ${evento.capa} rounded-xl mb-4 overflow-hidden`}>
        <span className={`absolute top-3 left-3 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${evento.temaTag}`}>
          {evento.categoria}
        </span>
        <span className={`absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 ${evento.temaTexto}`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${evento.temaBarra}`}></span>
          Ativo
        </span>
      </div>

      <div className="px-2 flex-1 flex flex-col">
        <p className="text-xs font-medium text-slate-400 mb-1">{evento.data}</p>
        <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{evento.titulo}</h3>
        <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-5">
          <i className="bi bi-geo-alt text-slate-400"></i> {evento.local}
        </p>

        <div className="mt-auto flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${evento.temaBarra}`} style={{ width: `${evento.vendidos}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-600">{evento.vendidos}%</span>
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-xl font-extrabold ${evento.temaTexto}`}>R$ {evento.preco}</span>
            <button className={`px-4 py-2 rounded-lg text-sm font-bold bg-slate-50 hover:bg-slate-100 transition-colors ${evento.temaTexto}`}>
              Ver detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}