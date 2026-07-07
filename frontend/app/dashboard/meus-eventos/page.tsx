"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { apiFetch } from "@/lib/api";

type MeuEvento = {
  id_evento: number;
  titulo: string;
  imagem_url?: string | null;
  status: string; // "Publicado" | "Encerrado" | "Cancelado" | "No Radar"
};

// Formato retornado por GET /api/eventos/<id> (obter_detalhes_evento)
type DetalheEvento = {
  id_evento: number;
  imagem_url?: string | null;
  titulo: string;
  categoria: string;
  status: string;
  data: string;
  hora: string;
  localizacao: string;
  descricao: string;
  preco_base: number;
  ingressos_totais: number;
  ingressos_disponiveis: number;
  quant_reacoes: number;
  modalidades_ingresso: Array<{
    id_tipo: number;
    nome: string;
    descricao: string;
    permite_meia: boolean;
    lotes: Array<{ id_lote: number; numero_lote: number; preco: number; preco_meia: number | null; esgotado: boolean }>;
  }>;
  comentarios: unknown[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function getStatusBadge(status: string) {
  switch (status) {
    case "Publicado":
      return { label: "Ativo", classe: "bg-emerald-100 text-emerald-700" };
    case "Encerrado":
      return { label: "Finalizado", classe: "bg-slate-200 text-slate-600" };
    case "Cancelado":
      return { label: "Cancelado", classe: "bg-red-100 text-red-700" };
    case "Esgotado":
      return { label: "Esgotado", classe: "bg-amber-100 text-amber-700" };
    default:
      return { label: "No Radar", classe: "bg-violet-100 text-violet-700" };
  }
}

function DetalheEventoModal({ evento, onClose }: { evento: DetalheEvento; onClose: () => void }) {
  const badge = getStatusBadge(evento.status);
  const disponibilidade = evento.ingressos_totais > 0
    ? Math.round((evento.ingressos_disponiveis / evento.ingressos_totais) * 100)
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 md:h-56 bg-gradient-to-br from-violet-200 to-fuchsia-200 rounded-t-3xl overflow-hidden shrink-0">
          {evento.imagem_url && (
            <img src={evento.imagem_url} alt={evento.titulo} className="absolute inset-0 w-full h-full object-cover" />
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 text-slate-600 hover:bg-white shadow-sm"
          >
            <i className="bi bi-x-lg"></i>
          </button>
          <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${badge.classe}`}>
            {badge.label}
          </span>
        </div>

        <div className="p-5 md:p-6 space-y-5">
          <div>
            <p className="text-xs font-medium text-slate-400">{evento.categoria}</p>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mt-1">{evento.titulo}</h2>
            <p className="text-sm text-slate-500 mt-2 flex items-center gap-1.5">
              <i className="bi bi-calendar-event text-slate-400"></i> {evento.data || "Data a definir"} • {evento.hora || "--:--"}
            </p>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
              <i className="bi bi-geo-alt text-slate-400"></i> {evento.localizacao}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-3 md:p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">A partir de</p>
              <p className="mt-1 text-lg font-bold text-slate-800">{formatCurrency(evento.preco_base)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 md:p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Ingressos</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{evento.ingressos_disponiveis} de {evento.ingressos_totais} disponíveis</p>
              <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full rounded-full bg-violet-500" style={{ width: `${disponibilidade}%` }} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-2">Descrição</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{evento.descricao}</p>
          </div>

          {evento.modalidades_ingresso?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-2">Tipos de ingresso</h3>
              <div className="space-y-2">
                {evento.modalidades_ingresso.map((tipo) => (
                  <div key={tipo.id_tipo} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">{tipo.nome}</p>
                      {tipo.descricao && <p className="text-xs text-slate-400">{tipo.descricao}</p>}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tipo.lotes.map((lote) => (
                        <span
                          key={lote.id_lote}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${lote.esgotado ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"}`}
                        >
                          Lote {lote.numero_lote} • {formatCurrency(lote.preco)} {lote.esgotado ? "(esgotado)" : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><i className="bi bi-fire"></i> {evento.quant_reacoes} reações</span>
            <span className="flex items-center gap-1.5"><i className="bi bi-chat-dots"></i> {evento.comentarios?.length || 0} comentários</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MeusEventos() {
  const { isAuthenticated } = useAuth();

  const [eventos, setEventos] = useState<MeuEvento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [detalheEvento, setDetalheEvento] = useState<DetalheEvento | null>(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setErro("");
      try {
        const data = await apiFetch<{ eventos: MeuEvento[] }>("/api/eventos/meus", {
          signal: controller.signal,
        });
        setEventos(data.eventos || []);
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          setErro((err as Error)?.message || "Não foi possível carregar seus eventos.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [isAuthenticated]);

  const handleVerDetalhes = async (id: number) => {
    setCarregandoDetalhe(id);
    setErro("");
    try {
      const evento = await apiFetch<DetalheEvento>(`/api/eventos/${id}`);
      setDetalheEvento(evento);
    } catch (err) {
      setErro((err as Error)?.message || "Não foi possível carregar os detalhes do evento.");
    } finally {
      setCarregandoDetalhe(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 md:py-24">
        <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mb-5 shadow-inner">
          <i className="bi bi-lock-fill text-4xl text-violet-600"></i>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Acesso Restrito</h2>
        <p className="text-slate-500 mb-6 max-w-sm text-sm">
          Faça login para ver e gerenciar os eventos que você criou.
        </p>
        <Link
          href="/login"
          className="py-2.5 md:py-3 px-6 md:px-8 bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 hover:opacity-90 text-white text-sm md:text-base font-bold rounded-xl transition-all shadow-lg shadow-violet-500/30"
        >
          Fazer Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-6 md:mb-8 pb-4 md:pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-pink-600 to-orange-500">
            Meus Eventos
          </h1>
          <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">Eventos que você criou na plataforma.</p>
        </div>
        <Link
          href="/dashboard/criar-evento"
          className="shrink-0 flex items-center gap-2 py-2.5 px-4 md:px-6 bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 hover:opacity-90 text-white text-xs md:text-sm font-bold rounded-xl transition-all shadow-lg shadow-violet-500/30"
        >
          <i className="bi bi-plus-lg"></i>
          <span className="hidden sm:inline">Criar Evento</span>
        </Link>
      </div>

      {erro && (
        <div className="mb-6 p-3 md:p-4 flex items-center gap-3 text-xs md:text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl shadow-sm">
          <i className="bi bi-exclamation-triangle"></i> {erro}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        </div>
      ) : eventos.length === 0 ? (
        <div className="text-center py-16">
          <i className="bi bi-calendar-plus text-4xl text-slate-300 mb-3 block"></i>
          <p className="text-slate-500 font-medium mb-5">Você ainda não criou nenhum evento.</p>
          <Link
            href="/dashboard/criar-evento"
            className="inline-flex items-center gap-2 py-2.5 px-6 bg-violet-50 hover:bg-violet-100 text-violet-700 text-sm font-bold rounded-xl transition-colors"
          >
            <i className="bi bi-plus-lg"></i> Criar meu primeiro evento
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {eventos.map((evento) => {
            const badge = getStatusBadge(evento.status);
            return (
              <div
                key={evento.id_evento}
                className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="relative w-full h-40 bg-gradient-to-br from-violet-200 to-fuchsia-200 rounded-xl mb-4 overflow-hidden">
                  {evento.imagem_url && (
                    <>
                      <img src={evento.imagem_url} alt={evento.titulo} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/10"></div>
                    </>
                  )}
                  <span className={`absolute top-3 right-3 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-10 ${badge.classe}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="px-2 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 leading-tight">{evento.titulo}</h3>

                  <button
                    type="button"
                    onClick={() => handleVerDetalhes(evento.id_evento)}
                    disabled={carregandoDetalhe === evento.id_evento}
                    className="mt-auto w-full py-2.5 rounded-lg text-sm font-bold bg-violet-50 hover:bg-violet-100 text-violet-700 transition-colors disabled:opacity-60"
                  >
                    {carregandoDetalhe === evento.id_evento ? "Carregando..." : "Ver detalhes"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {detalheEvento && (
        <DetalheEventoModal evento={detalheEvento} onClose={() => setDetalheEvento(null)} />
      )}
    </>
  );
}