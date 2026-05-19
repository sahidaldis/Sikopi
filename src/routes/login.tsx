import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import logoUrl from "@/logo.png";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { session, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (session) return <Navigate to="/" />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await signIn(email, password);
      if (res.success) {
        toast.success("Selamat Datang Kembali");
        navigate({ to: "/" });
      } else {
        toast.error(`Login gagal: ${res.error || "Email atau password salah"}`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Terjadi kesalahan sistem");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-accent/40 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <img src={logoUrl} alt="SIKOPI Logo" className="w-64 h-auto object-contain mb-3" />
          <p className="text-[11px] text-muted-foreground/80 mt-1 font-mono">
            Masuk ke sistem asuhan keperawatan
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full mt-2" disabled={busy}>
            {busy ? "Memproses…" : "Masuk"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
