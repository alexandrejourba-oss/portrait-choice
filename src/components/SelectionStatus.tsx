import { StepMode } from "@/types/test";

export default function SelectionStatus({
  mode,
  likedCount,
  dislikedCount,
}: {
  mode: StepMode;
  likedCount: number;
  dislikedCount: number;
}) {
  return (
    <div className="flex flex-wrap gap-3 text-sm">
      <div
        className={`rounded-full px-3 py-1 font-medium ${
          mode === "liked"
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-700"
        }`}
      >
        Симпатичные: {likedCount}/2
      </div>

      <div
        className={`rounded-full px-3 py-1 font-medium ${
          mode === "disliked"
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-700"
        }`}
      >
        Неприятные: {dislikedCount}/2
      </div>
    </div>
  );
}