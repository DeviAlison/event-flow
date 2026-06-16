import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const dados = await request.json();

    // Simula tempo de resposta do servidor
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simula uma validação simples
    if (dados.email === "admin@teste.com") {
      return NextResponse.json({ erro: "Este e-mail já está cadastrado!" }, { status: 400 });
    }

    return NextResponse.json(
      { mensagem: "Usuário registrado com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ erro: "Erro interno no servidor" }, { status: 500 });
  }
}