import { Users } from "lucide-react";

interface TutorEmptyStateProps {
  onReset: () => void;
}

export default function TutorEmptyState({ onReset }: TutorEmptyStateProps) {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Users size={36} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-700 mb-2">No tutors found</h3>
      <p className="text-[13px] text-gray-500 mb-4">
        Try adjusting your filters or search query
      </p>
      <button
        onClick={onReset}
        className="px-5 py-2 rounded-xl bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700 transition-colors"
      >
        Reset filters
      </button>
    </div>
  );
}
