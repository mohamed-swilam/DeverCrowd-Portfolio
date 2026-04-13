"use client";
export const dynamic = 'force-dynamic'; // ← أضف ده

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Mail, Shield, Trash2, Plus, CheckCircle2, Circle, ListTodo } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { cn } from "@/lib/utils";
import { useAdmins, useRegisterAdmin, useDeleteAdmin, type RegisterAdminInput } from "@/hooks/useAdmins";
import { mediaUrl } from "@/lib/mediaUrl";

const roleBadge = (role: string): string => {
  const r = role.toLowerCase();
  if (r === "ceo") return "border-destructive/30 bg-destructive/10 text-destructive dark:text-red-400";
  if (r === "cto") return "border-primary/30 bg-primary/10 text-primary";
  if (r === "cmo") return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400";
  if (r === "frontend" || r === "backend") return "border-secondary/40 bg-secondary/15 text-secondary";
  if (r === "uiux") return "border-accent/30 bg-accent/10 text-accent";
  return "border-border bg-muted text-muted-foreground";
};

const ROLES = ["Viewer", "Security", "UIUX", "CMO", "CTO", "Frontend", "Backend", "CEO", "Flutter"];

const emptyForm: RegisterAdminInput = {
  username: "",
  nickname: "",
  email: "",
  password: "",
  role: "Frontend",
  pic: null,
};

const FIELDS = [
  { label: "Username", key: "username", type: "text", placeholder: "john_doe", hint: "5-20 chars, letters/numbers/underscore" },
  { label: "Nickname", key: "nickname", type: "text", placeholder: "John", hint: "Letters only, no spaces" },
  { label: "Email", key: "email", type: "email", placeholder: "john@devercrowd.com", hint: "" },
  { label: "Password", key: "password", type: "password", placeholder: "Test@123", hint: "Uppercase, lowercase, number & special char" },
];

export default function AdminAdminsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<RegisterAdminInput>(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { data: admins = [], isLoading, isError } = useAdmins();
  const registerAdmin = useRegisterAdmin();
  const deleteAdmin = useDeleteAdmin();

  const filtered = admins.filter((a) =>
    [a.username, a.nickname, a.email, a.role].some((f) =>
      (f || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSave = () => {
    if (!form.username.trim() || !form.email.trim() || !form.password.trim() || !form.nickname.trim()) {
      return;
    }
    registerAdmin.mutate(form, {
      onSuccess: () => {
        setDialogOpen(false);
        setForm(emptyForm);
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteAdmin.mutate(id, {
      onSuccess: () => setConfirmDeleteId(null),
    });
  };

  if (isLoading) return <div className="p-8"><AdminLoader label="Loading admins…" /></div>;
  if (isError) return <div className="p-8"><AdminEmptyState title="Failed to load admins" description="Check your connection." /></div>;

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader title="Admins" description="Manage administrator accounts.">
        <Button className="gap-2" onClick={() => { setForm(emptyForm); setDialogOpen(true); }}>
          <Plus className="h-4 w-4" />
          New admin
        </Button>
      </AdminPageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: admins.length },
          { label: "Tasks assigned", value: admins.reduce((s, a) => s + (a.tasksNumber || 0), 0) },
          { label: "Tasks done", value: admins.reduce((s, a) => s + (a.tasksDone || 0), 0) },
          {
            label: "Completion",
            value: (() => {
              const total = admins.reduce((s, a) => s + (a.tasksNumber || 0), 0);
              const done = admins.reduce((s, a) => s + (a.tasksDone || 0), 0);
              return total === 0 ? "0%" : `${Math.round((done / total) * 100)}%`;
            })(),
          },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardHeader><CardTitle className="text-base">Search</CardTitle></CardHeader>
        <CardContent>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or role…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Register Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => !o && setDialogOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register new admin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {FIELDS.map(({ label, key, type, placeholder, hint }) => (
              <div key={key} className="space-y-2">
                <Label>{label}</Label>
                <Input
                  type={type}
                  placeholder={placeholder}
                  value={(form as unknown as Record<string, string>)[key] || ""}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                />
                {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
              </div>
            ))}

            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm((p) => ({ ...p, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Profile picture</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setForm((p) => ({ ...p, pic: e.target.files?.[0] ?? null }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={registerAdmin.isPending}>
              {registerAdmin.isPending ? "Registering…" : "Register"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog open={!!confirmDeleteId} onOpenChange={(o) => !o && setConfirmDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Delete admin?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
              disabled={deleteAdmin.isPending}
            >
              {deleteAdmin.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grid */}
      {filtered.length === 0 ? (
        <AdminEmptyState title="No admins found" description="Try a different search or add a new admin." />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((admin) => (
            <Card key={admin._id} className="border-border shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarImage src={mediaUrl(admin.pic)} alt={admin.nickname} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {admin.nickname?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate text-lg">{admin.nickname}</CardTitle>
                    <CardDescription className="truncate text-xs">@{admin.username}</CardDescription>
                    <CardDescription className="flex items-center gap-1 truncate text-xs">
                      <Mail className="h-3 w-3 shrink-0" />
                      {admin.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Badge variant="outline" className={cn("font-normal", roleBadge(admin.role))}>
                  <Shield className="mr-1 h-3 w-3" />
                  {admin.role}
                </Badge>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><ListTodo className="h-3 w-3" /> Tasks</span>
                    <span>{admin.tasksDone}/{admin.tasksNumber}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${admin.tasksNumber === 0 ? 0 : Math.round((admin.tasksDone / admin.tasksNumber) * 100)}%` }}
                    />
                  </div>
                </div>

                {admin.tasks && admin.tasks.length > 0 && (
                  <div className="space-y-1">
                    {admin.tasks.slice(0, 3).map((task, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        {task.priority === "high"
                          ? <CheckCircle2 className="h-3 w-3 text-destructive" />
                          : <Circle className="h-3 w-3" />
                        }
                        <span className="truncate">{task.title}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-destructive w-full"
                  onClick={() => setConfirmDeleteId(admin._id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}