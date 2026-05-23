import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldAlert, User, KeyRound, Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { updateCredentials, user } = useAuth();
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // Load active username from auth context
  useEffect(() => {
    if (user && user.email) {
      setUsername(user.email);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Username tidak boleh kosong");
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        toast.error("Password baru minimal harus 6 karakter");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("Konfirmasi password tidak cocok");
        return;
      }
    }

    setBusy(true);
    try {
      // updateCredentials already maps the short username to the fake email internally
      const success = await updateCredentials(username.trim(), newPassword);
      
      if (success) {
        toast.success("Pengaturan akun berhasil diperbarui!");
        // Clear password fields after success
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error("Gagal memperbarui pengaturan. Pastikan koneksi internet stabil.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Sikopi</h1>
        <p className="text-sm text-muted-foreground">
          Kelola kredensial login asisten atau admin untuk mengakses aplikasi SIKOPI secara offline.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <Card className="shadow-lg border bg-card text-card-foreground">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <KeyRound className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Kredensial Akun</CardTitle>
                <CardDescription className="text-xs">
                  Ganti username dan password Anda di sini untuk menjaga keamanan data klinik.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="settings-username" className="font-semibold text-xs flex items-center gap-1.5">
                  <User className="size-3.5 text-muted-foreground" /> Username Baru
                </Label>
                <Input
                  id="settings-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username baru"
                  required
                />
              </div>

              <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 flex gap-3 text-xs text-amber-800 my-2">
                <ShieldAlert className="size-4 shrink-0 mt-0.5 text-amber-600" />
                <div className="space-y-1">
                  <p className="font-bold">Tips Keamanan:</p>
                  <p>Kosongkan kolom password di bawah ini jika Anda **hanya** ingin mengubah username saja tanpa mengganti password saat ini.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="settings-password" className="font-semibold text-xs flex items-center gap-1.5">
                    <KeyRound className="size-3.5 text-muted-foreground" /> Password Baru
                  </Label>
                  <Input
                    id="settings-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 5 karakter"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-confirm" className="font-semibold text-xs flex items-center gap-1.5">
                    <KeyRound className="size-3.5 text-muted-foreground" /> Konfirmasi Password Baru
                  </Label>
                  <Input
                    id="settings-confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/10 justify-end gap-2 py-4">
            <Button type="submit" disabled={busy} className="bg-primary text-primary-foreground gap-1.5 size-sm sm:size-default">
              <Save className="size-4" />
              {busy ? "Menyimpan…" : "Simpan Perubahan"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
