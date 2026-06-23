"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CriarEvento() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [nomeLocal, setNomeLocal] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [quantPessoas, setQuantPessoas] = useState("");

  const handleSubmit = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch("/api/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome, descricao, dataInicio, dataFim, nomeLocal, endereco, numero, cidade, estado, quantPessoas
        }),
      });

      if (resposta.ok) {
        setMensagem("Evento criado com sucesso!");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setErro("Erro ao criar o evento.");
      }
    } catch (err) {
      setErro("Falha na comunicação com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    // Removido o 'h-full' e 'overflow' para rolar naturalmente e não cortar as bordas
    <div className="pb-8">
      
      {/* Header com toques de cor */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center justify-center w-11 h-11 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors shadow-sm">
          <i className="bi bi-arrow-left text-xl font-bold"></i>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-pink-600 to-orange-500">
            Criar Novo Evento
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Preencha os detalhes para publicar seu evento na plataforma.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        
        {/* Bloco 1: Informações Básicas (Violeta) */}
        <div className="bg-violet-50/30 border border-violet-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-5 flex items-center gap-2">
            <i className="bi bi-card-text text-base"></i> Informações Principais
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome do Evento *</label>
              <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all shadow-sm" placeholder="Ex: Hackathon Code The Future" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descrição</label>
              <textarea rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all shadow-sm" placeholder="Detalhes, cronograma, palestrantes..." />
            </div>
          </div>
        </div>

        {/* Bloco 2: Datas (Laranja) */}
        <div className="bg-orange-50/40 border border-orange-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-5 flex items-center gap-2">
            <i className="bi bi-calendar-event text-base"></i> Data e Hora
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Início *</label>
              <input type="datetime-local" required value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Encerramento *</label>
              <input type="datetime-local" required value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-sm" />
            </div>
          </div>
        </div>

        {/* Bloco 3: Localização (Rosa) */}
        <div className="bg-pink-50/40 border border-pink-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-5 flex items-center gap-2">
            <i className="bi bi-geo-alt text-base"></i> Localização e Capacidade
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome do Local</label>
              <input type="text" value={nomeLocal} onChange={(e) => setNomeLocal(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-sm" placeholder="Ex: Centro de Convenções / Teatro Municipal" />
            </div>
            <div className="md:col-span-2 flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Endereço (Rua/Av) *</label>
                <input type="text" required value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-sm" />
              </div>
              <div className="w-28">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Número</label>
                <input type="number" value={numero} onChange={(e) => setNumero(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cidade *</label>
              <input type="text" required value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Estado (UF) *</label>
              <input type="text" required maxLength={2} value={estado} onChange={(e) => setEstado(e.target.value.toUpperCase())} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-sm" placeholder="MG" />
            </div>
            
            <div className="pt-2 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Capacidade Máxima de Pessoas</label>
              <input type="number" value={quantPessoas} onChange={(e) => setQuantPessoas(e.target.value)} className="w-full md:max-w-[50%] px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-sm" placeholder="Ex: 500" />
            </div>
          </div>
        </div>

        {/* Alertas */}
        {erro && <div className="p-4 flex items-center gap-3 text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl shadow-sm"><i className="bi bi-exclamation-triangle"></i> {erro}</div>}
        {mensagem && <div className="p-4 flex items-center gap-3 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm"><i className="bi bi-check-circle"></i> {mensagem}</div>}

        {/* Botão de Submit */}
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={carregando} className="py-3 px-8 flex items-center gap-2 bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 hover:opacity-90 text-white text-base font-bold rounded-xl transition-all shadow-lg shadow-violet-500/30 disabled:opacity-70">
            {carregando ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processando...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg"></i> Publicar Evento
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}