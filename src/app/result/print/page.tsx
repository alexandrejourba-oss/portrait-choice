"use client";

import { useEffect, useMemo, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { useRouter } from "next/navigation";
import { loadSession } from "@/lib/storage";
import { factorOrder, buildFactorSummary, calculateSigns } from "@/lib/factors";
import { TestSession } from "@/types/test";

function formatDate(date?: string) {
  if (!date) return "—";

  try {
    return new Date(date).toLocaleString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return date;
  }
}

export default function PrintResultPage() {
  
  const [session, setSession] = useState<TestSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    setSession(loadSession());
  }, []);

  const summary = useMemo(() => {
    if (!session) return null;
    return buildFactorSummary(session);
  }, [session]);

  const summasigns = useMemo(() => {
    if (!summary) return null;
    return calculateSigns(summary);
  }, [summary]);

  if (!session || !summary) {
    return (
      <main className="min-h-screen bg-white px-6 py-10 print:p-0">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold">Протокол недоступен:</h1>
          <p className="mt-3 text-slate-700">Не найдены данные завершённого теста.</p>
        </div>
      </main>
    );
  }

const generatePDF = async () => {
  const element = document.getElementById("result");

  if (!element) return;

  // 👉 делаем скролл вверх (иначе мобилки иногда режут)
  window.scrollTo(0, 0);

 const originalWidth = element.style.width;

 element.style.width = "794px";

 const canvas = await html2canvas(element, {
  scale: 2, // качество
  useCORS: true,
  logging: false,
 });


  const imgData = canvas.toDataURL("image/jpeg", 1.0);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
   });

    
  const margin = 10; // 👈 поля по 10 мм
   
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const usableWidth = pageWidth - margin * 2;
  const usableHeight = pageHeight - margin * 2;

  const imgWidth = usableWidth;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

let position = margin;

if (imgHeight < usableHeight) {
  pdf.addImage(imgData, "JPEG", margin, margin, imgWidth, imgHeight);
} else {
  let heightLeft = imgHeight;

  while (heightLeft > 0) {
    pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);

    heightLeft -= usableHeight;
    position -= usableHeight;

    if (heightLeft > 0) {
      pdf.addPage();
      position = margin;
    }
  }
}

  pdf.save("portrait-choice-selections.pdf");

  element.style.width = originalWidth;
};

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 print:px-0 print:py-0">
      <div className="mx-auto max-w-5xl bg-white print:max-w-none">
        <div className="mb-6 flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={generatePDF}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
           Скачать PDF
        </button>

        <button
            type="button"
            onClick={() => {router.push("/result")}}
            className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800"
          >
            К результатам
        </button>
        </div>

        <div id="result">
        <div className="space-y-8 print:space-y-6">
          {/* Шапка */}
          <section className="border-b border-slate-200 pb-6">

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Результат теста восьми влечений по методу портретных выборов
            </h1>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 mt-2">  
              Тест завершён с использованием набора стимулов {session?.stimulusSet === "set1" ? "Б.Энский" :
               session?.stimulusSet === "set2" ? "Н.Баналь" : "?"}
            </h1>
            <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              <p>
                <span className="font-semibold">Код участника:</span>{" "}
                {session.participantCode?.trim() || "—"}
              </p>

              <p>
                <span className="font-semibold">Примечание:</span>{" "}
                {session.participantNote?.trim() || "—"}
              </p>
              
              <p>
                <span className="font-semibold">Начало:</span>{" "}
                {formatDate(session.startedAt)}
              </p>

              <p>
                <span className="font-semibold">Завершение:</span>{" "}
                {formatDate(session.completedAt)}
              </p>
            </div>
          </section>

          {/* Summary */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">
              Сводка по факторам
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-slate-300">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="border-b border-slate-300 px-4 py-3 text-left font-semibold text-slate-800">
                      Выбор
                    </th>
                    {factorOrder.map((factor) => (
                      <th
                        key={factor}
                        className="border-b border-slate-300 px-4 py-3 text-center font-semibold text-slate-800"
                      >
                        {factor}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="border-b border-slate-300 px-4 py-3 font-medium text-slate-900">
                      Положительный выбор
                    </td>
                    {factorOrder.map((factor) => (
                      <td
                        key={`pos-${factor}`}
                        className="border-b border-slate-300 px-4 py-3 text-center text-slate-800"
                      >
                        {summary.positive[factor] || ""}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      Отрицательный выбор
                    </td>
                    {factorOrder.map((factor) => (
                      <td
                        key={`neg-${factor}`}
                        className="px-4 py-3 text-center text-slate-800"
                      >
                        {summary.negative[factor] || ""}
                      </td>
                    ))}
                  </tr>

					        <tr>
					          <td className="px-4 py-3 font-medium text-slate-800">
                       Обозначения по Сонди
					         </td>
						        {factorOrder.map((factor) => (
						       <td
						         key={`sign-${factor}`}
						            className="px-4 py-3 text-center text-slate-700"
						        >
						            {summasigns?.[factor] || ""}
						       </td>
						        ))}
					        </tr>

                </tbody>
              </table>
            </div>
          </section>
        </div>
        </div>
      </div>
    </main>
  );
}