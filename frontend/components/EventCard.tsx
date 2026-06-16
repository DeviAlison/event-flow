export default function EventCard({ evento }) {
  // Como a API não envia o tema, criamos um padrão ou baseamos na categoria
  const getTheme = (categoria) => {
    switch (categoria?.toLowerCase()) {
      case 'hackathon':
        return { capa: 'bg-gradient-to-br from-indigo-200 to-purple-200', tag: 'bg-pink-100 text-pink-700', barra: 'bg-pink-500', texto: 'text-pink-600' };
      case 'segurança':
        return { capa: 'bg-gradient-to-br from-blue-200 to-violet-200', tag: 'bg-orange-100 text-orange-700', barra: 'bg-orange-500', texto: 'text-orange-600' };
      default: // Tecnologia, Redes, etc.
        return { capa: 'bg-gradient-to-br from-violet-200 to-fuchsia-200', tag: 'bg-violet-100 text-violet-700', barra: 'bg-violet-500', texto: 'text-violet-600' };
    }
  };

  const theme = getTheme(evento.categoria);
  const localizacao = evento.endereco ? `${evento.endereco.cidade}, ${evento.endereco.estado}` : "Local a definir";
  const dataHora = `${evento.data} • ${evento.hora}`;

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col">
      <div className={`relative w-full h-48 ${theme.capa} rounded-xl mb-4 overflow-hidden`}>
        <span className={`absolute top-3 left-3 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${theme.tag}`}>
          {evento.categoria || "Geral"}
        </span>
        <span className={`absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 ${theme.texto}`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${theme.barra}`}></span>
          {evento.status === 1 ? 'Ativo' : 'Finalizado'}
        </span>
      </div>

      <div className="px-2 flex-1 flex flex-col">
        <p className="text-xs font-medium text-slate-400 mb-1">{dataHora}</p>
        <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{evento.titulo}</h3>
        <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-5">
          <i className="bi bi-geo-alt text-slate-400"></i> {localizacao}
        </p>

        <div className="mt-auto flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${theme.barra}`} style={{ width: `${evento.porcen_vend}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-600">{evento.porcen_vend}%</span>
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-xl font-extrabold ${theme.texto}`}>R$ {evento.preco}</span>
            <button className={`px-4 py-2 rounded-lg text-sm font-bold bg-slate-50 hover:bg-slate-100 transition-colors ${theme.texto}`}>
              Ver detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}