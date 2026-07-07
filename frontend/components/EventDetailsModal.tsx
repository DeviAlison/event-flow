"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
}

// O backend já manda o status como texto pronto ("Publicado", "Encerrado", "Esgotado").
// Mantemos o fallback numérico só por segurança, caso algum dado antigo/mockado chegue aqui.
function formatStatus(status: number | string) {
  if (typeof status === "string") return status;
  if (status === 1) return "Ativo";
  if (status === 2) return "No Radar";
  return "Finalizado";
}

// obter_detalhes_evento já retorna "localizacao" pronta (string única).
function formatLocation(evento: any) {
  if (evento?.localizacao) return evento.localizacao;
  if (evento?.endereco) {
    const e = evento.endereco;
    return `${e.local}, ${e.rua}, ${e.cidade} - ${e.estado}`;
  }
  return "Local a definir";
}

function parseDescription(descricao: string) {
  const linhas = descricao
    .split(/\r?\n/)
    .map((linha) => linha.trim())
    .filter(Boolean);

  const parts: Array<{ type: "paragraph" | "list"; content: string[] }> = [];
  let listBuffer: string[] = [];

  linhas.forEach((linha) => {
    if (linha.startsWith("- ")) {
      listBuffer.push(linha.replace(/^-\s+/, ""));
    } else {
      if (listBuffer.length > 0) {
        parts.push({ type: "list", content: listBuffer });
        listBuffer = [];
      }
      parts.push({ type: "paragraph", content: [linha] });
    }
  });

  if (listBuffer.length > 0) {
    parts.push({ type: "list", content: listBuffer });
  }

  return parts;
}

function getDefaultHypeCount(evento: any): number {
  if (typeof evento?.hype_count === "number") return evento.hype_count;
  if (evento?.reacoes && typeof evento.reacoes === "object") {
    return Object.values(evento.reacoes as Record<string, number>).reduce(
      (sum: number, count) => sum + (Number(count) || 0),
      0
    );
  }
  return evento?.quant_reacoes || 0;
}

function getDefaultComments(evento: any) {
  if (Array.isArray(evento?.comentarios) && evento.comentarios.length > 0) {
    return evento.comentarios;
  }
  return [];
}

function addReplyToTree(comments: any[], parentId: number, reply: any): any[] {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return {
        ...comment,
        respostas: [...(comment.respostas || []), reply],
      };
    }
    return {
      ...comment,
      respostas: comment.respostas
        ? addReplyToTree(comment.respostas, parentId, reply)
        : [],
    };
  });
}

// Monta as opções de ingresso (variacoesIngressos) a partir de
// evento.modalidades_ingresso (formato retornado por obter_detalhes_evento).
// Cada tipo de ingresso pode ter vários lotes; só mostramos os lotes ainda
// não esgotados.
function buildVariacoesIngressos(evento: any) {
  if (!Array.isArray(evento?.modalidades_ingresso)) return [];

  const opcoes: Array<{ id: number; nome: string; preco: number; descricao: string }> = [];

  evento.modalidades_ingresso.forEach((tipo: any) => {
    (tipo.lotes || [])
      .filter((lote: any) => !lote.esgotado)
      .forEach((lote: any) => {
        opcoes.push({
          id: lote.id_lote,
          nome: `${tipo.nome} • Lote ${lote.numero_lote}`,
          preco: lote.preco,
          descricao: tipo.descricao,
        });
      });
  });

  return opcoes;
}

export default function EventDetailsModal({ evento: eventoResumo, onClose }: { evento: any; onClose: () => void }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [comments, setComments] = useState(() => getDefaultComments(eventoResumo));
  const [hypeCount, setHypeCount] = useState<number>(() => getDefaultHypeCount(eventoResumo));
  const [hasHyped, setHasHyped] = useState(false);
  const [hypeLoading, setHypeLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [erroComentario, setErroComentario] = useState("");

  // Detalhes completos vindos de GET /api/eventos/<id> (obter_detalhes_evento).
  // O objeto que chega pela listagem (eventoResumo) não tem descrição completa,
  // ingressos por lote nem comentários — por isso buscamos os detalhes reais
  // assim que o modal abre.
  const [detalhes, setDetalhes] = useState<any | null>(null);
  const [loadingDetalhes, setLoadingDetalhes] = useState(true);
  const [erroDetalhes, setErroDetalhes] = useState("");

  const idEvento = eventoResumo.id_evento;

  useEffect(() => {
    setActiveImage(0);
    setCommentText("");
    setReplyToId(null);
    setIsClosing(false);
    setErroComentario("");
    setDetalhes(null);
    setLoadingDetalhes(true);
    setErroDetalhes("");

    let cancelado = false;

    apiFetch<any>(`/eventos/${idEvento}`)
      .then((data) => {
        if (cancelado) return;
        setDetalhes(data);
        setComments(getDefaultComments(data));
        setHypeCount(getDefaultHypeCount(data));
        setHasHyped(false); // o backend não informa se o usuário logado já curtiu
      })
      .catch((err) => {
        if (cancelado) return;
        setErroDetalhes((err as Error)?.message || "Não foi possível carregar os detalhes do evento.");
      })
      .finally(() => {
        if (!cancelado) setLoadingDetalhes(false);
      });

    return () => {
      cancelado = true;
    };
  }, [idEvento]);

  const handleClose = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      onClose();
    }, 180);
  };

  // Enquanto os detalhes carregam, usamos o resumo só para não deixar a tela em branco.
  const evento = detalhes ?? eventoResumo;

  const imagens = useMemo(() => {
    if (evento.imagens?.length > 0) return evento.imagens;
    if (evento.imagem_url) return [evento.imagem_url];
    if (evento.imagem) return [evento.imagem];
    return [
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80",
    ];
  }, [evento.imagens, evento.imagem_url, evento.imagem]);

  const variacoesIngressos = useMemo(() => buildVariacoesIngressos(detalhes), [detalhes]);

  const ingressosDisponiveis = evento.ingressos_disponiveis ?? 0;
  const ingressosTotais = evento.ingressos_totais ?? 0;
  const disponibilidade = ingressosTotais > 0
    ? Math.min(100, Math.round((ingressosDisponiveis / ingressosTotais) * 100))
    : 0;

  const descricao = evento.descricao || evento.descricao_long || "";
  const descricaoPartes = parseDescription(descricao);

  // "categoria" já vem pronta do backend como "Categoria > Gênero".
  const subgenero = evento.categoria || "";

  const precoBase = evento.preco ?? evento.preco_base;

  const handleCheckout = (ticket: any) => {
    router.push(`/dashboard/checkout?eventId=${idEvento}&ticketId=${ticket.id}`);
  };

  const handleAuthRedirect = (path: string) => {
    onClose();
    router.push(path);
  };

  // Alterna a curtida do evento via POST /api/eventos/<id>/curtir.
  // Observação: como o GET de detalhes não informa se o usuário já curtiu
  // antes, hasHyped sempre começa como false ao abrir o modal — o toggle
  // reflete corretamente a partir do primeiro clique nesta sessão.
  const handleHype = async () => {
    if (!isAuthenticated || hypeLoading) return;

    setHypeLoading(true);
    try {
      const resposta = await apiFetch<{ status_curtido: boolean }>(`/eventos/${idEvento}/curtir`, {
        method: "POST",
      });
      const curtido = resposta.status_curtido;
      setHasHyped(curtido);
      setHypeCount((atual) => Math.max(0, atual + (curtido ? 1 : -1)));
    } catch (err) {
      console.error("Erro ao curtir evento:", err);
    } finally {
      setHypeLoading(false);
    }
  };

  // Publica um comentário (ou resposta) via POST /api/eventos/<id>/comentarios.
  const handleSubmitComment = async () => {
    if (!isAuthenticated || !commentText.trim() || postingComment) return;

    setPostingComment(true);
    setErroComentario("");

    try {
      const payload: { texto: string; comentario_pai_id?: number } = {
        texto: commentText.trim(),
      };
      if (replyToId) payload.comentario_pai_id = replyToId;

      const resposta = await apiFetch<{ comentario: any }>(`/eventos/${idEvento}/comentarios`, {
        method: "POST",
        body: payload,
      });

      const novoComentario = { ...resposta.comentario, respostas: [] };

      if (replyToId) {
        setComments((prev: any[]) => addReplyToTree(prev, replyToId, novoComentario));
      } else {
        setComments((prev: any[]) => [novoComentario, ...prev]);
      }

      setCommentText("");
      setReplyToId(null);
    } catch (err) {
      setErroComentario((err as Error)?.message || "Não foi possível publicar o comentário.");
    } finally {
      setPostingComment(false);
    }
  };

  const handleCommentKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmitComment();
    }
  };

  const handleReply = (commentId: number) => {
    if (!isAuthenticated) return;
    setReplyToId(commentId);
  };

  const renderComments = (commentList: any[], level = 0) => {
    return commentList.map((comment) => (
      <div
        key={comment.id}
        style={{ marginLeft: level * 16 }}
        className="border border-slate-200 rounded-3xl bg-slate-50 p-4 mb-3"
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{comment.autor}</p>
            <p className="text-xs text-slate-400">{comment.data}</p>
          </div>
          <button
            type="button"
            onClick={() => handleReply(comment.id)}
            disabled={!isAuthenticated}
            className="text-xs font-semibold text-violet-700 hover:text-violet-900 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:text-slate-400"
          >
            Responder
          </button>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{comment.texto}</p>
        {comment.respostas?.length > 0 && renderComments(comment.respostas, level + 1)}
      </div>
    ));
  };

  const renderTicketsSection = () => (
    <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Escolha seu ingresso</p>
          <p className="text-sm text-slate-500">Selecione o tipo e avance para pagamento.</p>
        </div>
        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
          {variacoesIngressos.length} opções
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {variacoesIngressos.length > 0 ? (
          variacoesIngressos.map((ticket: any) => (
            <div key={ticket.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-900">{ticket.nome}</p>
                  <p className="mt-1 text-sm text-slate-600">{ticket.descricao}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(ticket.preco)}</p>
                  <button
                    type="button"
                    onClick={() => handleCheckout(ticket)}
                    className="mt-3 inline-flex items-center justify-center rounded-2xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
            Nenhum ingresso disponível para este evento no momento.
          </p>
        )}
      </div>
    </div>
  );

  const overlayAnimation = isClosing ? "animate-modal-out" : "animate-modal-in";
  const panelAnimation = isClosing ? "animate-modal-panel-out" : "animate-modal-panel-in";

  return (
    <div onClick={handleClose} className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm ${overlayAnimation}`}>
      <div onClick={(event) => event.stopPropagation()} className={`relative w-full max-w-[1200px] h-[calc(100vh-2rem)] overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-200 ${panelAnimation}`}>
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
          aria-label="Fechar detalhes do evento"
        >
          <i className="bi bi-x-lg"></i>
        </button>

        {loadingDetalhes ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600"></div>
          </div>
        ) : erroDetalhes ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-sm font-semibold text-red-700">{erroDetalhes}</p>
            <p className="text-sm text-slate-500">Feche e tente abrir o evento novamente.</p>
          </div>
        ) : (
        <div className="grid h-full min-h-0 grid-cols-1 gap-6 overflow-y-auto p-6 lg:overflow-hidden lg:grid-cols-2">
          {/* Coluna esquerda: evento + ingressos (altura fixa, com scroll próprio se necessário) */}
          <div className="flex flex-col gap-3 md:gap-4 rounded-[1.5rem] bg-slate-100 p-4 md:p-5 lg:h-full lg:min-h-0 lg:overflow-y-auto">
            <div className="relative flex h-[180px] md:h-[240px] shrink-0 flex-col overflow-hidden rounded-[1.5rem] bg-slate-900 shadow-inner lg:h-[260px]">
              <img
                src={imagens[activeImage]}
                alt={`${evento.titulo} imagem ${activeImage + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
              <div className="absolute left-0 right-0 bottom-0 flex items-center justify-between gap-3 p-4">
                <div className="rounded-3xl bg-slate-900/70 px-4 py-3 text-slate-100 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">{formatStatus(evento.status)}</p>
                  <p className="mt-1 text-sm font-semibold">{subgenero}</p>
                </div>
                {imagens.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveImage((prev) => (prev - 1 + imagens.length) % imagens.length)}
                      className="rounded-full bg-white/90 p-2 text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImage((prev) => (prev + 1) % imagens.length)}
                      className="rounded-full bg-white/90 p-2 text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="rounded-[1.5rem] bg-white p-4 md:p-5 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-slate-500">{evento.data} • {evento.hora}</p>
                    <h2 className="mt-2 md:mt-3 text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">{evento.titulo}</h2>
                  </div>
                  <div className="rounded-3xl bg-slate-900 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-white shadow-sm">
                    A partir de {precoBase !== undefined ? formatCurrency(precoBase) : "R$ 0"}
                  </div>
                </div>

                <div className="mt-4 md:mt-6 grid gap-3 md:gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-3 md:p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Localização</p>
                    <p className="mt-2 text-xs md:text-sm text-slate-700 leading-relaxed">{formatLocation(evento)}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-3 md:p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ingressos</p>
                    <p className="mt-2 text-xs md:text-sm text-slate-700">Disponíveis {ingressosDisponiveis} de {ingressosTotais}</p>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-violet-600" style={{ width: `${disponibilidade}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-white p-4 md:p-5 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-lg md:text-xl font-semibold text-slate-900">Descrição do evento</h3>
                <div className="mt-3 md:mt-4 space-y-3 md:space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
                  {descricaoPartes.length > 0 ? (
                    descricaoPartes.map((part, index) => (
                      part.type === "paragraph" ? (
                        <p key={index}>{part.content[0]}</p>
                      ) : (
                        <ul key={index} className="list-disc space-y-2 pl-5">
                          {part.content.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      )
                    ))
                  ) : (
                    <p className="text-slate-400">Este evento ainda não possui uma descrição.</p>
                  )}
                </div>
              </div>

              {renderTicketsSection()}
            </div>
          </div>

          {/* Coluna direita: comentários e reações em altura total, fixa, com scroll só na lista de comentários */}
          <div className="flex flex-col rounded-[1.5rem] border border-slate-200 bg-white p-4 md:p-5 shadow-sm lg:h-full lg:min-h-0">
            <div className="shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base md:text-lg font-semibold text-slate-900">Comentários e reações</p>
                  <p className="text-xs md:text-sm text-slate-500">
                    {comments.length} {comments.length === 1 ? "comentário" : "comentários"} • Interaja com a comunidade.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {replyToId ? (
                    <button type="button" className="text-xs md:text-sm text-slate-500 hover:text-slate-700" onClick={() => setReplyToId(null)}>
                      Cancelar resposta
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleHype}
                    disabled={!isAuthenticated || hypeLoading}
                    aria-pressed={hasHyped}
                    aria-label={`Hype: ${hypeCount}`}
                    title={!isAuthenticated ? "Entre para reagir" : undefined}
                    className={`inline-flex items-center gap-1.5 md:gap-2 rounded-2xl border px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold transition ${
                      hasHyped
                        ? "border-violet-300 bg-violet-100 text-violet-800"
                        : "border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50"
                    } disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-slate-200 disabled:hover:bg-white`}
                  >
                    <span aria-hidden="true">🔥</span>
                    <span>Hype</span>
                    <span className="rounded-full bg-slate-900/5 px-1.5 py-0.5 text-[11px] font-bold text-slate-600">
                      {hypeCount}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 md:mt-4 max-h-[45vh] overflow-y-auto pr-2 lg:max-h-none lg:min-h-0 lg:flex-1">
              {comments.length > 0 ? (
                renderComments(comments)
              ) : (
                <p className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4 md:p-6 text-center text-xs md:text-sm text-slate-500">
                  Nenhum comentário ainda. Seja o primeiro a participar.
                </p>
              )}
            </div>

            <div className="mt-3 md:mt-4 shrink-0 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3 md:p-4">
              <p className="text-xs md:text-sm font-medium text-slate-900">{isAuthenticated ? "Deixe sua mensagem" : "Faça login para comentar"}</p>
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                onKeyDown={handleCommentKeyDown}
                rows={3}
                disabled={!isAuthenticated || postingComment}
                className="mt-2 md:mt-3 w-full resize-none rounded-3xl border border-slate-200 bg-white p-3 md:p-4 text-xs md:text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder={isAuthenticated ? "Escreva sua pergunta ou comentário..." : "Entre para participar da conversa."}
              />

              {erroComentario && (
                <p className="mt-2 text-xs font-semibold text-red-700">{erroComentario}</p>
              )}

              {!isAuthenticated && (
                <div className="mt-3 md:mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleAuthRedirect("/login")}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Entrar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAuthRedirect("/cadastro")}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Criar conta
                  </button>
                </div>
              )}

              {isAuthenticated && (
                <div className="mt-3 md:mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    {replyToId ? "Respondendo a um comentário" : "Comentário público"}
                  </span>
                  <button
                    type="button"
                    onClick={handleSubmitComment}
                    disabled={postingComment || !commentText.trim()}
                    className="rounded-2xl bg-violet-600 px-4 md:px-5 py-2 md:py-3 text-xs md:text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {postingComment ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}