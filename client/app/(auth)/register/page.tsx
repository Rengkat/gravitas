import RegisterPage from "./RegisterClient";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Your Free Gravitas Account",

  description:
    "Join 12,000+ Nigerian students on Gravitas. Create your free account " +
    "in 30 seconds — no credit card needed. Get instant access to JAMB CBT " +
    "simulation, AI-powered Gravitas-Explain, past questions, and performance " +
    "analytics for WAEC, NECO, Post-UTME, ICAN and more.",

  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: "https://gravitas.ng/register",
  },

  openGraph: {
    type: "website",
    url: "https://gravitas.ng/register",
    title: "Create Your Free Gravitas Account — Join 12,000+ Students",
    description:
      "Free JAMB, WAEC & Post-UTME exam prep. No credit card. " +
      "AI explanations, CBT simulation, works on 2G.",
    images: [
      {
        url: "/og/auth.png",
        width: 1200,
        height: 630,
        alt: "Join Gravitas — Free Nigerian Exam Prep",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Create Your Free Gravitas Account",
    description: "Free JAMB, ICAN, NECO & WAEC prep. AI explanations. Works on 2G.",
  },
};
const page = () => {
  return (
    <div>
      <RegisterPage />
    </div>
  );
};

export default page;
