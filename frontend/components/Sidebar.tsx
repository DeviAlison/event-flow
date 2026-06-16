"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";

export default function Sidebar({ visible, onToggleSidebar }: { visible: boolean; onToggleSidebar: () => void }) {
    const { isAuthenticated, logout } = useAuth();
    return (
        <aside className={`flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden transition-all duration-500 ease-out ${
            visible ? 'w-64 p-6 opacity-100' : 'w-0 p-0 opacity-0'
        }`}>
            {/* Logo, título e botão hamburguer */}
            <div className="flex items-center justify-between gap-3 mb-10 px-2 mt-2">
                <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="Event Flow" width={40} height={40} priority className="object-contain" />
                    <span className="text-xl font-extrabold text-slate-800 tracking-tight">Event Flow</span>
                </div>
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="inline-flex items-center justify-center w-8 h-8 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Minimizar menu"
                >
                    <i className="bi bi-chevron-left text-lg"></i>
                </button>
            </div>

            {/* Navegação */}
            <nav className="flex flex-col gap-1">
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors font-medium">
                    <i className="bi bi-grid-1x2"></i> Painel
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

            {/* Botão Login / Sair */}
            <div className="mt-auto">
                {isAuthenticated ? (
                    <button
                        type="button"
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors font-medium"
                    >
                        <i className="bi bi-box-arrow-right"></i> Sair
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors font-medium"
                    >
                        <i className="bi bi-box-arrow-in-right"></i> Login
                    </Link>
                )}
            </div>
        </aside>
    );
}