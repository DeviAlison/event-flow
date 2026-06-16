"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function Sidebar() {
    const { isAuthenticated, logout } = useAuth();
    const pathname = usePathname();
    const [mensagemAlerta, setMensagemAlerta] = useState("");

    // Função para definir a cor do botão caso ele seja a página atual
    const getLinkClass = (path: string) => {
        const isActive = pathname === path;
        return isActive
            ? "flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-50 text-violet-700 font-bold transition-colors"
            : "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors font-medium";
    };

    // Função que intercepta o clique em áreas restritas
    const handleRestrictedClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault(); // Impede que o Link mude de página
            setMensagemAlerta("Você deve estar logado para acessar essa funcionalidade.");
            
            // Limpa a mensagem após 4 segundos
            setTimeout(() => {
                setMensagemAlerta("");
            }, 4000);
        }
    };

    return (
        <>
            <aside className="w-64 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col p-6 overflow-y-auto z-10 relative">
                {/* Logo e Título */}
                <div className="flex items-center gap-3 mb-10 px-2 mt-2">
                    <Image src="/logo.png" alt="Event Flow" width={40} height={40} priority className="object-contain" />
                    <span className="text-2xl font-extrabold text-slate-800 tracking-tight">Event Flow</span>
                </div>

                {/* Navegação Principal */}
                <nav className="flex flex-col gap-1">
                    {/* Rota Pública */}
                    <Link href="/dashboard" className={getLinkClass("/dashboard")}>
                        <i className="bi bi-compass"></i> Explorar
                    </Link>

                    {/* Rotas Restritas */}
                    <Link href="/dashboard/criar-evento" onClick={handleRestrictedClick} className={getLinkClass("/dashboard/criar-evento")}>
                        <i className="bi bi-plus-square"></i> Criar Evento
                    </Link>

                    <Link href="#" onClick={handleRestrictedClick} className={getLinkClass("/dashboard/meus-eventos")}>
                        <i className="bi bi-calendar-event"></i> Meus Eventos
                    </Link>

                    <Link href="#" onClick={handleRestrictedClick} className={getLinkClass("/dashboard/meus-ingressos")}>
                        <i className="bi bi-ticket-perforated"></i> Meus Ingressos
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

            {/* Aviso Flutuante (Toast) */}
            {mensagemAlerta && (
                <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl transition-all animate-bounce z-50">
                    <i className="bi bi-exclamation-triangle-fill text-xl"></i>
                    <span className="font-semibold">{mensagemAlerta}</span>
                </div>
            )}
        </>
    );
}