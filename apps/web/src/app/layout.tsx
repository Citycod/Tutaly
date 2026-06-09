import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/providers/CartProvider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://tutaly.ng'),
  title: {
    template: "%s | Tutaly",
    default: "Tutaly | Connecting Seekers & Employers",
  },
  description: "Discover jobs, company reviews, and professional resources on Tutaly.",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "/",
    title: "Tutaly | Connecting Seekers & Employers",
    description: "Discover jobs, company reviews, and professional resources on Tutaly.",
    siteName: "Tutaly",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tutaly | Connecting Seekers & Employers",
    description: "Discover jobs, company reviews, and professional resources on Tutaly.",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable} antialiased h-full`}>
      <body className="font-sans flex flex-col min-h-screen bg-brand-dark text-gray-100">
        <CartProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
