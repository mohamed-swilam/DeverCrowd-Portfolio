import { Metadata } from "next";
import { constructMetadata } from "@/lib/constructMetadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    // We fetch the blog to get its title, subtitle, and author details
    const res = await fetch(`${backendUrl}/api/blogs/${slug}`, {
      next: { revalidate: 300 }
    });

    if (!res.ok) {
      return constructMetadata({ title: "Blog Article" });
    }

    const data = await res.json();
    const blog = data?.data?.blog;

    if (!blog) {
      return constructMetadata({ title: "Blog Article Not Found" });
    }

    // Determine the OG image
    // If the blog has a high-quality featured image, we can use it.
    // Alternatively or as a fallback, we use the dynamically generated image.
    // For this example, we'll demonstrate the dynamic one with title and author.
    const dynamicOgUrl = `/api/og?title=${encodeURIComponent(blog.title)}&subtitle=${encodeURIComponent(blog.writer_name || '')}&type=Article`;
    const image = blog.featured_image || dynamicOgUrl;

    return constructMetadata({
      title: blog.title,
      description: blog.subtitle || blog.body?.substring(0, 160).replace(/<[^>]*>?/gm, ''),
      image,
    });
  } catch (error) {
    console.error("Error generating metadata for blog", error);
    return constructMetadata({ title: "Blog Article" });
  }
}

export default function BlogSlugLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
