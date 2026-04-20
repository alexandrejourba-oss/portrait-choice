"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import BottomActionBar from "@/components/BottomActionBar";
import PortraitCard from "@/components/PortraitCard";
import ProgressBar from "@/components/ProgressBar";
import SelectionHeader from "@/components/SelectionHeader";
import SelectionStatus from "@/components/SelectionStatus";

import { testConfig } from "@/config/testConfig";
import { StepMode, TestSession } from "@/types/test";

import {
  finalizeSession,
  upsertRoundAnswer
} from "@/lib/testLogic";

import {
  loadSession,
  saveSession
} from "@/lib/storage";

import { generateTestData } from "@/lib/testData";

export default function TestPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [mode, setMode] = useState<StepMode>("liked");
  const [liked, setLiked] = useState<number[]>([]);
  const [disliked, setDisliked] = useState<number[]>([]);
  const [session, setSession] = useState<TestSession | null>(null);

  const currentSet = testConfig.stimulusSets.find(
  (s) => s.id === session?.stimulusSet
  );  

  // ✅ Генерация теста (один раз)
  const testData = useMemo(() => {
   if (!session?.stimulusSet) return [];
   return generateTestData(session.stimulusSet);
   }, [session?.stimulusSet]);

  // ✅ Инициализация
  useEffect(() => {
    setMounted(true);

  const existing = loadSession();
	if (!existing) {
	router.push("/"); // нет сессии → назад на старт
	return;
	}
	else {
	setSession(existing);
	setRoundIndex(existing.currentRoundIndex || 0);
    }
	}, []);

  // ✅ Защита: если нет stimulusSet → назад
  useEffect(() => {
    if (mounted && session && !session.stimulusSet) {
      router.push("/instruction");
    }
  }, [mounted, session, router]);

  // ✅ Сброс выбора при смене раунда
  useEffect(() => {
    if (!mounted) return;
    setLiked([]);
    setDisliked([]);
    setMode("liked");
  }, [roundIndex, mounted]);

  const currentRound = testData[roundIndex];
  const selectedCount = mode === "liked" ? liked.length : disliked.length;
  const canContinue = selectedCount === 2;

  const buttonLabel = useMemo(() => {
    if (mode === "liked") return "Продолжить";
    return roundIndex === testData.length - 1
      ? "Завершить тест"
      : "Следующая серия";
  }, [mode, roundIndex, testData.length]);

  // ✅ Выбор карточек
  const toggleSelection = (imageId: number) => {
    if (mode === "liked") {
      setLiked((prev) => {
        if (prev.includes(imageId)) {
          return prev.filter((id) => id !== imageId);
        }
        if (prev.length >= 2) return prev;
        return [...prev, imageId];
      });
      return;
    }

    if (liked.includes(imageId)) return;

    setDisliked((prev) => {
      if (prev.includes(imageId)) {
        return prev.filter((id) => id !== imageId);
      }
      if (prev.length >= 2) return prev;
      return [...prev, imageId];
    });
  };

  // ✅ Переход дальше
  const handleContinue = () => {
    if (!session || !currentRound) return;

    if (mode === "liked") {
      setMode("disliked");
      return;
    }

    const updated = upsertRoundAnswer(session, {
      roundId: currentRound.id,
      liked,
      disliked,
    });

    updated.currentRoundIndex = roundIndex + 1;
    saveSession(updated);
    setSession(updated);

    // финал
    if (roundIndex === testData.length - 1) {
      const done = finalizeSession(updated);
      saveSession(done);
      router.push("/result");
      return;
    }

    setRoundIndex((prev) => prev + 1);
  };

  // ✅ Сброс выборов
  const handleClear = () => {
   if (liked.length === 0 && disliked.length === 0) return;
   setLiked([]);
   setDisliked([]);
   setMode("liked");
  };

  // ⏳ загрузка
  if (!mounted || !session) {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-slate-600">Загрузка теста...</p>
        </div>
      </main>
    );
  }

  // ❌ нет набора
  if (!currentSet) {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm space-y-4">
          <p className="text-slate-700">
            Не выбран набор изображений.
          </p>
          <button
            onClick={() => router.push("/instruction")}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-white"
          >
            Вернуться к инструкции
          </button>
        </div>
      </main>
    );
  }

  // ❌ нет раунда
  if (!currentRound) {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm space-y-4">
          <p className="text-slate-700">
            Не удалось загрузить серию теста.
          </p>
          <button
            onClick={handleClear}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-white"
          >
            Начать заново
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 pb-32 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl space-y-6">

        <div className="flex justify-end">
          <button
	        type="button"
		    disabled={liked.length === 0 && disliked.length === 0}		
            onClick={handleClear}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Очистить выбор портретов
          </button>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-8">
          <div className="space-y-6">

            <ProgressBar
              current={roundIndex + 1}
              total={testData.length}
            />

            <SelectionHeader
              mode={mode}
              selectedCount={selectedCount}
            />

            <SelectionStatus
              mode={mode}
              likedCount={liked.length}
              dislikedCount={disliked.length}
            />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {currentRound.images.map((image) => {
                const selected =
                  mode === "liked"
                    ? liked.includes(image.id)
                    : disliked.includes(image.id);

                const disabled =
                  mode === "disliked" &&
                  liked.includes(image.id);

                return (
                <PortraitCard
					key={image.id}
					src={image.src}
					alt={image.alt}
					selected={selected}
					disabled={disabled}
					onClick={() => toggleSelection(image.id)}
				/>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      <BottomActionBar
        disabled={!canContinue}
        label={buttonLabel}
        onClick={handleContinue}
      />
    </main>
  );
}