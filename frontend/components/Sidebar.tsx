"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

interface SidebarProps {
    open: boolean;
    onToggle: (value: boolean) => void;
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
    const { isAuthenticated, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const [mostrarModal, setMostrarModal] = useState(false);

    const getLinkClass = (path: string) => {
        const isActive = pathname === path;
        return isActive
            ? "flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-50 text-violet-700 font-bold transition-colors"
            : "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors font-medium";
    };

    const handleRestrictedClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            setMostrarModal(true);
        }
    };

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`
                    shrink-0 bg-white rounded-2xl shadow-sm border border-slate-200
                    flex flex-col p-6 overflow-y-auto z-20
                    transition-all duration-300 ease-in-out
                    ${open ? "w-64 opacity-100 translate-x-0" : "w-0 p-0 border-0 opacity-0 -translate-x-4 pointer-events-none"}
                `}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-10 px-2 mt-2 relative">
                    <Image src="/logo.png" alt="Event Flow" width={40} height={40} priority className="object-contain" />
                    <span className="text-2xl font-extrabold text-slate-800 tracking-tight whitespace-nowrap">Event Flow</span>

                    <button
                        onClick={() => onToggle(false)}
                        className="absolute -right-3 -top-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Recolher sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                </div>

                <nav className="flex flex-col gap-1">
                    <Link href="/dashboard" className={getLinkClass("/dashboard")}>
                        <i className="bi bi-compass"></i> Explorar
                    </Link>
                    <Link href="/dashboard/criar-evento" onClick={handleRestrictedClick} className={getLinkClass("/dashboard/criar-evento")}>
                        <i className="bi bi-plus-square"></i> Criar Evento
                    </Link>
                    <Link href="/dashboard/" onClick={handleRestrictedClick} className={getLinkClass("/dashboard/")}>
                        <i className="bi bi-calendar-event"></i> Meus Eventos
                    </Link>
                    <Link href="/dashboard/" onClick={handleRestrictedClick} className={getLinkClass("/dashboard/")}>
                        <i className="bi bi-ticket-perforated"></i> Meus Ingressos
                    </Link>
                </nav>

                <div className="mt-auto">
                    {isAuthenticated ? (
                        <button
                            type="button"
                            onClick={() => { logout(); router.push("/login"); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors font-medium"
                        >
                            <i className="bi bi-box-arrow-right"></i> Sair
                        </button>
                    ) : (
                        <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors font-medium">
                            <i className="bi bi-box-arrow-in-right"></i> Login
                        </Link>
                    )}
                </div>
            </aside>

            {/* Botão flutuante hamburguer */}
            <button
                onClick={() => onToggle(true)}
                className={`
                    fixed top-5 left-5 z-30 p-3 bg-white rounded-xl shadow-lg border border-slate-200
                    text-slate-600 hover:text-violet-700 hover:border-violet-200 hover:shadow-violet-100
                    transition-all duration-300 ease-in-out
                    ${open ? "opacity-0 pointer-events-none -translate-x-2" : "opacity-100 translate-x-0"}
                `}
                title="Abrir menu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            </button>

            {/* Modal de acesso restrito */}
            {mostrarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                <i className="bi bi-lock-fill text-4xl text-violet-600"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Acesso Restrito</h3>
                            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                                Você precisa estar logado para acessar os recursos exclusivos de criação e gerenciamento de eventos.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => { setMostrarModal(false); router.push("/login"); }}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-md shadow-violet-500/30"
                                >
                                    Fazer Login Agora
                                </button>
                                <button
                                    onClick={() => setMostrarModal(false)}
                                    className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}