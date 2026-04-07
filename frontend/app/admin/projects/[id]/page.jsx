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
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
];

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
export default function AdminEditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [project, setProject] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: "",
    description: "",
    pic: null,
    picPreview: "",
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

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await get(`/api/projects/${id}`);
        if (cancelled) return;

        if (!res.ok || !res.data?.project) {
          setLoadError("Project not found");
          return;
        }

        const proj = res.data.project;
        setProject(proj);
        setForm({
          title: proj.title || "",
          description: proj.description || "",
          pic: null,
          picPreview: proj.pic,
          timeToFinish: proj.timeToFinish || "",
          client: proj.client || "",
          status: proj.status || "pending",
          cost: proj.cost || 0,
          timeSpend: proj.timeSpend || "",
          category: proj.category || "",
          scope: proj.scope || [],
          stack: proj.stack || [],
          industry: proj.industry || [],
          live: proj.live || "",
          github: proj.github || "",
        });
      } catch (err) {
        console.log(err);
        if (!cancelled) setLoadError("Failed to load project");
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

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

  const handleArrayChange = (field, value) => {
    const arr = value.split(",").map((i) => i.trim()).filter(Boolean);
    setForm((prev) => ({ ...prev, [field]: arr }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title || form.title.length < 3) errs.title = "Invalid title";
    if (!form.description || form.description.length < 10) errs.description = "Invalid description";
    if (!form.timeToFinish) errs.timeToFinish = "Required";
    if (!form.client) errs.client = "Required";
    if (!form.category) errs.category = "Required";
    if (!form.cost || isNaN(Number(form.cost))) errs.cost = "Invalid cost";
    if (!form.timeSpend) errs.timeSpend = "Required";
    if (!form.scope.length) errs.scope = "Required";
    if (!form.stack.length) errs.stack = "Required";
    if (!form.industry.length) errs.industry = "Required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs); // <- مهم هنا
      toast.error("Fix errors first");
      return;
    }
    setErrors({}); // reset errors if no errors

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (["scope", "stack", "industry"].includes(key)) {
          value.forEach((v) => formData.append(`${key}[]`, v));
        } else if (key === "pic") {
          if (value) formData.append("pic", value);
        } else if (key !== "picPreview") {
          formData.append(key, value);
        }
      });

      const res = await put(`/api/projects/${id}`, formData);
      if (res.ok) {
        toast.success("Updated successfully");
        router.push("/admin/projects");
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!project && !loadError) return <AdminLoader label="Loading project…" />;
  if (loadError) return <div>{loadError}</div>;

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader title="Edit project" description="Update project details" />
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASICS */}
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

        {/* TAGS */}
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

        {/* CONTENT */}
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

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin" /> : "Save changes"}
          </Button>
        </div>
        
      </form>
    </div>
  );
}