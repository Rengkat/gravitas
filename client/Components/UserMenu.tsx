import { ChevronDown, CreditCard, LogOut, User, UserCircle } from "lucide-react";
import Link from "next/link";
type UserMenuProps = {
  userMenuOpen: boolean;
  setUserMenuOpen: (open: boolean) => void;
};
const UserMenu = ({ userMenuOpen, setUserMenuOpen }: UserMenuProps) => {
  return (
    <div className="relative">
      <button
        title="user menu"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-cream transition-colors">
        <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center">
          <User size={14} className="text-white" />
        </div>
        <ChevronDown size={14} className="text-text-muted" />
      </button>
      {userMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border p-2 z-50">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] hover:bg-cream transition-colors">
            <UserCircle size={14} /> Profile
          </Link>
          <Link
            href="/dashboard/settings/billing"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] hover:bg-cream transition-colors">
            <CreditCard size={14} /> Billing
          </Link>
          <div className="h-px my-1 bg-cream-border" />
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
