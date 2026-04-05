"use client";

import { useState, useMemo } from "react";
import {
  useAdminPricingPlans,
  useCreatePricingPlan,
  useUpdatePricingPlan,
  useDeletePricingPlan,
  CreatePlanBody,
  PricingFormData,
  PricingPlan,
} from "@/hooks/usePricing";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Star, AlertCircle, Globe, Smartphone, Layers, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Filter Types ──────────────────────────────────────────────────────────────
type ServiceFilter = "all" | "web" | "mobile" | "web+mobile" | "shopify";
type BillingFilter = "all" | "monthly" | "yearly" | "one-time";

const SERVICE_FILTERS: { value: ServiceFilter; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All", icon: <Layers className="h-3.5 w-3.5" /> },
  { value: "web", label: "Web", icon: <Globe className="h-3.5 w-3.5" /> },
  { value: "mobile", label: "Mobile", icon: <Smartphone className="h-3.5 w-3.5" /> },
  { value: "web+mobile", label: "Web + Mobile", icon: <Layers className="h-3.5 w-3.5" /> },
  { value: "shopify", label: "Shopify", icon: <ShoppingBag className="h-3.5 w-3.5" /> },
];

const BILLING_FILTERS: { value: BillingFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "one-time", label: "One-time" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const emptyForm = (): PricingFormData => ({
  title: "",
  slug: "",
  description: "",
  originalPrice: 0,
  discountPercent: 0,
  currency: "USD",
  featuresText: "",
  highlighted: false,
  sortOrder: 0,
  isActive: true,
  billingCycle: "monthly",
  serviceType: "web",
});

function slugify(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function formToBody(form: PricingFormData): CreatePlanBody {
  return {
    title: form.title.trim(),
    slug: slugify(form.slug || form.title),
    description: form.description.trim(),
    originalPrice: Number(form.originalPrice),
    currency: form.currency.trim() || "USD",
    features: form.featuresText.split(",").map((s) => s.trim()).filter(Boolean),
    highlighted: form.highlighted,
    sortOrder: Number(form.sortOrder) || 0,
    isActive: form.isActive,
    billingCycle: form.billingCycle,
    discountPercent: form.discountPercent || 0,
    serviceType: form.serviceType || "web",
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function AdminPricingPage() {
  const { data: plans = [], isLoading, isError, error } = useAdminPricingPlans();
  const createMutation = useCreatePricingPlan();
  const updateMutation = useUpdatePricingPlan();
  const deleteMutation = useDeletePricingPlan();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PricingFormData>(emptyForm());

  // ─── Filters ──────────────────────────────────────────────────────────────────
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all");
  const [billingFilter, setBillingFilter] = useState<BillingFilter>("all");

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const serviceMatch = serviceFilter === "all" || (plan as any).serviceType === serviceFilter;
      const billingMatch = billingFilter === "all" || plan.billingCycle === billingFilter;
      return serviceMatch && billingMatch;
    });
  }, [plans, serviceFilter, billingFilter]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // ─── Dialog handlers ──────────────────────────────────────────────────────────
  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (plan: PricingPlan) => {
    setEditingId(plan._id);
    setForm({
      title: plan.title || "",
      slug: plan.slug || "",
      description: plan.description || "",
      originalPrice: plan.originalPrice ?? 0,
      currency: plan.currency || "USD",
      featuresText: (plan.features || []).join(", "),
      highlighted: !!plan.highlighted,
      sortOrder: plan.sortOrder ?? 0,
      isActive: plan.isActive !== false,
      billingCycle: plan.billingCycle || "monthly",
      discountPercent: plan.discountPercent || 0,
      serviceType: (plan as any).serviceType || "web",
    });
    setDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const save = async () => {
    const body = formToBody(form);
    if (!body.title || !body.slug || Number.isNaN(body.originalPrice)) return;
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, body });
    } else {
      await createMutation.mutateAsync(body);
    }
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteMutation.mutateAsync(deletingId);
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  if (isLoading) return <div className="p-4 sm:p-6 lg:p-8"><AdminLoader label="Loading pricing…" /></div>;

  if (isError) return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{(error as Error)?.message || "Failed to load pricing plans"}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Pricing"
        description="Manage plans shown on the public Pricing page. Requires CEO or CTO role."
      >
        <Button type="button" className="gap-2" onClick={openNew}>
          <Plus className="h-4 w-4" />
          New plan
        </Button>
      </AdminPageHeader>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      {plans.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          {/* Service filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {SERVICE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setServiceFilter(f.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  serviceFilter === f.value
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-border hidden sm:block" />

          {/* Billing filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {BILLING_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setBillingFilter(f.value)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  billingFilter === f.value
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Count */}
          <span className="ml-auto text-xs text-muted-foreground">
            {filteredPlans.length} / {plans.length} plans
          </span>
        </div>
      )}

      {/* ── Plan Form Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit plan" : "New plan"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pt">Title *</Label>
                <Input
                  id="pt"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((f) => ({
                      ...f,
                      title,
                      slug: f.slug === slugify(f.title) || f.slug === "" ? slugify(title) : f.slug,
                    }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ps">Slug *</Label>
                <Input
                  id="ps"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                  placeholder="starter"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pd">Description</Label>
              <Textarea id="pd" rows={3} value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="op">Price</Label>
                <Input id="op" type="number" min={0} placeholder="e.g. 1999"
                  value={form.originalPrice}
                  onChange={(e) => setForm((f) => ({ ...f, originalPrice: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dp">Discount %</Label>
                <Input id="dp" type="number" min={0} max={100} placeholder="e.g. 20"
                  value={form.discountPercent}
                  onChange={(e) => setForm((f) => ({ ...f, discountPercent: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label>Cycle</Label>
                <Select value={form.billingCycle}
                  onValueChange={(v: "monthly" | "yearly" | "one-time") =>
                    setForm((f) => ({ ...f, billingCycle: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pc">Currency</Label>
                <Input id="pc" value={form.currency}
                  onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pso">Sort order</Label>
                <Input id="pso" type="number" value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} />
              </div>
            </div>

              <div className="space-y-2">
                <Label>Service Type</Label>
                <Select value={form.serviceType}
                  onValueChange={(v: "web" | "mobile" | "web+mobile" | "shopify") =>
                    setForm((f) => ({ ...f, serviceType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="web+mobile">Web + Mobile</SelectItem>
                    <SelectItem value="shopify">Shopify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            <div className="space-y-2">
              <Label htmlFor="pf">Features (comma separated)</Label>
              <Textarea id="pf" rows={3} value={form.featuresText}
                onChange={(e) => setForm((f) => ({ ...f, featuresText: e.target.value }))}
                placeholder="Feature one, Feature two, Feature three" />
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={form.highlighted}
                  onChange={(e) => setForm((f) => ({ ...f, highlighted: e.target.checked }))}
                  className="rounded border-border" />
                Highlighted
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="rounded border-border" />
                Active (visible on site)
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="button" onClick={save} disabled={isSaving}>
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ────────────────────────────────────────────────────── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The plan will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Plans Grid ───────────────────────────────────────────────────────── */}
      {plans.length === 0 ? (
        <AdminEmptyState title="No plans yet" description="Create your first pricing plan." />
      ) : filteredPlans.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No plans match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPlans.map((plan) => (
            <Card key={plan._id} className={cn(
              "border-border shadow-sm transition-shadow hover:shadow-md",
              plan.highlighted && "ring-1 ring-primary/40"
            )}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {plan.title}
                    {plan.highlighted && <Star className="h-4 w-4 fill-primary text-primary" />}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs">{plan.slug}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(plan)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                    onClick={() => confirmDelete(plan._id)} disabled={deleteMutation.isPending}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.discountPercent ? (
                  <p className="text-2xl font-semibold text-foreground">
                    {plan.currency} {plan.realPrice}
                    <span className="text-sm text-muted-foreground line-through ml-1">{plan.originalPrice}</span>
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {plan.billingCycle === "monthly" && "/mo"}
                      {plan.billingCycle === "yearly" && "/yr"}
                      {plan.billingCycle === "one-time" && "one-time"}
                    </span>
                  </p>
                ) : (
                  <p className="text-2xl font-semibold text-foreground">
                    {plan.currency} {plan.originalPrice}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {plan.billingCycle === "monthly" && "/mo"}
                      {plan.billingCycle === "yearly" && "/yr"}
                      {plan.billingCycle === "one-time" && "one-time"}
                    </span>
                  </p>
                )}
                <p className="line-clamp-3 text-sm text-muted-foreground">{plan.description}</p>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {(plan.features || []).slice(0, 4).map((f) => <li key={f}>{f}</li>)}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={plan.isActive ? "default" : "secondary"}>
                    {plan.isActive ? "Active" : "Hidden"}
                  </Badge>
                  <Badge variant="outline">{(plan as any).serviceType || "web"}</Badge>
                  <Badge variant="outline">{plan.billingCycle}</Badge>
                  <Badge variant="outline">Order {plan.sortOrder}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}