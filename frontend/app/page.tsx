import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona o usuário da raiz (/) direto para o (/login)
  redirect("/login");
}