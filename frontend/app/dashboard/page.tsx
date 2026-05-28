"use client";

import Link from "next/link";

export default function Dashboard() {
  const eventos = [
    { id: 1, titulo: "Adventure Gear Show", categoria: "Outdoor", data: "June 5, 2024", hora: "9:00 PM", local: "Denver, CO", progresso: 65, preco: 80, cor: "bg-primary" },
    { id: 2, titulo: "Symphony Under the Stars", categoria: "Music", data: "May 12, 2024", hora: "7:30 PM", local: "Vienna, VA", progresso: 85, preco: 120, cor: "bg-blue-500" },
    { id: 3, titulo: "Runway Revolution 2024", categoria: "Fashion", data: "July 20, 2024", hora: "6:00 PM", local: "New York, NY", progresso: 45, preco: 150, cor: "bg-rose-500" },
    { id: 4, titulo: "Global Wellness Summit", categoria: "Health", data: "August 15, 2024", hora: "8:00 AM", local: "Bali, Indonesia", progresso: 30, preco: 500, cor: "bg-emerald-500" },
    { id: 5, titulo: "Artistic Unveiled Expo", categoria: "Art & Design", data: "September 10, 2024", hora: "10:00 AM", local: "Paris, France", progresso: 90, preco: 45, cor: "bg-amber-500" },
    { id: 6, titulo: "Culinary Delights Festival", categoria: "Food & Culinary", data: "October 5, 2024", hora: "1:00 PM", local: "Florence, Italy", progresso: 55, preco: 75, cor: "bg-slate-500" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* SIDEBAR */}
      <nav className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 p-6 fixed h-full z-10">
        <div className="flex items-center gap-3 mb-10">
          <i className="bi bi-hexagon-fill text-primary text-3xl"></i>
          <span className="text-xl font-bold text-gray-900">Ventize</span>
        </div>
        
        <ul className="flex flex-col gap-2">
          <li><Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"><i className="bi bi-grid-1x2"></i> Dashboard</Link></li>
          <li><Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"><i className="bi bi-bookmark"></i> Bookings</Link></li>
          <li><Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"><i className="bi bi-file-earmark-text"></i> Invoices</Link></li>
          <li><Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"><i className="bi bi-envelope"></i> Inbox</Link></li>
          <li><Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"><i className="bi bi-calendar-event"></i> Calendar</Link></li>
          <li><Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-primary bg-primary/10 font-semibold rounded-lg transition-colors"><i className="bi bi-stars"></i> Events</Link></li>
        </ul>

        <div className="mt-10 bg-gray-50 p-5 rounded-2xl text-center">
          <i className="bi bi-lightning-charge text-primary text-2xl"></i>
          <p className="text-sm text-gray-600 mt-2 mb-4">Melhore sua experiência com Ventize Pro.</p>
          <button className="w-full bg-primary hover:bg-primaryHover text-white py-2 rounded-lg text-sm font-medium transition-colors">Upgrade Now</button>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100">
           <Link href="/login" className="flex items-center gap-3 px-4 text-red-500 hover:text-red-600 font-medium transition-colors"><i className="bi bi-box-arrow-left"></i> Sign Out</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Events</h2>
            <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border border-gray-100">
              <button className="px-4 py-1.5 text-sm font-medium bg-primary text-white rounded-md shadow">Active</button>
              <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">Draft</button>
              <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">Past</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-4 py-2 text-primary bg-white border border-primary/20 hover:bg-primary/5 rounded-lg font-medium transition-colors"><i className="bi bi-plus-lg"></i> Add New Event</button>
             <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=32" alt="Perfil" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          <div className="md:col-span-6 relative">
            <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" className="w-full pl-11 pr-4 py-2.5 bg-white border-none rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="Search event..." />
          </div>
          <div className="md:col-span-3">
            <select className="w-full px-4 py-2.5 bg-white border-none rounded-xl shadow-sm text-gray-600 focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer">
              <option>All Category</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <select className="w-full px-4 py-2.5 bg-white border-none rounded-xl shadow-sm text-gray-600 focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer">
              <option>This Month</option>
            </select>
          </div>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {eventos.map((ev) => (
            <div key={ev.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img src={`https://picsum.photos/seed/${ev.id}/400/250`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="evento" />
                <span className={`absolute top-4 left-4 ${ev.cor} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm`}>
                  {ev.categoria}
                </span>
              </div>
              <div className="p-5">
                <p className="text-primary text-xs font-bold mb-2">{ev.data} • {ev.hora}</p>
                <h5 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{ev.titulo}</h5>
                <p className="text-gray-500 text-sm flex items-center gap-1.5"><i className="bi bi-geo-alt"></i> {ev.local}</p>
                
                <div className="mt-6 pt-4 border-t border-gray-50">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-medium text-gray-500">Sold: {ev.progresso}%</span>
                    <span className="text-lg font-bold text-gray-900">${ev.preco}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${ev.cor} rounded-full`} style={{width: `${ev.progresso}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}