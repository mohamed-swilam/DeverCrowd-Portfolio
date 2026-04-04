"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { post } from "@/data/api";
import { getAdminSelectStyles } from "@/lib/admin-react-select";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Loader2, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
const selectStyles = getAdminSelectStyles();

// Component for form fields with label, input, and error
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
export default function AdminAddBlogPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        category: "",
        status: "draft",
        slug: "",
        tags: [],
        body: "",
        likes: [],
        views: 0,
        featured_image: null,
    });
    const [errors, setErrors] = useState({});

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
            const res = await post("/api/blogs", formData);
            if (!res.ok) throw new Error(res.message || "Could not create blog");
            return res;
        },
        onSuccess: () => {
            toast.success("Blog created");
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
    return (
        <div className="space-y-8 p-4 sm:p-6 lg:p-8">
            <AdminPageHeader
                title="New Blog"
                description="Fill blog details. Submits as multipart/form-data to POST /api/blogs."
            />
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basics */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Basics</CardTitle>
                        <CardDescription>Title, subtitle, and categorization</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <FormField label="Title" error={errors.title}>
                            <Input id="title" name="title" value={form.title} onChange={handleChange} />
                        </FormField>
                        <FormField label="Subtitle" error={errors.subtitle}>
                            <Input id="subtitle" name="subtitle" value={form.subtitle} onChange={handleChange} />
                        </FormField>
                        <FormField label="Category" error={errors.category}>
                            <Input id="category" name="category" value={form.category} onChange={handleChange} />
                        </FormField>
                        <FormField label="Tags" error={errors.tags}>
                            <TagsInput
                                value={form.tags}
                                onChange={(arr) => setForm((prev) => ({ ...prev, tags: arr }))}
                                placeholder="Add tags like JavaScript, Cybersecurity"
                            />
                        </FormField>
                    </CardContent>
                </Card>
                {/* Content */}
                <Card className="border-border shadow-sm">
                    <CardHeader>
                        <CardTitle>Content & Media</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-6 ">
                        <FormField label="Body" error={errors.body}>
                            <Textarea
                                id="body"
                                name="body"
                                rows={12}
                                value={form.body}
                                onChange={handleChange}
                                className="min-h-[200px] resize-y"
                            />
                        </FormField>
                        <FormField label="Featured Image" error={errors.featured_image}>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, featured_image: e.target.files?.[0] ?? null }))
                                }
                            />
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
                {/* Submit */}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
