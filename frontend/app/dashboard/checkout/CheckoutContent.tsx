"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get("eventId");
  const ticketId = searchParams.get("ticketId");

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* ... O seu código JSX original continua igual aqui ... */}
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200">
         {/* ... resto do seu JSX ... */}
      </div>
    </div>
  );
}