import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Explore our portfolio of high-performing websites, mobile applications, and custom software solutions.",
};

export default function WorksLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen pt-24">
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}