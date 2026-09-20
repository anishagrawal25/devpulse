import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "DevPulse - Career Growth & Consistency Platform for Developers",
  description: "DevPulse helps students and aspiring developers stay consistent with goal tracking, AI roadmaps, project milestones, DSA problem logging, open source, and hackathons.",
  keywords: ["DevPulse", "Developer Consistency", "Career Growth", "DSA Tracker", "AI Roadmaps", "Hackathon Tracker", "Student Developer"],
  authors: [{ name: "DevPulse Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
