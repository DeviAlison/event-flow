"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false); 
  const [mensagemErro, setMensagemErro] = useState(""); 
  const router = useRouter(); 

  const fazerLogin = (evento: React.FormEvent) => {
    evento.preventDefault(); 
    if (carregando) return;

    setCarregando(true); 
    setMensagemErro(""); 
    setTimeout(() => {
      if (email === "admin@teste.com" && senha === "123456") {
        setCarregando(false); 
        router.push("/dashboard"); 
      } else {
        setCarregando(false);
        setMensagemErro("Erro: E-mail ou senha incorretos!"); 
        setEmail(""); 
        setSenha(""); 
        setTimeout(() => {
          setMensagemErro("");
        }, 4000);
      }
    }, 3000); 
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Acesse sua conta</h2>

        <form onSubmit={fazerLogin} className="flex flex-col gap-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">E-mail</label>
            <input
              type="email"
              required
              disabled={carregando}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors disabled:opacity-50"
              placeholder="Insira seu Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Senha</label>
            <input
              type="password"
              required
              disabled={carregando}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors disabled:opacity-50"
              placeholder="Insira sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)} 
            />
          </div>
          
          <button
            type="submit"
            className="w-full flex items-center justify-center py-2.5 px-4 bg-indigo-500 hover:bg-indigo-800 cursor-pointer text-white font-semibold rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            disabled={carregando}
          >
            {carregando ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Conectando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>

      {mensagemErro && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl transition-all animate-bounce z-50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="font-semibold">{mensagemErro}</span>
        </div>
      )}

    </div>
  );
}