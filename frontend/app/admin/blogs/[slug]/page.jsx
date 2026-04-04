"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { get, put } from "@/data/api";
import { getAdminSelectStyles } from "@/lib/admin-react-select";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { Loader2, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";

const selectStyles = getAdminSelectStyles();
function FormField({ label, children, error }) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            {children}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
function TagsInput({ value, onChange, placeholder }) {
    const [inputValue, setInputValue] = useState("");

    const addTag = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
            setInputValue("");
        }
    };

    const removeTag = (tag) => {
        onChange(value.filter((t) => t !== tag));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <div>
            <div className="flex flex-wrap gap-1 mb-1">
                {value.map((tag) => (
                    <div key={tag} className="bg-gray-200 text-gray-800 px-2 py-1 rounded flex items-center gap-1">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </div>
                ))}
            </div>
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                onBlur={addTag}
            />
        </div>
    );
}
export default function AdminEditBlog() {
    const params = useParams();
    const router = useRouter();
    const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
    const [blog, setBlog] = useState(null);
    const [loadError, setLoadError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        category: "",
        status: "draft",
        tags: [],
        body: "",
        likes: [],
        views: 0,
        featured_image: null,
        featured_image_url: "",
    });
    const [errors, setErrors] = useState({});


    useEffect(() => {
        if (!slug) return;
        let cancelled = false;

        (async () => {
            try {
                const res = await get(`/api/blogs/${slug}`);
                if (cancelled) return;

                if (!res.ok || !res.data?.blog) {
                    setLoadError("Blog not found");
                    return;
                }

                const blog = res.data.blog;
                setBlog(blog);
                setForm({
                    title: blog.title || "",
                    subtitle: blog.subtitle || "",
                    category: blog.category || "",
                    status: blog.status || "draft",
                    tags: blog.tags || [],
                    body: blog.body || "",
                    likes: blog.likes || [],
                    views: blog.views || 0,
                    featured_image_url: blog.featured_image || "",
                });
            } catch (err) {
                console.log(err);
                if (!cancelled) setLoadError("Failed to load blog");
            }
        })();

        return () => { cancelled = true; };
    }, [slug]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };


    const validate = () => {
        const errs = {};
        if (!form.title || form.title.length < 3 || form.title.length > 100)
            errs.title = "Title must be 3–100 characters";
        if (form.subtitle && (form.subtitle.length < 3 || form.subtitle.length > 100))
            errs.subtitle = "Subtitle must be 3–100 characters";
        if (!form.category || form.category.length < 2 || form.category.length > 50)
            errs.category = "Category must be 2–50 characters";
        if (!form.body || form.body.length < 10)
            errs.body = "Body must be at least 10 characters";
        if (form.tags && form.tags.some((t) => t.length < 1))
            errs.tags = "Tags cannot be empty";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };
    const mutation = useMutation({
        mutationFn: async (formData) => {
            const res = await put(`/api/blogs/${slug}`, formData);
            if (!res.ok) throw new Error(res.message || "Could not update blog");
            return res;
        },
        onSuccess: () => {
            toast.success("Blog Updated");
            router.push("/admin/blogs");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleSubmit = (e, status = "published") => {
        e.preventDefault();

        setForm((prev) => ({ ...prev, status }));

        if (!validate()) {
            toast.error("Please fix the highlighted fields");
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("subtitle", form.subtitle);
        formData.append("category", form.category);
        formData.append("status", status);
        formData.append("body", form.body);
        form.tags.forEach((tag) => formData.append("tags[]", tag));
        if (form.featured_image) {
            formData.append("featured_image", form.featured_image);
        }
        mutation.mutate(formData);
    };
    if (!blog && !loadError) return <AdminLoader label="Loading blog…" />;
    if (loadError) return <div>{loadError}</div>;
    return (
        <div className="space-y-8 p-4 sm:p-6 lg:p-8">
            <AdminPageHeader title="Edit Blog" description="Update blog details" />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* BASICS */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basics</CardTitle>
                        <CardDescription>Title, subtitle, and categorization</CardDescription>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <FormField label="Title" >
                            <Input id="title" name="title" value={form.title} onChange={handleChange} />
                        </FormField>
                        <FormField label="Subtitle" >
                            <Input id="subtitle" name="subtitle" value={form.subtitle} onChange={handleChange} />
                        </FormField>
                        <FormField label="Category" >
                            <Input id="category" name="category" value={form.category} onChange={handleChange} />
                        </FormField>
                        <FormField label="Tags">
                            <TagsInput
                                value={form.tags}
                                onChange={(arr) => setForm((prev) => ({ ...prev, tags: arr }))}
                                placeholder="Add tags like JavaScript, Cybersecurity"
                            />
                        </FormField>

                    </CardContent>
                </Card>


                {/* CONTENT */}
                <Card>
                    <CardHeader>
                        <CardTitle>Content</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 gap-6">
                        <Textarea
                            name="body"
                            value={form.body}
                            onChange={handleChange}
                            rows={10}
                            placeholder="Write your blog content..."
                        />
                        <FormField label="Featured Image">
                            {/* Preview الصورة الحالية */}
                            {form.featured_image_url && !form.featured_image && (
                                <div className="mb-2">
                                    <p className="text-xs text-muted-foreground mb-1">Current image:</p>
                                    <img
                                        src={form.featured_image_url}
                                        alt="current"
                                        className="h-20 w-32 rounded-lg object-cover border border-border"
                                    />
                                </div>
                            )}

                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, featured_image: e.target.files?.[0] ?? null }))
                                }
                            />

                            {/* Preview الصورة الجديدة */}
                            {form.featured_image && (
                                <div className="mt-2 flex items-center gap-2">
                                    <img
                                        src={URL.createObjectURL(form.featured_image)}
                                        alt="preview"
                                        className="h-20 w-32 rounded-lg object-cover border border-border"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive"
                                        onClick={() => setForm((prev) => ({ ...prev, featured_image: null }))}
                                    >
                                        <X className="h-4 w-4" />
                                        Remove
                                    </Button>
                                </div>
                            )}
                        </FormField>
                    </CardContent>
                </Card>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="destructive" onClick={() => router.back()}>
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        disabled={mutation.isLoading}
                        onClick={(e) => handleSubmit(e, "draft")}
                        className="min-w-[140px] gap-2 bg-muted"
                    >
                        {mutation.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Draft blog
                    </Button>

                    <Button
                        type="submit"
                        disabled={mutation.isLoading}
                        className="min-w-[140px] gap-2"
                    >
                        {mutation.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {mutation.isLoading ? "Saving…" : "Publish blog"}
                    </Button>
                </div>
            </form>
        </div>
    );
}