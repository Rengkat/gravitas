import { Check, Minus } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

/* ─── Types ──────────────────────────────────────────────── */
type Cell = "free" | "pro" | "school" | "none" | string;

type Row = {
  label: string;
  note?: string;
  free: Cell;
  pro: Cell;
  school: Cell;
};

type Category = { heading: string; rows: Row[] };

/* ─── Data ───────────────────────────────────────────────── */
const CATEGORIES: Category[] = [
  {
    heading: "📚 Content & Practice",
    rows: [
      { label: "Subject access", free: "3 subjects", pro: "All subjects", school: "All subjects" },
      { label: "Past questions", free: "100 / month", pro: "Unlimited", school: "Unlimited" },
      { label: "Mock exams", free: "2 / month", pro: "Unlimited", school: "Unlimited" },
      { label: "Exam types (JAMB, WAEC, Post-UTME…)", free: "none", pro: "pro", school: "school" },
      {
        label: "Offline download mode",
        note: "Download & practice with no data",
        free: "none",
        pro: "pro",
        school: "school",
      },
    ],
  },
  {
    heading: "🤖 AI Features",
    rows: [
      {
        label: "AI Sabi-Explain",
        note: "Instant breakdown on every wrong answer",
        free: "none",
        pro: "pro",
        school: "school",
      },
      { label: "Weak topic AI drill generator", free: "none", pro: "pro", school: "school" },
      { label: "Voice & Pidgin input", free: "none", pro: "pro", school: "school" },
      { label: "AI essay marking (WAEC)", free: "none", pro: "pro", school: "school" },
    ],
  },
  {
    heading: "📊 Analytics",
    rows: [
      { label: "Basic performance stats", free: "free", pro: "pro", school: "school" },
      {
        label: "Deep analytics",
        note: "Time per question, score trajectory",
        free: "none",
        pro: "pro",
        school: "school",
      },
      { label: "Admin dashboard & class reports", free: "none", pro: "none", school: "school" },
      { label: "Parent WhatsApp reports", free: "none", pro: "none", school: "school" },
    ],
  },
  {
    heading: "🏫 School Tools",
    rows: [
      { label: "Branded school portal", free: "none", pro: "none", school: "school" },
      { label: "Custom CBT test builder", free: "none", pro: "none", school: "school" },
      { label: "Bulk student onboarding", free: "none", pro: "none", school: "school" },
      { label: "Auto-graded report cards (PDF)", free: "none", pro: "none", school: "school" },
      { label: "API access", free: "none", pro: "none", school: "school" },
    ],
  },
  {
    heading: "💬 Support",
    rows: [
      { label: "Community support", free: "free", pro: "pro", school: "school" },
      { label: "Priority support", free: "none", pro: "pro", school: "school" },
      { label: "Dedicated account manager", free: "none", pro: "none", school: "school" },
    ],
  },
];

/* ─── Cell renderer ──────────────────────────────────────────────────────────
   Each outcome is its own branch — complete, static, literal class strings.
──────────────────────────────────────────────────────────────────────────── */
function CellValue({ value, isProCol }: { value: Cell; isProCol?: boolean }) {
  // Plain text value (e.g. "3 subjects", "100 / month")
  if (!["free", "pro", "school", "none"].includes(value)) {
    return (
      <span className={isProCol ? "text-green-300 font-semibold" : "text-text-muted text-sm"}>
        {value}
      </span>
    );
  }
  // Tick
  if (value !== "none") {
    return (
      <div className="flex justify-center">
        <Check
          size={17}
          strokeWidth={2.5}
          className={isProCol ? "text-green-300" : "text-green-500"}
        />
      </div>
    );
  }
  // Dash
  return (
    <div className="flex justify-center">
      <Minus size={16} strokeWidth={2} className="text-text-light" />
    </div>
  );
}

export default function CompareTable() {
  return (
    <section className="px-[5%] py-[100px]">
      {/* Header */}
      <h2
        className="font-serif text-green-900 text-center tracking-[-0.8px] mb-3"
        style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}>
        Compare plans in detail
      </h2>
      <p className="text-base text-text-muted text-center mb-14">
        Every feature, side by side. No surprises.
      </p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full max-w-[900px] mx-auto border-collapse">
          <thead>
            <tr>
              {/* Feature column */}
              <th className="w-[40%] px-6 py-5 text-left" />

              {/* Free */}
              <th className="w-[20%] px-6 py-5 text-center">
                <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-text-muted mb-1">
                  Free
                </div>
                <div className="font-serif text-[22px] text-green-900">₦0</div>
              </th>

              {/* Pro — green header cap */}
              <th className="w-[20%] p-0 text-center">
                <div className="bg-green-800 rounded-[16px_16px_0_0] px-6 py-5">
                  <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-white/50 mb-1">
                    Student Pro
                  </div>
                  <div className="font-serif text-[22px] text-white">
                    ₦2,500<span className="font-sans text-sm font-medium text-white/50">/mo</span>
                  </div>
                </div>
              </th>

              {/* School */}
              <th className="w-[20%] px-6 py-5 text-center">
                <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-text-muted mb-1">
                  School
                </div>
                <div className="font-serif text-[22px] text-green-900">₦15k</div>
              </th>
            </tr>
          </thead>

          <tbody>
            {CATEGORIES.map(({ heading, rows }, ci) => (
              <Fragment key={`cat-${ci}`}>
                {/* Category header row */}
                <tr>
                  <td
                    colSpan={4}
                    className="text-[11px] font-bold tracking-[0.1em] uppercase text-green-600 px-6 pt-5 pb-2 border-b border-cream-border">
                    {heading}
                  </td>
                </tr>

                {/* Feature rows */}
                {rows.map((row, ri) => {
                  const isLast = ci === CATEGORIES.length - 1 && ri === rows.length - 1;
                  return (
                    <tr
                      key={row.label}
                      className={`border-b border-cream-border transition-colors duration-150 hover:bg-green-800/[0.02] ${isLast ? "border-b-0" : ""}`}>
                      {/* Label */}
                      <td className="px-6 py-[14px] text-[13.5px] font-medium text-text-main">
                        {row.label}
                        {row.note && (
                          <span className="block text-[11px] text-text-light mt-0.5">
                            {row.note}
                          </span>
                        )}
                      </td>

                      {/* Free */}
                      <td className="px-6 py-[14px] text-[13.5px] text-center text-text-muted">
                        <CellValue value={row.free} />
                      </td>

                      {/* Pro */}
                      <td
                        className={`px-6 py-[14px] text-[13.5px] text-center bg-green-800/[0.04] ${isLast ? "rounded-b-[16px]" : ""}`}>
                        <CellValue value={row.pro} isProCol />
                      </td>

                      {/* School */}
                      <td className="px-6 py-[14px] text-[13.5px] text-center text-text-muted">
                        <CellValue value={row.school} />
                      </td>
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
