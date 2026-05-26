import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Cart from "@/components/ui/Cart";
import Navbar from "@/components/ui/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Eden Nursery | Premium Botanical Boutique",
    template: "%s | Eden Nursery",
  },
  description: "Experience the cinematic world of premium indoor plants. Curated botanical wonders delivered to your sanctuary.",
  keywords: ["plants", "indoor plants", "botanical", "nursery", "home decor", "3d experience"],
  authors: [{ name: "Eden Nursery Team" }],
  openGraph: {
    title: "Eden Nursery | Premium Botanical Boutique",
    description: "Experience the cinematic world of premium indoor plants.",
    url: "https://eden-nursery.vercel.app",
    siteName: "Eden Nursery",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Eden Nursery",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eden Nursery | Premium Botanical Boutique",
    description: "Experience the cinematic world of premium indoor plants.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-emerald-950">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Cart />
      </body>
    </html>
  );
}
