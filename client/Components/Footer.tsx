import Link from "next/link";

const FOOTER_LINKS = {
  Platform: [
    "JAMB CBT Simulator",
    "WAEC / NECO Practice",
    "Post-UTME Suite",
    "ICAN & Nursing",
    "Content Library",
    "Find a Tutor",
  ],
  Schools: [
    "School Portal",
    "Admin Dashboard",
    "Pricing for Schools",
    "Book a Demo",
    "API & Integration",
  ],
  Company: ["About Gravitas", "Blog", "Careers", "Press Kit", "Contact Us", "Help Centre"],
};

const Footer = () => {
  return (
    <footer className="bg-dark pt-20 pb-10 px-[5%]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-16 mb-16">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5 no-underline mb-4">
            <div className="w-9 h-9 bg-green-700 rounded-[9px] flex items-center justify-center font-serif text-[20px] text-gold">
              G
            </div>
            <span className="font-serif text-[20px] text-white">Gravitas</span>
          </Link>
          <p className="text-[13.5px] text-white/35 leading-relaxed max-w-[280px] mb-6">
            Nigeria&apos;s AI-powered exam preparation platform. Built for every student, from SS1
            to professional certifications.
          </p>
          <div className="flex gap-2.5">
            {["𝕏", "in", "ig", "▶"].map((s) => (
              <a
                key={s}
                href="#"
                className="w-9 h-9 rounded-lg border border-white/10 bg-transparent text-white/40 flex items-center justify-center text-[15px] no-underline transition-all hover:bg-white/8 hover:text-white/80 hover:border-white/20">
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([col, links]) => (
          <div key={col}>
            <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-white/40 mb-5">
              {col}
            </div>
            <div className="flex flex-col gap-3">
              {links.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-[13.5px] text-white/45 no-underline transition-colors hover:text-white/85 flex items-center gap-1.5">
                  {l}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-7 border-t border-white/7 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="text-[12px] text-white/25">
          © 2025 Gravitas Technologies Ltd. Made with ❤️ in Nigeria.
        </div>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-[12px] text-white/25 no-underline transition-colors hover:text-white/60">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
export default Footer;
