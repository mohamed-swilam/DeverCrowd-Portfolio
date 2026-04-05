import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, del } from "@/data/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface PricingPlan {
    _id: string;
    title: string;
    slug: string;
    description: string;
    originalPrice: number;
    discountPercent: number
    realPrice: number | null;
    currency: string;
    features: string[];
    highlighted: boolean;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    billingCycle?: "monthly" | "yearly" | "one-time";
    serviceType: "web" | "mobile" | "web+mobile" | "shopify";
}

export interface PricingFormData {
    title: string;
    slug: string;
    description: string;
    originalPrice: number;
    discountPercent: number
    currency: string;
    featuresText: string;
    highlighted: boolean;
    sortOrder: number;
    isActive: boolean;
    billingCycle?: "monthly" | "yearly" | "one-time";
    serviceType: "web" | "mobile" | "web+mobile" | "shopify";
}

export interface CreatePlanBody {
    title: string;
    slug: string;
    description: string;
    originalPrice: number;
    discountPercent: number
    realPrice?: number | null;
    currency: string;
    features: string[];
    highlighted: boolean;
    sortOrder: number;
    isActive: boolean;
    billingCycle?: "monthly" | "yearly" | "one-time";
    serviceType: "web" | "mobile" | "web+mobile" | "shopify";
}

export type UpdatePlanBody = Partial<CreatePlanBody>;
// ─── Query Keys ────────────────────────────────────────────────────────────────
export const pricingKeys = {
    all: ["pricing"] as const,
    adminAll: ["pricing", "admin", "all"] as const,
    public: ["pricing", "public"] as const,
};

// ─── Response shapes ───────────────────────────────────────────────────────────
interface PlansResponse {
    plans: PricingPlan[];
}

// ─── Admin: fetch all plans (including inactive) ───────────────────────────────
export function useAdminPricingPlans() {
    const router = useRouter();

    return useQuery({
        queryKey: pricingKeys.adminAll,
        queryFn: async () => {
            const res = await get<PlansResponse>("/api/pricing/manage/all");

            if (res.status === 401) {
                toast.error("Session expired — please login again");
                router.push("/admin/login");
                throw new Error("Unauthorized");
            }

            if (res.status === 403) {
                toast.error("Access denied — CEO or CTO role required");
                throw new Error("Forbidden");
            }

            if (!res.ok) {
                throw new Error(res.message || "Could not load pricing plans");
            }

            return res.data?.plans ?? [];
        },
        retry: (failureCount, error: Error) => {
            // Don't retry auth errors
            if (error.message === "Unauthorized" || error.message === "Forbidden") return false;
            return failureCount < 2;
        },
    });
}

// ─── Public: fetch only active plans ──────────────────────────────────────────
export function usePublicPricingPlans() {
    return useQuery({
        queryKey: pricingKeys.public,
        queryFn: async () => {
            const res = await get<PlansResponse>("/api/pricing");

            if (!res.ok) {
                throw new Error(res.message || "Could not load pricing plans");
            }

            return res.data?.plans ?? [];
        },
        staleTime: 1000 * 60 * 5, // 5 min cache for public page
    });
}

// ─── Create plan ───────────────────────────────────────────────────────────────
export function useCreatePricingPlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: CreatePlanBody) => {
            const res = await post<{ plan: PricingPlan }>("/api/pricing/manage", body);

            if (res.status === 409) {
                throw new Error("A plan with this slug already exists");
            }

            if (!res.ok) {
                throw new Error(res.message || "Failed to create plan");
            }

            return res.data;
        },
        onSuccess: () => {
            toast.success("Plan created successfully");
            queryClient.invalidateQueries({ queryKey: pricingKeys.adminAll });
            queryClient.invalidateQueries({ queryKey: pricingKeys.public });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Create failed");
        },
    });
}

// ─── Update plan ───────────────────────────────────────────────────────────────
export function useUpdatePricingPlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, body }: { id: string; body: UpdatePlanBody }) => {
            const res = await put<{ plan: PricingPlan }>(`/api/pricing/manage/${id}`, body);

            if (res.status === 404) {
                throw new Error("Plan not found");
            }

            if (!res.ok) {
                throw new Error(res.message || "Failed to update plan");
            }

            return res.data;
        },
        onSuccess: () => {
            toast.success("Plan updated successfully");
            queryClient.invalidateQueries({ queryKey: pricingKeys.adminAll });
            queryClient.invalidateQueries({ queryKey: pricingKeys.public });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Update failed");
        },
    });
}

// ─── Delete plan ───────────────────────────────────────────────────────────────
export function useDeletePricingPlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await del(`/api/pricing/manage/${id}`);

            if (res.status === 404) {
                throw new Error("Plan not found");
            }

            if (!res.ok) {
                throw new Error(res.message || "Failed to delete plan");
            }

            return id;
        },
        onSuccess: () => {
            toast.success("Plan deleted");
            queryClient.invalidateQueries({ queryKey: pricingKeys.adminAll });
            queryClient.invalidateQueries({ queryKey: pricingKeys.public });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Delete failed");
        },
    });
}