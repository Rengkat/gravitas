import type { Metadata } from "next";
import LoginPage from "./PageClient";

export const metadata: Metadata = {
  title: "Log In to Gravitas",

  description:
    "Log in to your Gravitas account and continue your JAMB, WAEC, or " +
    "Post-UTME preparation. Your study streak, saved sessions, and AI " +
    "tutor history are waiting for you.",

  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: "https://gravitas.ng/login",
  },

  openGraph: {
    type: "website",
    url: "https://gravitas.ng/login",
    title: "Log In to Gravitas",
    description: "Continue your JAMB & WAEC exam preparation on Gravitas.",
    images: [
      {
        url: "/og/auth.png",
        width: 1200,
        height: 630,
        alt: "Log in to Gravitas",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Log In to Gravitas",
    description: "Continue your JAMB & WAEC exam preparation.",
  },
};

const page = () => {
  return (
    <div>
      <LoginPage />
    </div>
  );
};

export default page;
