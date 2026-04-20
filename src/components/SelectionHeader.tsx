import { StepMode } from "@/types/test";

export default function SelectionHeader({
  mode,
  selectedCount,
}: {
  mode: StepMode;
  selectedCount: number;
}) {
  const title =
    mode === "liked"
      ? "Выберите 2 наиболее симпатичных"
      : "Выберите 2 наиболее неприятных";

  const subtitle =
    mode === "liked"
      ? "Отметьте два портрета, которые вызывают наибольшую симпатию"
      : "Отметьте два портрета, которые вызывают наибольшее неприятие";

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      <p className="text-sm text-slate-600 sm:text-base">{subtitle}</p>
      <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
        Выбрано: {selectedCount} из 2
      </div>
    </div>
  );
}