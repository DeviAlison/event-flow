"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

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
  
  const [imagem, setImagem] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagem(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await apiFetch("/eventos", {
        method: "POST",
        body: {
          nome,
          descricao,
          data_inicio: dataInicio || undefined,
          data_fim: dataFim || undefined,
          nome_local: nomeLocal,
          endereco,
          numero: numero ? Number(numero) : undefined,
          cidade,
          estado,
          quant_pessoas: quantPessoas ? Number(quantPessoas) : undefined,
          imagem,
        },
      });

      setMensagem("Evento criado com sucesso!");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setErro((err as Error)?.message || "Falha na comunicação com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="pb-8">
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 pb-4 md:pb-6 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors shadow-sm shrink-0">
          <i className="bi bi-arrow-left text-lg md:text-xl font-bold"></i>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-pink-600 to-orange-500">
            Criar Novo Evento
          </h1>
          <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">Preencha os detalhes para publicar seu evento na plataforma.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 w-full">
        <div className="bg-violet-50/30 border border-violet-100 rounded-2xl p-4 md:p-6 shadow-sm">
          <h3 className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-4 md:mb-5 flex items-center gap-2">
            <i className="bi bi-card-text text-base"></i> Informações Principais
          </h3>
          <div className="space-y-4 md:space-y-5">
            <div>
              <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">Imagem de Capa (Opcional)</label>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full px-3 md:px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 transition-all cursor-pointer" />
              {imagem && <img src={imagem} alt="Preview" className="mt-4 h-24 w-32 md:h-32 md:w-48 object-cover rounded-xl shadow-md border border-slate-200" />}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">Nome do Evento *</label>
              <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all shadow-sm text-sm md:text-base" placeholder="Ex: Hackathon Code The Future" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">Descrição</label>
              <textarea rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all shadow-sm text-sm md:text-base" placeholder="Detalhes, cronograma, palestrantes..." />
            </div>
          </div>
        </div>

        <div className="bg-orange-50/40 border border-orange-100 rounded-2xl p-4 md:p-6 shadow-sm">
          <h3 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-4 md:mb-5 flex items-center gap-2">
            <i className="bi bi-calendar-event text-base"></i> Data e Hora
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div>
              <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">Início (Opcional)</label>
              <input type="datetime-local" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-sm text-sm md:text-base" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">Encerramento (Opcional)</label>
              <input type="datetime-local" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all shadow-sm text-sm md:text-base" />
            </div>
          </div>
        </div>

        <div className="bg-pink-50/40 border border-pink-100 rounded-2xl p-4 md:p-6 shadow-sm">
          <h3 className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-4 md:mb-5 flex items-center gap-2">
            <i className="bi bi-geo-alt text-base"></i> Localização e Capacidade
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">Nome do Local</label>
              <input type="text" value={nomeLocal} onChange={(e) => setNomeLocal(e.target.value)} className="w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-sm text-sm md:text-base" placeholder="Ex: Centro de Convenções" />
            </div>
            <div className="md:col-span-2 flex gap-3 md:gap-4">
              <div className="flex-1">
                <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">Endereço (Rua/Av) *</label>
                <input type="text" required value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-sm text-sm md:text-base" />
              </div>
              <div className="w-20 md:w-28">
                <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">Número</label>
                <input type="number" value={numero} onChange={(e) => setNumero(e.target.value)} className="w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-sm text-sm md:text-base" />
              </div>
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">Cidade *</label>
              <input type="text" required value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-sm text-sm md:text-base" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">Estado (UF) *</label>
              <input type="text" required maxLength={2} value={estado} onChange={(e) => setEstado(e.target.value.toUpperCase())} className="w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-sm text-sm md:text-base" placeholder="MG" />
            </div>
            
            <div className="pt-2 md:col-span-2">
              <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">Capacidade Máxima de Pessoas</label>
              <input type="number" value={quantPessoas} onChange={(e) => setQuantPessoas(e.target.value)} className="w-full md:max-w-[50%] px-3 md:px-4 py-2 md:py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-sm text-sm md:text-base" placeholder="Ex: 500" />
            </div>
          </div>
        </div>

        {erro && <div className="p-3 md:p-4 flex items-center gap-3 text-xs md:text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl shadow-sm"><i className="bi bi-exclamation-triangle"></i> {erro}</div>}
        {mensagem && <div className="p-3 md:p-4 flex items-center gap-3 text-xs md:text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm"><i className="bi bi-check-circle"></i> {mensagem}</div>}

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={carregando} className="py-2.5 md:py-3 px-6 md:px-8 flex items-center gap-2 bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 hover:opacity-90 text-white text-sm md:text-base font-bold rounded-xl transition-all shadow-lg shadow-violet-500/30 disabled:opacity-70">
            {carregando ? "Processando..." : "Publicar Evento"}
          </button>
        </div>
      </form>
    </div>
  );
}