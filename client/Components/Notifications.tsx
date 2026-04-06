import { Bell } from "lucide-react";
type NotificationsProps = {
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
};
const Notifications = ({ notificationsOpen, setNotificationsOpen }: NotificationsProps) => {
  return (
    <div className="relative">
      <button
        title="notification"
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        className="p-2 rounded-lg hover:bg-cream transition-colors relative">
        <Bell size={18} className="text-text-muted" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
      </button>
      {notificationsOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border p-4 z-50">
          <div className="text-[13px] font-semibold mb-3">Notifications</div>
          <div className="space-y-3">
            <div className="text-[12px] text-text-muted">No new notifications</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
