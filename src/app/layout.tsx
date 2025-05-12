import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Website Project Intake Form",
  description: "Submit your website project details and requirements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' assets.calendly.com *.vercel.app; style-src 'self' 'unsafe-inline' assets.calendly.com; connect-src 'self' vitals.vercel-insights.com localhost:* *.localhost:* calendly.com *.calendly.com; img-src 'self' data: assets.calendly.com; frame-src calendly.com *.calendly.com; font-src 'self' assets.calendly.com; form-action 'self';"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
