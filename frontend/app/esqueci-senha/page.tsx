"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

export default function EsqueciSenha() {
    const router = useRouter();

    // Controle de Etapas: 1 (Email), 2 (Código), 3 (Nova Senha)
    const [etapa, setEtapa] = useState(1);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    // Dados do formulário
    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const limparMensagens = () => {
        setErro("");
        setMensagem("");
    };

    // --- Função do Passo 1: Enviar Email ---
    const handleEnviarEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        limparMensagens();
        setCarregando(true);

        try {
            await apiFetch("/esqueci-senha", {
                method: "POST",
                body: { email },
            });

            setMensagem("Código de recuperação enviado para o seu e-mail.");
            setTimeout(() => {
                limparMensagens();
                setEtapa(2);
            }, 1500);
        } catch (err) {
            setErro((err as Error)?.message || "Erro de ligação. Tente novamente.");
        } finally {
            setCarregando(false);
        }
    };

    // --- Função do Passo 2: Validar Código ---
    const handleValidarCodigo = async (e: React.FormEvent) => {
        e.preventDefault();
        limparMensagens();

        if (codigo.length !== 6) {
            setErro("O código deve ter exatamente 6 dígitos.");
            return;
        }

        setCarregando(true);

        try {
            await apiFetch("/esqueci-senha", {
                method: "POST",
                body: { email, codigo },
            });

            setMensagem("Código válido. Agora crie uma nova senha.");
            setTimeout(() => {
                limparMensagens();
                setEtapa(3);
            }, 800);
        } catch (err) {
            setErro((err as Error)?.message || "Erro ao validar o código. Tente novamente.");
        } finally {
            setCarregando(false);
        }
    };

    // --- Função do Passo 3: Nova Senha ---
    const handleRedefinirSenha = async (e: React.FormEvent) => {
        e.preventDefault();
        limparMensagens();

        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        setCarregando(true);

        try {
            await apiFetch("/redefinir-senha", {
                method: "PUT",
                body: { email, codigo, senha: novaSenha },
            });

            setMensagem("A sua senha foi alterada com sucesso! A redirecionar...");
            setTimeout(() => {
                router.push("/login");
            }, 2500);
        } catch (err) {
            setErro((err as Error)?.message || "Erro de ligação. Tente novamente.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 relative overflow-hidden">
            <div className="relative w-full max-w-md bg-slate-50 rounded-2xl shadow-2xl shadow-violet-900/20 p-8 pt-6 border border-slate-200">

                {/* Botão de Voltar ao Login */}
                {etapa === 1 && (
                    <Link href="/login" className="absolute top-6 left-6 z-50 flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors">
                        <i className="bi bi-arrow-left"></i>
                    </Link>
                )}

                {/* Logo Centralizada */}
                <div className="flex justify-center mb-0 mt-4">
                    <Image src="/logo.png" alt="Logo Event Flow" width={100} height={100} priority className="object-contain" />
                </div>

                {/* --- RENDERIZAÇÃO DA ETAPA 1 (EMAIL) --- */}
                {etapa === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2 mt-4">Recuperar Senha</h2>
                        <p className="text-center text-sm text-slate-500 mb-8">Introduza o e-mail associado à sua conta para receber um código de recuperação.</p>

                        <form onSubmit={handleEnviarEmail} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1">E-mail de recuperação</label>
                                <input type="email" required disabled={carregando} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors disabled:opacity-50" />
                            </div>

                            <button type="submit" disabled={carregando} className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 hover:opacity-90 cursor-pointer text-white font-bold rounded-xl transition-all disabled:opacity-70 mt-2 shadow-md shadow-violet-500/30">
                                {carregando ? "A enviar..." : "Enviar Código"}
                            </button>
                        </form>
                    </div>
                )}

                {/* --- RENDERIZAÇÃO DA ETAPA 2 (CÓDIGO) --- */}
                {etapa === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2 mt-4">Código de Verificação</h2>
                        <p className="text-center text-sm text-slate-500 mb-8">Enviámos um código de 6 dígitos para o e-mail <strong className="text-slate-700">{email}</strong>.</p>

                        <form onSubmit={handleValidarCodigo} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1 text-center">Introduza o código de 6 dígitos</label>
                                <input type="text" maxLength={6} required disabled={carregando} value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))} placeholder="000000" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors disabled:opacity-50 text-center text-2xl tracking-[0.5em] font-bold text-slate-800" />
                                <p className="text-xs text-center text-slate-400 mt-2">(Dica de teste: introduza 123456)</p>
                            </div>

                            <button type="submit" disabled={carregando || codigo.length < 6} className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 hover:opacity-90 cursor-pointer text-white font-bold rounded-xl transition-all disabled:opacity-70 mt-2 shadow-md shadow-violet-500/30">
                                {carregando ? "A validar..." : "Confirmar Identidade"}
                            </button>

                            <button type="button" onClick={() => setEtapa(1)} className="text-sm font-semibold text-violet-600 hover:text-violet-800 text-center mt-2">
                                E-mail incorreto? Voltar
                            </button>
                        </form>
                    </div>
                )}

                {/* --- RENDERIZAÇÃO DA ETAPA 3 (NOVA SENHA) --- */}
                {etapa === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2 mt-4">Criar Nova Senha</h2>
                        <p className="text-center text-sm text-slate-500 mb-8">A sua identidade foi confirmada. Crie uma palavra-passe segura para a sua conta.</p>

                        <form onSubmit={handleRedefinirSenha} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1">Nova Senha</label>
                                <input type="password" required disabled={carregando} value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="Mínimo de 6 caracteres" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors disabled:opacity-50" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1">Confirmar Nova Senha</label>
                                <input type="password" required disabled={carregando} value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="Repita a nova senha" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors disabled:opacity-50" />
                            </div>

                            <button
                                type="submit"
                                disabled={carregando || novaSenha.length < 6}
                                className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 hover:opacity-90 cursor-pointer text-white font-bold rounded-xl transition-all disabled:opacity-70 mt-2 shadow-md shadow-violet-500/30"
                            >
                                {carregando ? "A guardar..." : "Concluir Alteração"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Mensagens Visuais de Erro ou Sucesso */}
                {erro && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 flex items-center gap-2">
                        <i className="bi bi-exclamation-triangle-fill"></i> {erro}
                    </div>
                )}

                {mensagem && (
                    <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 flex items-center gap-2">
                        <i className="bi bi-check-circle-fill"></i> {mensagem}
                    </div>
                )}

            </div>
        </div>
    );
}