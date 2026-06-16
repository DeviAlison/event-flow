"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoPessoa, setTipoPessoa] = useState<"pf" | "pj">("pf");
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const limparMensagem = () => {
    setMensagem("");
    setErro("");
  };

  const handleSubmit = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    limparMensagem();

    if (senha !== confirmacao) {
      setErro("As senhas não coincidem. Verifique e tente novamente.");
      return;
    }

    if (tipoPessoa === "pf" && !cpf.trim()) {
      setErro("Por favor, informe o CPF para pessoa física.");
      return;
    }

    if (tipoPessoa === "pj" && !cnpj.trim()) {
      setErro("Por favor, informe o CNPJ para pessoa jurídica.");
      return;
    }

    setMensagem("Formulário preenchido com sucesso. Os dados não são salvos neste protótipo.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 relative overflow-hidden">
      <div className="relative w-full max-w-md bg-slate-50 rounded-2xl shadow-2xl shadow-violet-900/20 p-8 pt-6 pb-24 border border-slate-200 mt-10 mb-10">
        <Link href="/login" className="absolute top-6 left-6 z-50 flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </Link>
        <div className="flex justify-center mb-0">
          <Image
            src="/logo.png"
            alt="Logo Event Flow"
            width={200}
            height={200}
            priority
            className="object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2 mt-2">Criar nova conta</h2>

        <p className="text-center text-sm text-slate-600 mb-4">
          Preencha os campos abaixo para criar sua conta. Todos os campos são obrigatórios.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Nome completo</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Crie uma senha"
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Confirmação de senha</label>
            <input
              type="password"
              required
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              placeholder="Repita a senha"
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Telefone</label>
            <input
              type="tel"
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
            />
          </div>

          <fieldset className="rounded-2xl border border-slate-200 bg-white p-4">
            <legend className="text-sm font-medium text-slate-900 mb-3">Tipo de pessoa</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="cursor-pointer rounded-2xl border border-slate-300 px-4 py-3 transition hover:border-violet-500">
                <input
                  type="radio"
                  name="tipoPessoa"
                  value="pf"
                  checked={tipoPessoa === "pf"}
                  onChange={() => setTipoPessoa("pf")}
                  required
                  className="mr-2 accent-violet-600"
                />
                Pessoa Física
              </label>
              <label className="cursor-pointer rounded-2xl border border-slate-300 px-4 py-3 transition hover:border-violet-500">
                <input
                  type="radio"
                  name="tipoPessoa"
                  value="pj"
                  checked={tipoPessoa === "pj"}
                  onChange={() => setTipoPessoa("pj")}
                  className="mr-2 accent-violet-600"
                />
                Pessoa Jurídica
              </label>
            </div>
          </fieldset>

          {tipoPessoa === "pf" ? (
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">CPF</label>
              <input
                type="text"
                required
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">CNPJ</label>
              <input
                type="text"
                required
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
              />
            </div>
          )}

          {erro ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</div>
          ) : mensagem ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{mensagem}</div>
          ) : null}

          <button
            type="submit"
            className="w-full flex items-center justify-center py-2.5 px-4 bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 hover:opacity-90 text-white font-semibold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 shadow-md shadow-violet-500/30"
          >
            Finalizar cadastro
          </button>
        </form>
      </div>
    </div>
  );
}
