import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { MarketingShell } from "@/components/shared/MarketingShell";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700"],
  variable: "--font-poppins",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrainsMono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "DeverCrowd",
    template: "%s · DeverCrowd",
  },
  description:
    "DeverCrowd builds high-performing websites and mobile apps that solve real problems and grow your business.",

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DeverCrowd",
    title: "DeverCrowd — Digital products & web development",
    description:
      "Websites, mobile apps, and engineering support — built for performance and growth.",

    images: [
      {
        url: "https://www.devercrowd.com/og-image.png", // 👈 أهم سطر
        width: 1200,
        height: 630,
        alt: "DeverCrowd",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "DeverCrowd",
    description: "Digital products studio — web, mobile, and growth.",
    images: ["/og-image.png"], // 👈 مهم برضه
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} min-h-screen font-sans text-foreground antialiased`}>
        <Providers>
          <MarketingShell>{children}</MarketingShell>
        </Providers>
      </body>
    </html>
  );
}