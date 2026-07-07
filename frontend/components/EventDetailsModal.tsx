"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatStatus(status: number) {
  if (status === 1) return "Ativo";
  if (status === 2) return "No Radar";
  return "Finalizado";
}

function formatLocation(endereco: any) {
  if (!endereco) return "Local a definir";
  return `${endereco.local}, ${endereco.rua}, ${endereco.cidade} - ${endereco.estado}`;
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
  if (typeof evento.hype_count === "number") return evento.hype_count;
  if (evento.reacoes && typeof evento.reacoes === "object") {
    return Object.values(evento.reacoes as Record<string, number>).reduce(
      (sum: number, count) => sum + (Number(count) || 0),
      0
    );
  }
  return evento.quant_reacoes || 0;
}

function getDefaultComments(evento: any) {
  if (Array.isArray(evento.comentarios) && evento.comentarios.length > 0) {
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

export default function EventDetailsModal({ evento, onClose }: { evento: any; onClose: () => void }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [comments, setComments] = useState(() => getDefaultComments(evento));
  const [hypeCount, setHypeCount] = useState<number>(() => getDefaultHypeCount(evento));
  const [hasHyped, setHasHyped] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setActiveImage(0);
    setCommentText("");
    setReplyToId(null);
    setComments(getDefaultComments(evento));
    setHypeCount(getDefaultHypeCount(evento));
    setHasHyped(false);
    setIsClosing(false);
  }, [evento.id_evento]);

  const handleClose = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      onClose();
    }, 180);
  };

  const imagens = useMemo(() => {
    if (evento.imagens?.length > 0) return evento.imagens;
    if (evento.imagem) return [evento.imagem];
    return [
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80",
    ];
  }, [evento.imagens, evento.imagem]);

  const variacoesIngressos = evento.variacoes_ingressos || [
    {
      id: `${evento.id_evento}-pista`,
      nome: "Pista",
      preco: evento.preco ?? 0,
      descricao: "Entrada geral com a melhor relação custo-benefício.",
    },
    {
      id: `${evento.id_evento}-vip`,
      nome: "VIP",
      preco: evento.preco ? evento.preco * 1.8 : 120,
      descricao: "Vagas limitadas com área exclusiva e atendimento premium.",
    },
  ];

  const ingressosDisponiveis = evento.ingressos_disponiveis ?? 120;
  const ingressosTotais = evento.ingressos_totais ?? 200;
  const disponibilidade = Math.min(100, Math.round((ingressosDisponiveis / ingressosTotais) * 100));

  const descricao = evento.descricao || evento.descricao_long ||
    `Conheça todos os detalhes do evento e aproveite uma experiência única.
- Som de qualidade e estrutura completa.
- Drinks e alimentação disponíveis.
- Networking e conexão com profissionais da área.`;

  const descricaoPartes = parseDescription(descricao);

  const subgenero = evento.subgenero
    ? `${evento.categoria} > ${evento.subgenero}`
    : evento.categoria;

  const handleCheckout = (ticket: any) => {
    router.push(`/dashboard/checkout?eventId=${evento.id_evento}&ticketId=${ticket.id}`);
  };

  const handleAuthRedirect = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleHype = () => {
    if (!isAuthenticated) return;

    const next = !hasHyped;
    setHasHyped(next);
    setHypeCount((current) => Math.max(0, current + (next ? 1 : -1)));
  };

  const handleSubmitComment = () => {
    if (!isAuthenticated || !commentText.trim()) return;
    const nextComment = {
      id: Date.now(),
      autor: user?.email?.split("@")[0] || "Você",
      mensagem: commentText.trim(),
      criadoEm: "Agora",
      respostas: [],
    };

    if (replyToId) {
      setComments((prev: any[]) => addReplyToTree(prev, replyToId, nextComment));
    } else {
      setComments((prev: any[]) => [nextComment, ...prev]);
    }

    setCommentText("");
    setReplyToId(null);
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
            <p className="text-xs text-slate-400">{comment.criadoEm}</p>
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
        <p className="text-sm text-slate-700 leading-relaxed">{comment.mensagem}</p>
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
        {variacoesIngressos.map((ticket: any) => (
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
        ))}
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
                    A partir de {evento.preco !== undefined ? formatCurrency(evento.preco) : "R$ 0"}
                  </div>
                </div>

                <div className="mt-4 md:mt-6 grid gap-3 md:gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-3 md:p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Localização</p>
                    <p className="mt-2 text-xs md:text-sm text-slate-700 leading-relaxed">{formatLocation(evento.endereco)}</p>
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
                  {descricaoPartes.map((part, index) => (
                    part.type === "paragraph" ? (
                      <p key={index}>{part.content[0]}</p>
                    ) : (
                      <ul key={index} className="list-disc space-y-2 pl-5">
                        {part.content.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    )
                  ))}
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
                    disabled={!isAuthenticated}
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
                disabled={!isAuthenticated}
                className="mt-2 md:mt-3 w-full resize-none rounded-3xl border border-slate-200 bg-white p-3 md:p-4 text-xs md:text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder={isAuthenticated ? "Escreva sua pergunta ou comentário..." : "Entre para participar da conversa."}
              />

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
                    className="rounded-2xl bg-violet-600 px-4 md:px-5 py-2 md:py-3 text-xs md:text-sm font-semibold text-white transition hover:bg-violet-700"
                  >
                    Enviar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}