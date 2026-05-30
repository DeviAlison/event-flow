"use client";

import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  // Adicionamos as propriedades de cor (tema) para cada evento
  const eventos = [
    {
      id: 1,
      titulo: "Semana Acadêmica de Tecnologia",
      categoria: "Tecnologia",
      data: "15 Jun 2026 • 19:00",
      local: "Muzambinho, MG",
      preco: 50,
      vendidos: 65,
      capa: "bg-gradient-to-br from-violet-200 to-fuchsia-200", 
      temaTag: "bg-violet-100 text-violet-700",
      temaBarra: "bg-violet-500",
      temaTexto: "text-violet-600",
    },
    {
      id: 2,
      titulo: "Hackathon Event Flow",
      categoria: "Hackathon",
      data: "28 Jun 2026 • 08:00",
      local: "Poços de Caldas, MG",
      preco: 80,
      vendidos: 45,
      capa: "bg-gradient-to-br from-indigo-200 to-purple-200",
      temaTag: "bg-pink-100 text-pink-700",
      temaBarra: "bg-pink-500",
      temaTexto: "text-pink-600",
    },
    {
      id: 3,
      titulo: "Congresso de Cibersegurança",
      categoria: "Segurança",
      data: "10 Jul 2026 • 09:00",
      local: "São Paulo, SP",
      preco: 150,
      vendidos: 90,
      capa: "bg-gradient-to-br from-blue-200 to-violet-200",
      temaTag: "bg-orange-100 text-orange-700",
      temaBarra: "bg-orange-500",
      temaTexto: "text-orange-600",
    },
    {
      id: 4,
      titulo: "Workshop Cisco Networking",
      categoria: "Redes",
      data: "25 Jul 2026 • 14:00",
      local: "Belo Horizonte, MG",
      preco: 70,
      vendidos: 30,
      capa: "bg-gradient-to-br from-sky-200 to-indigo-200",
      temaTag: "bg-violet-100 text-violet-700",
      temaBarra: "bg-violet-500",
      temaTexto: "text-violet-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 flex justify-center font-sans">
      
      <div className="w-full max-w-[1400px] flex gap-6 h-[calc(100vh-3rem)]">
        
        {/* SIDEBAR FLUTUANTE */}
        <aside className="w-64 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col p-6 overflow-y-auto">
          
          <div className="flex items-center gap-3 mb-10 px-2 mt-2">
            <Image
              src="/logo.png"
              alt="Event Flow"
              width={40}
              height={40}
              priority
              className="object-contain"
            />
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">
              Event Flow
            </span>
          </div>

          <nav className="flex flex-col gap-1">
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors font-medium">
              <i className="bi bi-grid-1x2"></i>
              Painel
            </Link>

            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-50 text-violet-700 font-bold transition-colors">
              <i className="bi bi-compass"></i>
              Explorar
            </Link>

            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors font-medium">
              <i className="bi bi-ticket-perforated"></i>
              Ingressos
            </Link>

            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors font-medium">
              <i className="bi bi-calendar-event"></i>
              Meus Eventos
            </Link>

            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors font-medium">
              <i className="bi bi-cash-stack"></i>
              Financeiro
            </Link>
          </nav>

          <div className="mt-auto">
            <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors font-medium">
              <i className="bi bi-box-arrow-right"></i>
              Sair da conta
            </Link>
          </div>
        </aside>

        {/* PAINEL PRINCIPAL FLUTUANTE */}
        <main className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 overflow-y-auto">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Explorar / Eventos</p>
              <h1 className="text-3xl font-bold text-slate-800">
                Descubra Eventos
              </h1>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  placeholder="Pesquisar evento, local..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-full pl-11 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-sm transition-shadow"
                />
              </div>
              
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-900 transition-colors shadow-md shadow-orange-500/30">
                <i className="bi bi-sliders"></i>
              </button>
            </div>
          </div>

          <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <button className="px-5 py-2 rounded-full bg-violet-600 text-white font-semibold text-sm shadow-md shadow-violet-500/30 whitespace-nowrap">
              Todos (48)
            </button>
            <button className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 font-medium text-sm hover:border-pink-300 hover:text-pink-600 transition-colors whitespace-nowrap">
              Tecnologia (12)
            </button>
            <button className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 font-medium text-sm hover:border-orange-300 hover:text-orange-600 transition-colors whitespace-nowrap">
              Hackathons (8)
            </button>
            <button className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 font-medium text-sm hover:border-violet-300 hover:text-violet-600 transition-colors whitespace-nowrap">
              Workshops (22)
            </button>
          </div>

          {/* GRID DE EVENTOS */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {eventos.map((evento) => (
              <div
                key={evento.id}
                className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col"
              >
                <div className={`relative w-full h-48 ${evento.capa} rounded-xl mb-4 overflow-hidden`}>
                  {/* Tag colorida dinamicamente */}
                  <span className={`absolute top-3 left-3 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${evento.temaTag}`}>
                    {evento.categoria}
                  </span>
                  
                  <span className={`absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 ${evento.temaTexto}`}>
                    <span className={`w-2 h-2 rounded-full animate-pulse ${evento.temaBarra}`}></span>
                    Ativo
                  </span>
                </div>

                <div className="px-2 flex-1 flex flex-col">
                  <p className="text-xs font-medium text-slate-400 mb-1">
                    {evento.data}
                  </p>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                    {evento.titulo}
                  </h3>
                  
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-5">
                    <i className="bi bi-geo-alt text-slate-400"></i>
                    {evento.local}
                  </p>

                  {/* BARRA DE PROGRESSO E PREÇO */}
                  <div className="mt-auto flex flex-col gap-4">
                    
                    <div className="flex items-center gap-3">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${evento.temaBarra}`}
                          style={{ width: `${evento.vendidos}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600">
                        {evento.vendidos}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className={`text-xl font-extrabold ${evento.temaTexto}`}>
                        R$ {evento.preco}
                      </span>
                      {/* Botões de detalhes coloridos dinamicamente */}
                      <button className={`px-4 py-2 rounded-lg text-sm font-bold bg-slate-50 hover:bg-slate-100 transition-colors ${evento.temaTexto}`}>
                        Ver detalhes
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}