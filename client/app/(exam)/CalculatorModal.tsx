import { useCallback, useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────
   WORKING CALCULATOR
───────────────────────────────────────────────────────── */
export default function CalculatorModal({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");

  const handleKey = useCallback(
    (key: string) => {
      if (key === "C") {
        setDisplay("0");
        setExpression("");
        return;
      }
      if (key === "⌫") {
        setDisplay((d) => (d.length > 1 ? d.slice(0, -1) : "0"));
        return;
      }
      if (key === "=") {
        try {
          // eslint-disable-next-line no-new-func
          const result = Function(`"use strict"; return (${expression || display})`)();
          const str = String(parseFloat(result.toFixed(10)));
          setDisplay(str);
          setExpression(str);
        } catch {
          setDisplay("Error");
          setExpression("");
        }
        return;
      }
      const isOperator = ["+", "-", "×", "÷", "%"].includes(key);
      const op = key === "×" ? "*" : key === "÷" ? "/" : key;
      if (isOperator) {
        setExpression((e) => (e || display) + op);
        setDisplay(op);
      } else {
        if (display === "0" || ["+", "-", "*", "/", "%"].includes(display)) {
          setDisplay(key);
          setExpression((e) => e + key);
        } else {
          setDisplay((d) => d + key);
          setExpression((e) => e + key);
        }
      }
    },
    [display, expression],
  );

  // Keyboard support for the calculator
  useEffect(() => {
    const map: Record<string, string> = {
      Enter: "=",
      Backspace: "⌫",
      Escape: "C",
    };
    const handler = (e: KeyboardEvent) => {
      const k = map[e.key] ?? (/^[\d.+\-*/%]$/.test(e.key) ? e.key : null);
      if (k) handleKey(k === "*" ? "×" : k === "/" ? "÷" : k);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  const buttons = [
    ["C", "⌫", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  return (
    <div
      role="dialog"
      aria-label="Calculator"
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-72 overflow-hidden">
        <div className="bg-green-800 text-white px-4 py-3 flex justify-between items-center">
          <span className="font-semibold text-sm">Calculator</span>
          <button
            onClick={onClose}
            aria-label="Close calculator"
            className="text-white/70 hover:text-white text-lg leading-none">
            ✕
          </button>
        </div>
        <div className="bg-gray-900 px-4 py-3">
          <div className="text-gray-400 text-xs h-4 text-right truncate">{expression || " "}</div>
          <div className="text-white font-mono text-2xl text-right truncate">{display}</div>
        </div>
        <div className="p-3 grid gap-2">
          {buttons.map((row, ri) => (
            <div
              key={ri}
              className={`grid gap-2 ${row.length === 4 ? "grid-cols-4" : "grid-cols-3"}`}>
              {row.map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleKey(btn)}
                  className={`py-3 rounded-xl font-mono font-semibold text-sm transition-all active:scale-95 ${
                    btn === "="
                      ? "bg-green-700 text-white hover:bg-green-600 col-span-1"
                      : btn === "C"
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : ["÷", "×", "-", "+", "%", "⌫"].includes(btn)
                          ? "bg-green-50 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  } ${btn === "0" ? "col-span-2" : ""}`}>
                  {btn}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
