import { Metadata } from "next";
import { constructMetadata } from "@/lib/constructMetadata";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    // NOTE: If your backend has a single project endpoint like GET /api/projects/:id, we use it.
    // If not, we might fall back to fetching all and finding it, or the API might respond nicely.
    const res = await fetch(`${backendUrl}/api/projects/${id}`, {
      next: { revalidate: 300 }
    });

    if (!res.ok) {
      return constructMetadata({ title: "Project Details" });
    }

    const data = await res.json();
    const project = data?.data?.project || data?.project;

    if (!project) {
      return constructMetadata({ title: "Project Not Found" });
    }

    const title = project.title || project.name;
    const subtitle = project.category || "Project Case Study";
    
    // Generate OG image using our dynamic endpoint if pic is unavailable
    const dynamicOgUrl = `/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}&type=Project`;
    const image = project.pic || dynamicOgUrl;

    return constructMetadata({
      title: `${title} | Our Work`,
      description: project.description || `View our project ${title}.`,
      image,
    });
  } catch (error) {
    console.error("Error generating metadata for project", error);
    return constructMetadata({ title: "Project Details" });
  }
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
