export default function FilterTabs({ categoriaAtiva, setCategoriaAtiva }) {
  const categorias = ["Todos", "Tecnologia", "Hackathon", "Redes", "Segurança"];

  return (
    <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      {categorias.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategoriaAtiva(cat === "Todos" ? "" : cat)}
          className={`px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
            (categoriaAtiva === cat || (cat === "Todos" && categoriaAtiva === ""))
              ? "bg-violet-600 text-white font-semibold shadow-md shadow-violet-500/30"
              : "bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}