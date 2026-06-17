import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona o usuário imediatamente para o dashboard
  redirect("/dashboard");
}