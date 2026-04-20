"use client";

import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export default function PortraitCard({
  src,
  alt,
  selected,
  disabled,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all",
        "focus:outline-none focus:ring-2 focus:ring-slate-400",
        "active:scale-[0.98]",
        selected ? "border-slate-900 ring-2 ring-slate-900" : "border-slate-200",
        disabled ? "opacity-40" : "hover:shadow-md",
      ].join(" ")}
    >
      <div className="relative aspect-[3/4] w-full bg-slate-100">
        <Image src={src} alt={alt} fill className="object-cover" unoptimized />
      </div>

      {selected && (
        <div className="absolute right-3 top-3 rounded-full bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
          Выбрано
        </div>
      )}
    </button>
  );
}