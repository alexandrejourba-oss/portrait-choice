"use client";

import { useRouter } from "next/navigation";

export default function StartScreen() {
  const router = useRouter();
 return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">            
		  <div className="space-y-3">
            <p className="text-3xl font-bold tracking-tight sm:text-3xl">
              Тест восьми влечений - метод портретных выборов
            </p>
            <h1 className="rounded-2xl border border-slate-200 p-4 text-sm font-medium text-slate-500">
              Стимульный материал сформирован на основании данных из:
			  <p>Леопольд Сонди. Учебник экспериментальной диагностики влечений. М.: Когито-Центр, 2005</p>
			  <p>Людмила Николаевна Собчик. Метод портретных выборов - адаптированный тест Сонди. СПб.: Речь, 2013</p>
            </h1>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <strong>Важно:</strong> данный сайт предназначен исключительно для учебных и демонстрационных целей. 
			<p>Его функционал не может быть применен для психологической или иной диагностики личности.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4">
              <h2 className="mb-2 text-lg font-semibold">Что делает сайт</h2>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Показывает пользователю серии портретов</li>
                <li>• Сохраняет выборы пользователя локально</li>
                <li>• Позволяет скачать результаты выборов пользователя</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <h2 className="mb-2 text-lg font-semibold">Что сайт не делает</h2>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Не интерпретирует результаты выбора пользователя</li>
                <li>• Не отправляет данные на какой-либо сервер</li>
                <li>• Не ставит никаких диагнозов</li>
              </ul>
            </div>
          </div>
		
          <button
          type="button"
          className="inline-flex rounded-2xl border border-slate-200 p-4 bg-slate-900 text-base font-semibold text-white"
          onClick={() => router.push("/instructions")}
          >
          Прочесть инструкцию
          </button>
      </div>
    </main>
  );
}