import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const dados = await request.json();
    const { acao, email, codigo } = dados;

    // Simula o tempo de resposta do servidor (1.5 segundos)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Passo 1: Enviar o código para o e-mail
    if (acao === "enviar_codigo") {
      if (!email) {
        return NextResponse.json({ erro: "O e-mail é obrigatório." }, { status: 400 });
      }
      return NextResponse.json({ mensagem: "Código de 6 dígitos enviado para o seu e-mail!" }, { status: 200 });
    }

    // Passo 2: Validar se o código introduzido está correto
    if (acao === "validar_codigo") {
      if (codigo === "123456") {
        return NextResponse.json({ mensagem: "Identidade confirmada com sucesso!" }, { status: 200 });
      }
      return NextResponse.json({ erro: "Código inválido. Tente novamente." }, { status: 400 });
    }

    // Passo 3: Guardar a nova senha no banco de dados
    if (acao === "redefinir_senha") {
      return NextResponse.json({ mensagem: "Senha atualizada com sucesso!" }, { status: 200 });
    }

    return NextResponse.json({ erro: "Ação desconhecida." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ erro: "Erro interno no servidor." }, { status: 500 });
  }
}