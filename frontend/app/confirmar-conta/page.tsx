"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

function ConfirmarContaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const emailDaUrl = searchParams.get("email");
    if (emailDaUrl) {
      setEmail(emailDaUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setErro("");
    setMensagem("");
    setCarregando(true);

    try {
      await apiFetch("/confirmar-conta", {
        method: "POST",
        body: { email, token },
      });

      setMensagem("Conta confirmada com sucesso! Redirecionando para login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setErro((err as Error)?.message || "Erro ao confirmar conta. Verifique os dados e tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 relative overflow-hidden">
      <div className="relative w-full max-w-md bg-slate-50 rounded-2xl shadow-2xl shadow-violet-900/20 p-8 pt-6 border border-slate-200 mt-10 mb-10">
        <Link href="/login" className="absolute top-6 left-6 z-50 flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </Link>

        <div className="flex justify-center mb-0">
          <Image src="/logo.png" alt="Logo Event Flow" width={200} height={200} priority className="object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2 mt-2">Confirmar Conta</h2>
        <p className="text-center text-sm text-slate-600 mb-4">Digite seu e-mail e o token enviado para ativar sua conta.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={carregando}
              placeholder="email@exemplo.com"
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Token de confirmação</label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={carregando}
              placeholder="Digite o token recebido"
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors disabled:opacity-50"
            />
          </div>

          {erro ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</div>
          ) : mensagem ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{mensagem}</div>
          ) : null}

          <button
            type="submit"
            disabled={carregando}
            className="w-full flex items-center justify-center py-2.5 px-4 bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 hover:opacity-90 text-white font-semibold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 shadow-md shadow-violet-500/30"
          >
            {carregando ? "Confirmando..." : "Confirmar Conta"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ConfirmarConta() {
  return (
    <Suspense fallback={null}>
      <ConfirmarContaForm />
    </Suspense>
  );
}