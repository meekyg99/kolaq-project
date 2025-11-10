import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Providers } from "@/components/providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kolaq Alagbo International",
  description:
    "Premium herbal drink experience with international ordering and a modern shopping interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} bg-[var(--background)] text-[var(--foreground)]`}
    >
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <Providers>
          <div className="pointer-events-none fixed inset-0 -z-10 accent-gradient opacity-70" aria-hidden />
          <div className="pointer-events-none fixed inset-0 -z-10 noisy" aria-hidden />
          <SiteHeader />
          <main className="pb-20 pt-10 md:pb-24 md:pt-12">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
