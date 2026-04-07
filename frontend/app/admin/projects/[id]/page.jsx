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
import { Loader2 } from "lucide-react";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
];

const selectStyles = getAdminSelectStyles();

export default function AdminEditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [project, setProject] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
          cost: String(proj.cost || ""),
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
      toast.error("Fix errors first");
      return;
    }

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
        <Card>
          <CardHeader>
            <CardTitle>Basics</CardTitle>
            <CardDescription>Title, client, and categorization</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
            <Input name="client" value={form.client} onChange={handleChange} placeholder="Client" />
            <Input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
            <Input name="timeToFinish" value={form.timeToFinish} onChange={handleChange} placeholder="Time to finish" />
            <Input name="cost" value={form.cost} onChange={handleChange} type="number" />
            <Input name="timeSpend" value={form.timeSpend} onChange={handleChange} placeholder="Time spent" />
            
            <Select
              instanceId="edit-project-status"
              styles={selectStyles}
              options={statusOptions}
              value={statusOptions.find((o) => o.value === form.status) ?? null}
              onChange={(opt) => setForm((prev) => ({ ...prev, status: opt?.value ?? "pending" }))}
            />
          </CardContent>
        </Card>

        {/* TAGS */}
        <Card>
          <CardHeader>
            <CardTitle>Tags & Links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {["scope", "stack", "industry"].map((name) => (
              <Input
                key={name}
                value={form[name].join(", ")}
                onChange={(e) => handleArrayChange(name, e.target.value)}
                placeholder={name}
              />
            ))}
            <Input name="live" value={form.live} onChange={handleChange} placeholder="Live URL" />
            <Input name="github" value={form.github} onChange={handleChange} placeholder="GitHub URL" />
          </CardContent>
        </Card>

        {/* CONTENT */}
        <Card>
          <CardHeader>
            <CardTitle>Content & Media</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Textarea name="description" value={form.description} onChange={handleChange} rows={8} />
            <div>
              {form.picPreview ? (
                <img src={form.picPreview} className="h-40 rounded mb-3" />
              ) : (
                project?.pic && <Image src={project.pic} alt="" width={200} height={150} />
              )}
              <Input type="file" name="pic" onChange={handleChange} />
            </div>
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