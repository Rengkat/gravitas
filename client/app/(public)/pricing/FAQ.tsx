"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQItem = { q: string; a: string };

const FAQS: FAQItem[] = [
  {
    q: "Can I really start for free? What's the catch?",
    a: "Yes — completely free, forever. No credit card, no trial period. The Free plan gives you 3 subjects, 100 past questions a month, and 2 mock exams. We want you to see results before asking for anything. If you want unlimited access and AI features, that's when Pro makes sense.",
  },
  {
    q: "How does the annual plan work?",
    a: "The annual plan bills you ₦20,000 upfront for 12 months of Student Pro access — that's ₦1,667/month, saving you 33% versus monthly billing. You get the same features with no interruptions, and you can cancel before your renewal date for a prorated refund.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all Nigerian bank cards (Visa, Mastercard, Verve), bank transfers, USSD, and Opay/Palmpay. You can also pay via your school if your institution has a School plan — ask your admin.",
  },
  {
    q: "Does it work without internet?",
    a: "Yes. Student Pro and School plans include offline mode. Download your question banks while on Wi-Fi, then practice anywhere — on the bus, in your hostel, even in areas with no data. Your answers sync when you're back online.",
  },
  {
    q: "How does the School plan work for institutions?",
    a: "The School plan starts at ₦15,000/month for up to 50 students and scales from there. You get a branded subdomain (yourschool.gravitas.ng), admin dashboard, custom CBT tests, auto-graded report cards, and parent reports. Setup takes less than 24 hours.",
  },
  {
    q: "Can I switch plans or cancel anytime?",
    a: "Yes. Upgrade, downgrade, or cancel at any time directly from your account settings. If you cancel a paid plan, you keep access until the end of your current billing period, then automatically revert to the Free plan — you never lose your study history.",
  },
  {
    q: "Is my payment data secure?",
    a: "Absolutely. Payments are processed by Paystack — Nigeria's most trusted payment processor. Gravitas never stores your card details. All data is encrypted in transit and at rest.",
  },
  {
    q: "Do you offer discounts for NYSC members or low-income students?",
    a: "Yes — we have a scholarship programme for students who can't afford Pro. Apply through our website with a brief explanation of your situation. We review applications weekly and offer full free Pro access for qualified students. No shame, just support.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="px-[5%] pb-[100px]">
      <div className="max-w-[760px] mx-auto">

        <h2
          className="font-serif text-green-900 text-center tracking-[-0.8px] mb-12"
          style={{ fontSize: "clamp(28px, 3.5vw, 42px)" }}
        >
          Frequently asked questions
        </h2>

        <div className="flex flex-col">
          {FAQS.map(({ q, a }, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={q} className="border-b border-cream-border">
                <button
                  onClick={() => toggle(i)}
                  className={`w-full flex items-center justify-between gap-4 py-5 text-left bg-transparent border-none cursor-pointer font-sans text-[15px] font-semibold transition-colors duration-200 ${isOpen ? "text-green-800" : "text-text-main"}`}
                >
                  {q}
                  <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-[250ms] ${isOpen ? "bg-green-800 border-green-800 text-white rotate-180" : "border-cream-border text-text-muted"}`}>
                    <ChevronDown size={12} strokeWidth={2.5} />
                  </div>
                </button>

                <div
                  className="text-sm text-text-muted leading-[1.75] overflow-hidden transition-all duration-[350ms] ease-in-out"
                  style={{ maxHeight: isOpen ? "300px" : "0px", paddingBottom: isOpen ? "20px" : "0px" }}
                >
                  {a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
