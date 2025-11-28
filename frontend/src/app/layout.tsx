import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Providers } from "@/components/providers";
import { defaultMetadata, generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Toaster } from "sonner";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { BlackFridayBanner } from "@/components/ui/promo-banner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} bg-[var(--background)] text-[var(--foreground)]`}
    >
      <head>
        <SchemaMarkup schema={[organizationSchema, websiteSchema]} />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <Providers>
          <Toaster position="top-right" richColors closeButton />
          <div className="pointer-events-none fixed inset-0 -z-10 accent-gradient opacity-70" aria-hidden />
          <div className="pointer-events-none fixed inset-0 -z-10 noisy" aria-hidden />
          <BlackFridayBanner />
          <SiteHeader />
          <main className="pb-14 pt-6 md:pb-16 md:pt-8">{children}</main>
          <SiteFooter />
          <WhatsAppButton />
          <BackToTopButton />
        </Providers>
      </body>
    </html>
  );
}
