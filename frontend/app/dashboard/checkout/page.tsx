"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get("eventId");
  const ticketId = searchParams.get("ticketId");

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-600">Finalizar compra</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Confirme seu ingresso</h1>
          </div>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Voltar ao dashboard
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-500">Evento selecionado</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">#{eventId ?? "-"}</p>
            <p className="mt-2 text-sm text-slate-600">Ingresso #{ticketId ?? "-"}</p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-500">Próximos passos</p>
            <ul className="mt-3 space-y-3 text-sm text-slate-700">
              <li>Reveja os dados do ingresso</li>
              <li>Insira os dados do comprador</li>
              <li>Complete o pagamento</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Informação</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Esta é uma tela de checkout demonstrativa. O fluxo de pagamento ainda não está implementado, mas o evento e o ingresso foram capturados com sucesso.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="rounded-3xl bg-violet-100 px-4 py-3 text-sm font-semibold text-violet-700">Evento: {eventId ?? "-"}</span>
            <span className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">Ingresso: {ticketId ?? "-"}</span>
          </div>

          <button
            type="button"
            onClick={() => alert("Fluxo de pagamento ainda não implementado.")}
            className="mt-8 inline-flex w-full items-center justify-center rounded-3xl bg-violet-600 px-6 py-4 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Ir para pagamento
          </button>
        </div>
      </div>
    </div>
  );
}
