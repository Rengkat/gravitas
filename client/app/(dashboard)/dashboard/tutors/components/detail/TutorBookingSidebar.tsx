"use client";

import { MessageCircle, Globe, Clock, CheckCircle, Zap } from "lucide-react";
import { Tutor } from "@/types/tutors";
import { formatPrice } from "../helper";

interface TutorBookingSidebarProps {
  tutor: Tutor;
  onBook: () => void;
  onMessage: () => void;
}

export default function TutorBookingSidebar({
  tutor,
  onBook,
  onMessage,
}: TutorBookingSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Booking card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center mb-5">
          <p className="text-[12px] text-gray-500 mb-1">Hourly Rate</p>
          <p className="text-3xl font-bold text-green-700">{formatPrice(tutor.hourlyRate)}</p>
          <p className="text-[11px] text-gray-400">per hour</p>
        </div>

        <button
          onClick={onBook}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 mb-3 text-[14px]">
          Book a Session
        </button>

        <button
          onClick={onMessage}
          className="w-full py-3 border-2 border-green-600 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2 text-[14px]">
          <MessageCircle size={17} />
          Send Message
        </button>

        {/* Trust signals */}
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-[12px] text-gray-500">
            <CheckCircle size={13} className="text-green-500" />
            Free cancellation up to 24 hours before
          </div>
          <div className="flex items-center gap-2 text-[12px] text-gray-500">
            <CheckCircle size={13} className="text-green-500" />
            Secure payment via Paystack
          </div>
          <div className="flex items-center gap-2 text-[12px] text-gray-500">
            <CheckCircle size={13} className="text-green-500" />
            Money-back guarantee for first session
          </div>
        </div>
      </div>

      {/* Quick info */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="font-bold text-gray-800 mb-3 text-[14px]">Quick Info</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-[13px]">
            <Globe size={15} className="text-green-600 shrink-0" />
            <span className="text-gray-600">Speaks: {tutor.languages.join(", ")}</span>
          </div>
          <div className="flex items-center gap-3 text-[13px]">
            <Clock size={15} className="text-green-600 shrink-0" />
            <span className="text-gray-600">Responds {tutor.responseTime}</span>
          </div>
          <div className="flex items-center gap-3 text-[13px]">
            <Zap size={15} className="text-green-600 shrink-0" />
            <span className="text-gray-600">{tutor.completionRate}% completion rate</span>
          </div>
          <div className="flex items-center gap-3 text-[13px]">
            <CheckCircle size={15} className="text-green-600 shrink-0" />
            <span className="text-gray-600">
              {tutor.sessionsCompleted.toLocaleString()} sessions done
            </span>
          </div>
        </div>
      </div>

      {/* Packages */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="font-bold text-gray-800 mb-3 text-[14px]">Session Packages</h3>
        <div className="space-y-2">
          {tutor.packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all ${
                pkg.popular ? "border-green-400 bg-green-50" : "border-gray-100 bg-gray-50"
              }`}>
              {pkg.popular && (
                <div className="text-[10px] font-bold text-green-700 mb-1 uppercase tracking-wide">
                  ★ Most Popular
                </div>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800 text-[13px]">{pkg.name}</p>
                  <p className="text-[11px] text-gray-500">{pkg.duration}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700 text-[14px]">{formatPrice(pkg.price)}</p>
                  {pkg.savings > 0 && (
                    <p className="text-[11px] text-emerald-600 font-medium">
                      Save {formatPrice(pkg.savings)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="font-bold text-gray-800 mb-3 text-[14px]">Available Days</h3>
        <div className="flex flex-wrap gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
            const fullDays: Record<string, string> = {
              Mon: "Monday",
              Tue: "Tuesday",
              Wed: "Wednesday",
              Thu: "Thursday",
              Fri: "Friday",
              Sat: "Saturday",
              Sun: "Sunday",
            };
            const available = tutor.availability.includes(fullDays[day]);
            return (
              <div
                key={day}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold ${
                  available
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-400"
                }`}>
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
