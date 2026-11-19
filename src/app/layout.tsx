import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";

import { PageRails } from "@/components/page-rails";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ThemeProvider } from "@/components/site/theme";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

// Only the wordmark uses it, for its curved, slanted f.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Copy-paste borders, frames and effects for React and Tailwind CSS. Free, open source, installed with the shadcn CLI.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    title: `${SITE_NAME}: ${SITE_TAGLINE}`,
    description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME}: ${SITE_TAGLINE}`,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f7" },
    { media: "(prefers-color-scheme: dark)", color: "#141414" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The theme script sets a class on <html> before React hydrates.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider>
          {/* Section rules run a whole window wider each way; clipped here
              rather than on <body>, whose overflow would pass to the
              viewport. */}
          <div className="overflow-x-clip">
            {/* One column, ruled down both sides, from the header to the
                footer. Every section sits flush between the rails. */}
            <PageRails className="site-lines mx-auto flex min-h-svh w-full max-w-[84rem] flex-col">
              <SiteHeader />
              <div className="flex flex-1 flex-col">{children}</div>
              <SiteFooter />
            </PageRails>
          </div>
        </ThemeProvider>
        {/* Vercel Web Analytics: cookie-free page views, only on Vercel
            deployments. Swap for Google Analytics once there is a domain. */}
        <Analytics />
      </body>
    </html>
  );
}
