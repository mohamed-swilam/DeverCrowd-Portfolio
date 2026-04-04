'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function PricingLayout({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex flex-col min-h-screen pt-24">
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </QueryClientProvider>
    );
}
 