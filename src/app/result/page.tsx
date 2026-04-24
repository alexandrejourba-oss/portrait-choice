"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { TestSession } from "@/types/test";
import { downloadJson } from "@/lib/download";
import { clearSession, loadSession, saveSession } from "@/lib/storage";
import {
  buildDetailedResult,
  getResultBaseName,
  portraitSelectionsToCsv,
  updateParticipantMeta,
} from "@/lib/testLogic";
import { factorOrder, buildFactorSummary, calculateSigns} from "@/lib/factors";

export default function ResultPage() {
  const [session, setSession] = useState<TestSession | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [participantCode, setParticipantCode] = useState("");
  const [participantNote, setParticipantNote] = useState("");
  const [baseName, setBaseName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loaded = loadSession();
    setSession(loaded);

    if (loaded) {
      setParticipantCode(loaded.participantCode ?? "");
      setParticipantNote(loaded.participantNote ?? "");
      setBaseName(getResultBaseName(loaded));
    }
  }, []);

  const detailed = useMemo(() => {
    if (!session) return [];
    return buildDetailedResult(session);
  }, [session]);

  const summary = useMemo(() => {
    if (!session) return null;
    return buildFactorSummary(session);
  }, [session]);

  const summasigns = useMemo(() => {
    if (!summary) return null;
    return calculateSigns(summary);
  }, [summary]);

  const persistMeta = (
    nextCode: string,
    nextNote: string,
    baseSession?: TestSession | null
  ) => {
    const current = baseSession ?? session;
    if (!current) return;

    const updated = updateParticipantMeta(current, {
      participantCode: nextCode,
      participantNote: nextNote,
    });

    setSession(updated);
    saveSession(updated);
  };

  const handleCodeBlur = () => {
    persistMeta(participantCode, participantNote);
  };

  const handleNoteBlur = () => {
    persistMeta(participantCode, participantNote);
  };

  const handleDownload = () => {
    if (!session) return;

    const exportData = {
      session,
      detailedResult: buildDetailedResult(session),
      factorSummary: buildFactorSummary(session),
      summasigns: calculateSigns(buildFactorSummary(session))
    };

    downloadJson(`${baseName}.json`, exportData);
  };

  const handleDownloadCsv = () => {
    if (!session) return;

    const csv = portraitSelectionsToCsv(session);

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    clearSession();
    router.push("/")
  };
 
   return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Тест завершён с использованием набора {session?.stimulusSet === "set1" ? "Б.Энский" :
               session?.stimulusSet === "set2" ? "Н.Баналь" : "?"}
            </h1>
          </div>    

          {/* Шапка участника */}
          <section className="space-y-4 rounded-2xl border border-slate-200 p-5">
            <h2 className="text-2xl font-semibold">Данные участника</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="participantCode"
                  className="text-sm font-medium text-slate-700"
                >
                  Код участника
                </label>
                <input
                  id="participantCode"
                  type="text"
                  value={participantCode}
                  onChange={(e) => setParticipantCode(e.target.value)}
                  onBlur={handleCodeBlur}
                  placeholder="Например: A-014"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="participantNote"
                  className="text-sm font-medium text-slate-700"
                >
                  Примечание
                </label>
                <input
                  id="participantNote"
                  type="text"
                  value={participantNote}
                  onChange={(e) => setParticipantNote(e.target.value)}
                  onBlur={handleNoteBlur}
                  placeholder="Например: группа 2, пилотное тестирование"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                />
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="space-y-4 rounded-2xl border border-slate-200 p-5">
          {summary && (
            <div className="space-y-4">
             <h2 className="text-2xl font-semibold">Сводка по факторам</h2>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">
                        Выбор
                      </th>
                      {factorOrder.map((factor) => (
                        <th
                          key={factor}
                          className="border-b border-slate-200 px-4 py-3 text-center font-semibold text-slate-700"
                        >
                          {factor}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-800">
                        Положительный выбор
                      </td>
                      {factorOrder.map((factor) => (
                        <td
                          key={`pos-${factor}`}
                          className="border-b border-slate-200 px-4 py-3 text-center text-slate-700"
                        >
                          {summary.positive[factor] || ""}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        Отрицательный выбор
                      </td>
                      {factorOrder.map((factor) => (
                        <td
                          key={`neg-${factor}`}
                          className="px-4 py-3 text-center text-slate-700"
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
            </div>
          )}
          </section>

          {/* Детализация */}
          <div className="rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-xl font-semibold text-slate-900">
                Счёт выборов по сериям
              </span>
              <span className="text-sm text-slate-500">
                {showDetails ? "Скрыть" : "Показать"}
              </span>
            </button>

            {showDetails && (
              <div className="border-t border-slate-200 p-5">
                <div className="grid gap-4">
                  {detailed.map((round) => (
                    <div
                      key={round.roundId}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <h3 className="mb-3 text-lg font-semibold">
                        Серия {round.roundId}
                      </h3>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Положительный выбор
                          </p>
                          <ul className="space-y-2 text-slate-700">
                            {round.liked.map((item) => (
                              <li key={item.imageId}>
                                Портрет {item.position} →{" "}
                                <strong>{item.factor ?? "?"}</strong>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Отрицательный выбор
                          </p>
                          <ul className="space-y-2 text-slate-700">
                            {round.disliked.map((item) => (
                              <li key={item.imageId}>
                                Портрет {item.position} →{" "}
                                <strong>{item.factor ?? "?"}</strong>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* JSON */}
          {session && (
            <div className="rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setShowJson((prev) => !prev)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-xl font-semibold text-slate-900">
                  Технические данные
                </span>
                <span className="text-sm text-slate-500">
                  {showJson ? "Скрыть" : "Показать"}
                </span>
              </button>

              {showJson && (
                <div className="border-t border-slate-200 bg-slate-50 p-4">
                  <pre className="overflow-auto whitespace-pre-wrap break-words text-sm text-slate-700">
                    {JSON.stringify(
                      {
                        session,
                        detailedResult: detailed,
                        factorSummary: summary,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          )}
          
          {/* Кнопки */}
           <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                   
            <button
              type="button"
              onClick={() => router.push("/result/print")}                      
              className="inline-flex justify-center rounded-2xl border border-slate-300 px-6 py-4 text-base font-semibold text-slate-800
            hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 transition"
            >
              Скачать результат (PDF)
            </button>
          
            <button
              type="button"
              onClick={handleDownloadCsv}
               className="inline-flex justify-center rounded-2xl border border-slate-300 px-6 py-4 text-base font-semibold text-slate-800
            hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 transition"
            >
              Скачать выборы портретов (CSV)
            </button>
            
            <button
              type="button"
              onClick={handleDownload}
               className="inline-flex justify-center rounded-2xl border border-slate-300 px-6 py-4 text-base font-semibold text-slate-800
            hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 transition"
            >
              Скачать технические данные (JSON)
            </button>

            <button
              type="button"
              onClick={handleReset}
               className="inline-flex justify-center rounded-2xl border border-slate-300 px-6 py-4 text-base font-semibold text-slate-800
            hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 transition"
            >
              Очистить данные и начать заново
            </button>

          </div>

        </div>
      </div>
    </main>
  );
}