"use client";
export const dynamic = 'force-dynamic';
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

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
];

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

// Tags input component
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

export default function AdminAddProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    pic: null,
    picPreview: null,
    timeToFinish: "",
    client: "",
    status: "pending",
    cost: "",
    timeSpend: "",
    category: "",
    scope: [],
    stack: [],
    industry: [],
    live: "",
    github: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pic") {
      const file = files?.[0] || null;
      setForm((prev) => ({
        ...prev,
        pic: file,
        picPreview: file ? URL.createObjectURL(file) : null,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.title || form.title.length < 3 || form.title.length > 100)
      errs.title = "Title must be 3–100 characters";
    if (!form.description || form.description.length < 10)
      errs.description = "Description must be at least 10 characters";
    if (!form.timeToFinish || form.timeToFinish.length < 2 || form.timeToFinish.length > 50)
      errs.timeToFinish = "Time to finish must be 2–50 characters";
    if (!form.client || form.client.length < 2 || form.client.length > 50 || !/^[a-zA-Z0-9\s]+$/.test(form.client))
      errs.client = "Client must be 2–50 alphanumeric characters";
    if (!["pending", "in progress", "review", "completed"].includes(form.status)) errs.status = "Invalid status";
    if (!form.pic) errs.pic = "Image is required";
    if (!form.category || form.category.length < 2 || form.category.length > 50 || !/^[a-zA-Z0-9\s]+$/.test(form.category))
      errs.category = "Invalid category";
    if (!form.cost || Number.isNaN(Number(form.cost))) errs.cost = "Cost must be a number";
    if (!form.timeSpend) errs.timeSpend = "Time spent is required";
    if (form.scope.length === 0) errs.scope = "Add at least one scope item";
    if (form.stack.length === 0) errs.stack = "Add at least one stack item";
    if (form.industry.length === 0) errs.industry = "Add at least one industry";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const res = await post("/api/projects", formData);
      if (!res.ok) throw new Error(res.message || "Could not create project");
      return res;
    },
    onSuccess: () => {
      toast.success("Project created");
      router.push("/admin/projects");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("pic", form.pic);
    formData.append("timeToFinish", form.timeToFinish);
    formData.append("client", form.client);
    formData.append("status", form.status);
    formData.append("cost", form.cost);
    formData.append("timeSpend", form.timeSpend);
    formData.append("category", form.category);
    formData.append("live", form.live);
    formData.append("github", form.github);
    form.scope.forEach((item) => formData.append("scope[]", item));
    form.stack.forEach((item) => formData.append("stack[]", item));
    form.industry.forEach((item) => formData.append("industry[]", item));

    mutation.mutate(formData);
  };

  const fieldClass = "space-y-2";

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="New project"
        description="Upload a cover image and fill project details. Submits as multipart/form-data to POST /api/projects."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basics */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Basics</CardTitle>
            <CardDescription>Title, client, and categorization</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <FormField label="Title" error={errors.title}>
              <Input id="title" name="title" value={form.title} onChange={handleChange} />
            </FormField>
            <FormField label="Client" error={errors.client}>
              <Input id="client" name="client" value={form.client} onChange={handleChange} />
            </FormField>
            <FormField label="Category" error={errors.category}>
              <Input id="category" name="category" value={form.category} onChange={handleChange} />
            </FormField>
            <FormField label="Time to finish" error={errors.timeToFinish}>
              <Input id="timeToFinish" name="timeToFinish" value={form.timeToFinish} onChange={handleChange} />
            </FormField>
            <FormField label="Cost" error={errors.cost}>
              <Input id="cost" name="cost" type="number" value={form.cost} onChange={handleChange} min={0} step="0.01" />
            </FormField>
            <FormField label="Time spent" error={errors.timeSpend}>
              <Input id="timeSpend" name="timeSpend" value={form.timeSpend} onChange={handleChange} />
            </FormField>
            <FormField label="Status" error={errors.status}>
              <Select
                instanceId="project-status"
                styles={selectStyles}
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed"
                options={statusOptions}
                value={statusOptions.find((o) => o.value === form.status)}
                onChange={(opt) => setForm((prev) => ({ ...prev, status: opt.value }))}
              />
            </FormField>
          </CardContent>
        </Card>

        {/* Tags & links */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Tags & links</CardTitle>
            <CardDescription>Tags and URLs</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <FormField label="Scope" error={errors.scope}>
              <TagsInput value={form.scope} onChange={(arr) => setForm((prev) => ({ ...prev, scope: arr }))} placeholder="Design, Development" />
            </FormField>
            <FormField label="Stack" error={errors.stack}>
              <TagsInput value={form.stack} onChange={(arr) => setForm((prev) => ({ ...prev, stack: arr }))} placeholder="Next.js, Node" />
            </FormField>
            <FormField label="Industry" error={errors.industry}>
              <TagsInput value={form.industry} onChange={(arr) => setForm((prev) => ({ ...prev, industry: arr }))} placeholder="SaaS, Retail" />
            </FormField>
            <FormField label="Live URL">
              <Input id="live" name="live" type="url" value={form.live} onChange={handleChange} placeholder="https://" />
            </FormField>
            <FormField label="GitHub URL">
              <Input id="github" name="github" type="url" value={form.github} onChange={handleChange} placeholder="https://" />
            </FormField>
          </CardContent>
        </Card>

        {/* Content & media */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Content & media</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField label="Description" error={errors.description}>
              <Textarea id="description" name="description" rows={8} value={form.description} onChange={handleChange} className="min-h-[200px] resize-y" />
            </FormField>
            <FormField label="Cover image" error={errors.pic}>
              <Input id="pic" name="pic" type="file" accept="image/*" onChange={handleChange} />
              {form.picPreview && <img src={form.picPreview} alt="Preview" className="mt-2 max-h-40 object-cover rounded" />}
            </FormField>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isLoading} className="min-w-[140px] gap-2">
            {mutation.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {mutation.isLoading ? "Saving…" : "Create project"}
          </Button>
        </div>
      </form>
    </div>
  );
}