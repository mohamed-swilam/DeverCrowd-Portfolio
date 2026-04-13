"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { get, del, put, post } from "@/data/api";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

function BlogsAdminContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPost, setEditingPost] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limit = 6;

  // ✅ Fetch with caching
  const { data, isLoading } = useQuery({
    queryKey: ["blogs", currentPage],
    queryFn: async () => {
      const res = await get(`/api/blogs?limit=${limit}&page=${currentPage}`);
      if (!res.ok) throw new Error(res.message);
      return res.data.blogs;
    },
  });

  const posts = data || [];

  // ✅ Delete
  const deleteMutation = useMutation({
    mutationFn: (slug) => del(`/api/blogs/${slug}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Post deleted");
    },
    onError: () => {
      toast.error("Could not delete post");
    },
  });

  // ✅ Create / Update
  const saveMutation = useMutation({
    mutationFn: async (postData) => {
      if (postData.slug) {
        return put(`/api/blogs/${postData.slug}`, postData);
      } else {
        return post("/api/blogs", postData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Saved successfully");
      setEditingPost(null);
    },
    onError: () => {
      toast.error("Could not save post");
    },
  });

  const handleSave = () => {
    if (!editingPost?.title?.trim()) {
      toast.error("Title is required");
      return;
    }

    saveMutation.mutate({
      title: editingPost.title,
      body: editingPost.body || "",
      ...(editingPost.slug && { slug: editingPost.slug }),
    });
  };

  // ✅ Search
  const filteredPosts = posts.filter((post) => {
    const title = (post.title || "").toLowerCase();
    const body = (post.body || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return title.includes(term) || body.includes(term);
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <AdminLoader label="Loading blog posts…" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Projects"
        description="Create, edit, and organize client work."
      >
        <Button asChild className="gap-2">
          <Link href="/admin/blogs/add">
            <Plus className="h-4 w-4" />
            New Blog
          </Link>
        </Button>
      </AdminPageHeader>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <AdminEmptyState
          title="No posts"
          description="Adjust search or create a new post."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card key={post.slug} className="overflow-hidden border-border shadow-sm hover:shadow-md transition">
              <CardHeader className="space-y-3">
                {/* Top Row */}
                <div className="flex justify-between items-center">

                  <div className="flex items-center justify-between w-full">
                    <Badge
                      className={
                        post.status === "published"
                          ? "bg-green-500/10 text-green-600 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                      }
                    >
                      {post.status}
                    </Badge>
                    <div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingPost(post)}
                      >
                        <Link href={`/admin/blogs/${post.slug}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(post.slug)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <CardTitle className="line-clamp-2 text-lg">
                  {post.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Body */}
                <CardDescription className="line-clamp-3">
                  {post.body}
                </CardDescription>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t">
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs">Author</p>
                    <p className="font-medium">{post.writer_name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 pt-6">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() =>
            router.push(`?page=${currentPage - 1}`, { scroll: false })
          }
        >
          Previous
        </Button>

        <span>Page {currentPage}</span>

        <Button
          variant="outline"
          onClick={() =>
            router.push(`?page=${currentPage + 1}`, { scroll: false })
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<AdminLoader />}>
      <BlogsAdminContent />
    </Suspense>
  );
}