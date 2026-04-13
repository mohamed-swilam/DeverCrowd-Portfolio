import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing. Choose the service and plan that works for you with no hidden fees.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen pt-8">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}