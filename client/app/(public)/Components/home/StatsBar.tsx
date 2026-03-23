const STATS = [
  {
    num: "50",
    suffix: "k+",
    label: "Past Questions",
    delay: "",
    border: "border-r border-white/10",
  },
  {
    num: "12",
    suffix: "k",
    label: "Active Students",
    delay: "reveal-delay-1",
    border: "border-r border-white/10",
  },
  {
    num: "94",
    suffix: "%",
    label: "Pass Rate",
    delay: "reveal-delay-2",
    border: "border-r border-white/10",
  },
  { num: "200", suffix: "+", label: "Partner Schools", delay: "reveal-delay-3", border: "" },
];

export default function StatsBar() {
  return (
    <div className="bg-green-800 py-7 px-[5%] grid grid-cols-2 md:grid-cols-4 gap-px relative overflow-hidden">
      {/* Gold shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(245,200,66,0.04), transparent)",
        }}
      />

      {STATS.map(({ num, suffix, label, delay, border }) => (
        <div key={label} className={`reveal ${delay} ${border} text-center py-2 px-6`}>
          <div className="font-serif text-[36px] text-white leading-none mb-1.5 flex items-baseline justify-center gap-0.5">
            {num}
            <span className="font-sans text-lg font-bold text-gold">{suffix}</span>
          </div>

          <div className="text-xs text-white/55 font-medium tracking-[0.04em] uppercase">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
