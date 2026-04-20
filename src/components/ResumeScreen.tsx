"use client";

import { useRouter } from "next/navigation";
import { clearSession, loadSession } from "@/lib/storage";
import { testConfig } from "@/config/testConfig";

export default function ResumeScreen() {
  
  const router = useRouter();
  const session = loadSession();

  if (!session) return null;

  const handleContinue = () => {
    router.push("/test");
  };

  const handleRestart = () => {
    clearSession();
    router.push("/instructions");
  };

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm space-y-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Продолжить тест?
        </h1>
	    <p className="text-slate-600">
			У вас есть незавершённый тест. Вы можете продолжить с того же места
			или начать заново.
        </p>
		<p className="text-sm text-slate-600">
			Пройдено: {session.currentRoundIndex} из {testConfig.rounds}
		</p>

        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="w-full rounded-2xl bg-slate-900 px-5 py-4 text-white font-medium"
          >
            Продолжить
          </button>

          <button
            onClick={handleRestart}
            className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-slate-700 font-medium"
          >
            Начать заново
          </button>
        </div>
      </div>
    </main>
  );
}