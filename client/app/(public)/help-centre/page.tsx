// SERVER COMPONENT — owns the metadata export for SEO
import type { Metadata } from "next";
import HelpCenterClient from "./help-center-client";

/* ─────────────────────────────────────────────────────────
   PAGE METADATA  (/help)
───────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Help Centre — Gravitas Support & Documentation",

  description:
    "Find answers to your questions about Gravitas. Browse guides on JAMB & WAEC " +
    "CBT practice, Sabi-Explain AI, offline mode, school portal setup, billing, " +
    "account security, and more. Live chat available Monday–Friday 8am–8pm WAT.",

  keywords: [
    "Gravitas help",
    "Gravitas support",
    "JAMB CBT help",
    "Gravitas documentation",
    "Sabi-Explain FAQ",
    "offline mode Gravitas",
    "school portal setup",
    "Gravitas reset password",
    "Gravitas billing",
    "Gravitas contact",
  ],

  alternates: { canonical: "https://gravitas.ng/help" },

  openGraph: {
    type: "website",
    url: "https://gravitas.ng/help",
    title: "Help Centre — Gravitas Support & Documentation",
    description: "Guides, FAQs, and live support for JAMB, WAEC & Post-UTME exam prep on Gravitas.",
    images: [
      {
        url: "/og/help.png",
        width: 1200,
        height: 630,
        alt: "Gravitas Help Centre",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Gravitas Help Centre",
    description: "Guides, FAQs, and live support for Nigerian exam prep.",
  },
};

export default function HelpPage() {
  return <HelpCenterClient />;
}
