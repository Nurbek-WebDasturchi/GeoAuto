import { useQuery } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { Seo } from "@/components/layout/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { getConversations } from "@/features/messages/message-api";
import { useAuthStore } from "@/stores/auth-store";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:8080";

export const MessagesPage = () => {
  const token = useAuthStore((state) => state.token);
  const { data, refetch } = useQuery({ queryKey: ["conversations"], queryFn: getConversations });

  useEffect(() => {
    if (!token) return;
    const socket = io(SOCKET_URL, { auth: { token } });
    socket.on("message:new", () => refetch());
    return () => {
      socket.disconnect();
    };
  }, [token, refetch]);

  return (
    <main className="container py-6">
      <Seo title="Xabarlar" description="Sotuvchi va xaridor o‘rtasidagi real-time xabarlar." />
      <h1 className="text-3xl font-extrabold">Xabarlar</h1>
      <div className="mt-6 grid gap-3">
        {data?.data.map((conversation) => (
          <article key={conversation.id} className="rounded-lg border border-border p-4">
            <h2 className="font-bold">{conversation.listing.brand} {conversation.listing.model}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{conversation.messages[0]?.body ?? "Suhbat boshlandi"}</p>
          </article>
        ))}
      </div>
      {data && data.data.length === 0 ? <EmptyState title="Suhbatlar yo‘q">E’lon sahifasidan sotuvchiga yozishingiz mumkin.</EmptyState> : null}
    </main>
  );
};
