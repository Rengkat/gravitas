import type { Metadata, Viewport } from "next";
import { Sora, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gravitas.ng"),

  title: {
    default: "Gravitas — Pass JAMB, WAEC & Every Nigerian Exam",
    template: "%s | Gravitas",
  },
  description:
    "Gravitas is Nigeria's #1 AI-powered exam preparation platform. " +
    "Practice JAMB, WAEC, NECO, Post-UTME and professional exams with " +
    "pixel-perfect CBT simulation, instant AI explanations in Pidgin or " +
    "English, and real-time performance analytics — even on 2G networks.",

  keywords: [
    "JAMB 2025",
    "WAEC preparation",
    "CBT practice Nigeria",
    "Post-UTME prep",
    "NECO past questions",
    "ICAN exam",
    "Nursing Council exam",
    "Nigerian exam prep",
    "AI tutor Nigeria",
    "Sabi-Explain",
    "exam preparation app Nigeria",
    "UTME score",
  ],

  authors: [{ name: "Gravitas Technologies Ltd", url: "https://gravitas.ng" }],
  creator: "Gravitas Technologies Ltd",
  publisher: "Gravitas Technologies Ltd",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://gravitas.ng",
    siteName: "Gravitas",
    title: "Gravitas — Pass JAMB, WAEC & Every Nigerian Exam",
    description: "AI-powered CBT simulation for JAMB, WAEC, Post-UTME & professional exams.",
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: "Gravitas — Nigeria's #1 Exam Prep Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@gravitasng",
    creator: "@gravitasng",
    title: "Gravitas — Pass JAMB, WAEC, ICAN & Every Nigerian Exam",
    description: "AI-powered CBT simulation. Works offline. Explains in Pidgin.",
    images: ["/og/default.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.json",
  applicationName: "Gravitas",
  category: "education",

  verification: {
    google: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN",
  },

  alternates: {
    canonical: "https://gravitas.ng",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a4a2e" },
    { media: "(prefers-color-scheme: dark)", color: "#0d2b1a" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${dmSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
