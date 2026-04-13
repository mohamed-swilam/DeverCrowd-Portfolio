"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Search, Mail } from "lucide-react";
import { get, del } from "@/data/api";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";

function normalizeMessages(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.messages)) return payload.messages;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await get("/api/admin/message");
      if (cancelled) return;
      if (res.ok) {
        const raw = res.data?.data ?? res.data;
        setMessages(normalizeMessages(raw));
      } else {
        setMessages([]);
        toast.error(res.message || "Could not load messages (sign in as CEO/CTO)");
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id) => {
    const res = await del(`/api/admin/message/${id}`);
    if (res.ok) {
      setMessages((prev) => prev.filter((msg) => (msg._id || msg.id) !== id));
      toast.success("Message removed");
    } else {
      toast.error("Could not delete message");
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const hay = [msg.name, msg.email, msg.title, msg.knownBy, msg.requestedServices, msg.message]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <AdminLoader label="Loading messages…" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Messages"
        description="Contact form submissions from GET /api/admin/message (authenticated)."
      />

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, subject…"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search messages"
            />
          </div>
        </CardContent>
      </Card>

      {filteredMessages.length === 0 ? (
        <AdminEmptyState
          title="No messages"
          description={
            messages.length === 0
              ? "No submissions yet, or your session cannot access this endpoint."
              : "No results for this search."
          }
          icon={Mail}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredMessages.map((msg) => (
            <Card key={msg._id || msg.id} className="border-border shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="line-clamp-2 text-base">{msg.title || "No subject"}</CardTitle>
                    <CardDescription className="mt-1 space-y-0.5 text-sm">
                      <span className="block">
                        From: <span className="text-foreground">{msg.name || "—"}</span> ({msg.email || "—"})
                      </span>
                      <span className="block">Phone: {msg.phoneNumber || "—"}</span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive"
                    title="Delete message"
                    onClick={() => handleDelete(msg._id || msg.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Referral:</span> {msg.knownBy || "—"}
                  <br />
                  <span className="font-medium text-foreground">Service:</span> {msg.requestedServices || "—"}
                </p>
                <p className="rounded-lg border border-border bg-muted/30 p-3 text-sm leading-relaxed text-foreground">
                  {msg.message || "—"}
                </p>
                <Badge variant="secondary" className="text-xs font-normal">
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "—"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
