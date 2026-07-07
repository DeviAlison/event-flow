export default function EventCard({ evento, onViewDetails }: { evento: any; onViewDetails: () => void }) {
  const getTheme = (categoria: string | undefined) => {
    switch (categoria?.toLowerCase()) {
      case 'hackathon':
        return { capa: 'bg-gradient-to-br from-indigo-200 to-purple-200', tag: 'bg-pink-100 text-pink-700', barra: 'bg-pink-500', texto: 'text-pink-600' };
      case 'segurança':
        return { capa: 'bg-gradient-to-br from-blue-200 to-violet-200', tag: 'bg-orange-100 text-orange-700', barra: 'bg-orange-500', texto: 'text-orange-600' };
      default:
        return { capa: 'bg-gradient-to-br from-violet-200 to-fuchsia-200', tag: 'bg-violet-100 text-violet-700', barra: 'bg-violet-500', texto: 'text-violet-600' };
    }
  };

  const theme = getTheme(evento.categoria);
  
  // Trata a localização
  const localizacao = evento.endereco?.cidade 
    ? `${evento.endereco.cidade}, ${evento.endereco.estado}` 
    : (evento.cidade ? `${evento.cidade}, ${evento.estado}` : "Local a definir");

  // Trata a data opcional
  let dataHora = "Data a definir";
  if (evento.data && evento.hora) {
    dataHora = `${evento.data} • ${evento.hora}`;
  } else if (evento.dataInicio) {
    const dt = new Date(evento.dataInicio);
    if (!isNaN(dt.getTime())) {
      const dia = String(dt.getDate()).padStart(2, '0');
      const mes = String(dt.getMonth() + 1).padStart(2, '0');
      const hora = String(dt.getHours()).padStart(2, '0');
      const min = String(dt.getMinutes()).padStart(2, '0');
      dataHora = `${dia}/${mes}/${dt.getFullYear()} • ${hora}:${min}`;
    }
  }

  const tituloFinal = evento.titulo || evento.nome || "Evento em Definição";

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col">
      <div className={`relative w-full h-48 ${theme.capa} rounded-xl mb-4 overflow-hidden`}>
        
        {/* Renderiza a imagem e um escurecimento para leitura das tags */}
        {evento.imagem_url && (
          <>
            <img src={evento.imagem_url} alt={tituloFinal} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20"></div>
          </>
        )}

        <span className={`absolute top-3 left-3 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-10 ${theme.tag}`}>
          {evento.categoria || "Geral"}
        </span>
        <span className={`absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 z-10 ${theme.texto}`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${theme.barra}`}></span>
          {evento.status === 1 ? 'Ativo' : evento.status === 2 ? 'No Radar' : 'Finalizado'}
        </span>
      </div>

      <div className="px-2 flex-1 flex flex-col">
        <p className="text-xs font-medium text-slate-400 mb-1">{dataHora}</p>
        <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{tituloFinal}</h3>
        <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-5">
          <i className="bi bi-geo-alt text-slate-400"></i> {localizacao}
        </p>

        <div className="mt-auto flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${theme.barra}`} style={{ width: `${evento.porcen_vend || 0}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-600">{evento.porcen_vend || 0}%</span>
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-xl font-extrabold ${theme.texto}`}>
              {evento.preco ? `R$ ${evento.preco}` : 'Grátis'}
            </span>
            <button
              type="button"
              onClick={onViewDetails}
              className={`px-4 py-2 rounded-lg text-sm font-bold bg-slate-50 hover:bg-slate-100 transition-colors ${theme.texto}`}
            >
              Ver detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}