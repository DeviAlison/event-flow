"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import EventCard from "@/components/EventCard";
import Header from "@/components/Header";
import FilterTabs from "@/components/FilterTabs";

// Estrutura de cada entrada armazenada no cache de buscas
type EventosCacheEntry = {
  eventos: never[];
  paginacao: { pagina: number; qntd_item_pag: number };
};

export default function Dashboard() {
  // Estados para armazenar os dados da API
  const [eventos, setEventos] = useState([]);
  const [paginacao, setPaginacao] = useState({ pagina: 1, qntd_item_pag: 30 });
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  // Estados para os filtros e controle de página
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  // Cache em memória: evita repetir requisições para a mesma combinação de filtros/página
  const cacheRef = useRef<Map<string, EventosCacheEntry>>(new Map());

  // Sempre que o usuário digitar algo na busca ou mudar de categoria,
  // voltamos automaticamente para a página 1 para evitar inconsistências
  useEffect(() => {
    setPaginaAtual(1);
  }, [search, categoria]);

  // Efeito responsável por buscar os dados no backend falso (/api/eventos)
  // Inclui: debounce maior, minLength, cache em memória e cancelamento via AbortController
  useEffect(() => {
    // Normaliza o termo de busca (mesma regra aplicada pelo backend) para melhorar o hit rate do cache
    const searchTerm = search.trim().toLowerCase();

    // Evita requisição para termos muito curtos (1 caractere gera muito ruído)
    if (searchTerm.length === 1) {
      setLoading(false);
      return;
    }

    // Montando dinamicamente os Query Parameters
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (categoria) params.append("categoria", categoria);
    params.append("pagina", paginaAtual.toString());
    const cacheKey = params.toString();

    // Cache hit: reutiliza resultado já buscado para essa combinação de filtros/página
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setEventos(cached.eventos);
      setPaginacao(cached.paginacao);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    // Debounce de 700ms para aguardar o usuário terminar de digitar
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        // Fazendo a requisição para a rota interna do Next.js
        const response = await fetch(`/api/eventos?${cacheKey}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Falha ao buscar eventos");
        }

        const data = await response.json();
        const novosEventos = data.eventos || [];
        const novaPaginacao = data.paginacao || paginacao;

        // Guarda no cache para futuras buscas idênticas
        cacheRef.current.set(cacheKey, { eventos: novosEventos, paginacao: novaPaginacao });

        // Atualizando os estados com o retorno da API
        setEventos(novosEventos);
        setPaginacao(novaPaginacao);

      } catch (error) {
        // Ignora erros de cancelamento (requisição obsoleta abortada)
        if ((error as Error)?.name !== "AbortError") {
          console.error("Erro na integração com a API:", error);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 700);

    // Limpa o timeout e cancela a requisição em andamento se algo mudar antes dos 700ms
    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [search, categoria, paginaAtual]); // Executa novamente se qualquer um desses mudar

  // Heurística de fim de página: se o backend enviou menos itens do que o limite, a página atual é a última
  const ehUltimaPagina = eventos.length < paginacao.qntd_item_pag;

  const gridColumns = sidebarVisible ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-4";

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 flex justify-center font-sans">
      <div className="w-full max-w-[1400px] flex gap-6 h-[calc(100vh-3rem)] relative">
        <Sidebar visible={sidebarVisible} onToggleSidebar={() => setSidebarVisible(false)} />

        {!sidebarVisible && (
          <button
            type="button"
            onClick={() => setSidebarVisible(true)}
            className="fixed left-4 top-4 z-20 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-200 shadow-lg text-slate-700 hover:bg-slate-50 transition-colors"
            aria-label="Abrir menu"
          >
            <i className="bi bi-list text-xl"></i>
          </button>
        )}

        {/* Adicionado 'flex flex-col justify-between' para empurrar a paginação para o rodapé */}
        <main className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 overflow-y-auto flex flex-col justify-between">
          
          <div>
            {/* Passando a função de atualização de busca para o Header */}
            <Header onSearch={setSearch} />
            
            {/* Passando o estado da categoria e sua função de atualização */}
            <FilterTabs 
              categoriaAtiva={categoria} 
              setCategoriaAtiva={setCategoria} 
            />

            {/* Renderização Condicional: Loading -> Grid ou Mensagem de Vazio */}
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
              </div>
            ) : eventos.length === 0 ? (
              <div className="text-center py-12">
                <i className="bi bi-calendar-x text-4xl text-slate-300 mb-3 block"></i>
                <p className="text-slate-500 font-medium">Nenhum evento encontrado para a sua busca.</p>
              </div>
            ) : (
              <div className={`grid ${gridColumns} gap-6`}>
                {eventos.map((evento) => (
                  // Importante: Alterado de 'evento.id' para 'evento.id_evento' conforme o JSON da API
                  <EventCard key={evento.id_evento} evento={evento} />
                ))}
              </div>
            )}
          </div>

          {/* Componente de Barra de Paginação */}
          {!loading && eventos.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-8">
              <button
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
              >
                <i className="bi bi-chevron-left"></i>
                Anterior
              </button>

              <span className="text-sm font-semibold text-slate-600">
                Página {paginaAtual}
              </span>

              <button
                onClick={() => setPaginaAtual((prev) => prev + 1)}
                disabled={ehUltimaPagina}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
              >
                Próxima
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
