"use client";

type Props = {
  checked: boolean;
  onChange: (value: boolean) => void;
};

export default function ConsentCheckbox({ checked, onChange }: Props) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 rounded border-slate-300"
      />
      <span className="text-sm leading-6 text-slate-700">
        Я понимаю, что пользуюсь <strong>демонстрационной веб-реализацией теста</strong>,
        сайт <strong>не интерпретирует результаты</strong>, а мои ответы во время прохождения теста {" "}
        <strong>хранятся локально в браузере и не отправляются на сервер.</strong>.
      </span>
    </label>
  );
}