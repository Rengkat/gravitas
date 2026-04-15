"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle, CreditCard, Building2, Smartphone } from "lucide-react";
import { Tutor, TutorPackage } from "@/types/tutors";
import { formatPrice } from "../helper";

type BookingStep = "details" | "payment" | "confirmation";

interface BookingModalProps {
  tutor: Tutor;
  onClose: () => void;
}

const PAYMENT_METHODS = [
  { id: "card", label: "Card Payment", sub: "Visa, Mastercard, Verve", icon: CreditCard },
  { id: "bank", label: "Bank Transfer", sub: "Direct bank transfer", icon: Building2 },
  { id: "ussd", label: "USSD", sub: "Pay with USSD code", icon: Smartphone },
];

function generateDates() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

export default function BookingModal({ tutor, onClose }: BookingModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<BookingStep>("details");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<TutorPackage>(tutor.packages[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 8).toUpperCase());

  const availableDates = generateDates();

  const handleContinue = () => {
    if (!selectedDate || !selectedTime || !subject) {
      alert("Please fill in all required fields");
      return;
    }
    setStep("payment");
  };

  const handlePay = () => {
    // TODO: integrate Paystack / Flutterwave payment
    setStep("confirmation");
    setTimeout(() => {
      onClose();
      router.push("/dashboard/bookings");
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Book a Session</h2>
            <p className="text-[12px] text-gray-500">with {tutor.name}</p>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {(["details", "payment", "confirmation"] as BookingStep[]).map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div
                  className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                    step === s
                      ? "bg-green-600 text-white"
                      : s === "confirmation" && step === "confirmation"
                        ? "bg-green-600 text-white"
                        : ["details", "payment"].indexOf(s) <
                            ["details", "payment", "confirmation"].indexOf(step)
                          ? "bg-green-200 text-green-700"
                          : "bg-gray-100 text-gray-400"
                  }`}>
                  {i + 1}
                </div>
                {i < 2 && <div className="w-4 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
          <button title="close" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* ── Step 1: Details ── */}
          {step === "details" && (
            <div className="space-y-5">
              {/* Subject */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Subject *</label>
                <select title="select subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[14px]">
                  <option value="">Select a subject</option>
                  {tutor.specialization.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Date *</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {availableDates.map((date, idx) => {
                    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                    const isAvail = tutor.availability.includes(
                      date.toLocaleDateString("en-US", { weekday: "long" }),
                    );
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    return (
                      <button
                        key={idx}
                        onClick={() => isAvail && setSelectedDate(date)}
                        disabled={!isAvail}
                        className={`p-2.5 rounded-xl text-center transition-all text-[12px] ${
                          isSelected
                            ? "bg-green-600 text-white font-bold"
                            : isAvail
                              ? "border border-gray-200 hover:border-green-500 text-gray-700"
                              : "bg-gray-50 text-gray-300 cursor-not-allowed"
                        }`}>
                        <div className="font-medium">{dayName}</div>
                        <div className="font-bold">{date.getDate()}</div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">Greyed out = tutor unavailable</p>
              </div>

              {/* Time */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Time *</label>
                <div className="grid grid-cols-3 gap-2">
                  {tutor.timeSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                        selectedTime === slot
                          ? "bg-green-600 text-white"
                          : "border border-gray-200 hover:border-green-500 text-gray-700"
                      }`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Package */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Package</label>
                <div className="space-y-2">
                  {tutor.packages.map((pkg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`w-full p-3.5 rounded-xl text-left transition-all ${
                        selectedPackage.name === pkg.name
                          ? "bg-green-50 border-2 border-green-600"
                          : "border border-gray-200 hover:border-green-300"
                      }`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800 text-[14px]">{pkg.name}</p>
                            {pkg.popular && (
                              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-gray-500">{pkg.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-700">{formatPrice(pkg.price)}</p>
                          {pkg.savings > 0 && (
                            <p className="text-[11px] text-emerald-600">
                              Save {formatPrice(pkg.savings)}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Tell the tutor what topics you need help with, your current level, and any specific goals..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[13px] resize-none"
                />
              </div>

              <button
                onClick={handleContinue}
                className="w-full py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors text-[14px]">
                Continue to Payment
              </button>
            </div>
          )}

          {/* ── Step 2: Payment ── */}
          {step === "payment" && (
            <div className="space-y-5">
              {/* Summary */}
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-3 text-[14px]">Booking Summary</h3>
                <div className="space-y-1.5 text-[13px]">
                  {[
                    ["Tutor", tutor.name],
                    ["Subject", subject.charAt(0).toUpperCase() + subject.slice(1)],
                    [
                      "Date",
                      selectedDate?.toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      }) ?? "",
                    ],
                    ["Time", selectedTime],
                    ["Package", selectedPackage.name],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-500">{k}:</span>
                      <span className="font-medium text-gray-800">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-green-200 mt-2">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-green-700 text-[16px]">
                      {formatPrice(selectedPackage.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map(({ id, label, sub, icon: Icon }) => (
                    <label
                      key={id}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}>
                      <input
                        type="radio"
                        name="payment"
                        value={id}
                        checked={paymentMethod === id}
                        onChange={() => setPaymentMethod(id)}
                        className="accent-green-600"
                      />
                      <Icon size={18} className="text-green-700 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800 text-[14px]">{label}</p>
                        <p className="text-[12px] text-gray-500">{sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("details")}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-[14px]">
                  Back
                </button>
                <button
                  onClick={handlePay}
                  className="flex-[2] py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all text-[14px]">
                  Pay {formatPrice(selectedPackage.price)}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Confirmation ── */}
          {step === "confirmation" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
              <p className="text-[14px] text-gray-600 mb-5">
                Your session with {tutor.name} has been booked. A confirmation will be sent to your
                email.
              </p>
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-left text-[13px] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Session ID:</span>
                  <span className="font-bold text-gray-800">#BOOK-{sessionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium text-gray-800">
                    {selectedDate?.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-medium text-gray-800">{selectedTime}</span>
                </div>
              </div>
              <p className="text-[12px] text-gray-400 mt-4">Redirecting to your bookings...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
