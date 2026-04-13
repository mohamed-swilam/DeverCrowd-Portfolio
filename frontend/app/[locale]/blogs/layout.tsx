import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, tutorials, and updates from the DeverCrowd team on web development, mobile apps, and digital growth.",
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen pt-24">
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}