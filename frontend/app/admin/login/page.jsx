"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Code2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { post } from "@/data/api";
import { getAdminCookie, setAdminCookie, STORAGE_TOKEN_KEY } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getAdminCookie(STORAGE_TOKEN_KEY)) {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await post("/api/admin/login", { username, password });
      if (res.ok && res.data?.token) {
        setAdminCookie(STORAGE_TOKEN_KEY, res.data.token);
        setAdminCookie("username", res.data.username);
        toast.success("Signed in");
        router.replace("/admin");
        router.refresh();
      } else {
        toast.error(res.message || "Invalid credentials");
      }
    } catch {
      toast.error("Could not sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background via-muted/20 to-background px-4 py-12">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-lg font-bold tracking-tight text-foreground"
        >
          <Code2 className="h-8 w-8 text-primary" aria-hidden />
          <span className="gradient-text">DeverCrowd</span>
        </Link>

        <Card className="w-full max-w-md border-border shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin sign in</CardTitle>
            <CardDescription>Use your dashboard credentials (CEO / CTO role for full access).</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Sign in
              </Button>
            </form>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              <Link href="/" className="underline-offset-4 hover:underline">
                ← Back to website
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}