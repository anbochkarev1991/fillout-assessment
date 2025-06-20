import { Plus } from "lucide-react";

export default function AddPageButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 h-[32px] rounded-[8px] border border-[#E1E1E1] bg-white text-black font-medium text-sm shadow-[0px_1px_1px_rgba(0,0,0,0.02),0px_1px_3px_rgba(0,0,0,0.04)] hover:bg-gray-50 transition"
    >
      <Plus size={16} />
      Add page
    </button>
  );
}
