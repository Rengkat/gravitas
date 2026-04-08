import { Users, ArrowRight } from "lucide-react";
import Link from "next/link";
interface Booking {
  id: string | number;
  tutorName: string;
  subject: string;
  date: string;
  time: string;
}

interface BookingCardProps {
  booking: Booking;
}

const BookingCard = ({ booking }: BookingCardProps) => {
  return (
    <div key={booking.id} className="p-3 rounded-xl bg-cream">
      <div className="flex items-center gap-3 mb-2">
        <Users size={14} className="text-green-600" />
        <span className="text-[13px] font-semibold text-green-900">{booking.tutorName}</span>
      </div>
      <div className="text-[12px] text-text-muted mb-2">
        {booking.subject} • {booking.date} at {booking.time}
      </div>
      <Link
        href={`/dashboard/bookings/${booking.id}/session`}
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-green-600">
        Join Session <ArrowRight size={12} />
      </Link>
    </div>
  );
};

export default BookingCard;
