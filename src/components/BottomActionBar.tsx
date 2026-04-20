type Props = {
  disabled: boolean;
  label: string;
  onClick: () => void;
};

export default function BottomActionBar({
  disabled,
  label,
  onClick,
}: Props) {
  return (
    <div className="sticky bottom-0 left-0 right-0 mt-6 border-t border-slate-200 bg-white/90 px-4 py-4 backdrop-blur">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          className="w-full rounded-2xl bg-slate-900 px-5 py-4 text-base font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          {label}
        </button>
      </div>
    </div>
  );
}