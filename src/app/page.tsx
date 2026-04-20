"use client";

import { useEffect, useState } from "react";
import { loadSession } from "@/lib/storage";
import StartScreen from "@/components/StartScreen";
import ResumeScreen from "@/components/ResumeScreen";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    setMounted(true);

    const existing = loadSession();
    if (existing && (existing.currentRoundIndex !== 0 && existing.currentRoundIndex !== 6)) {
      setHasSession(true);
    }
  }, []);

  if (!mounted) return null;

  // Условный рендер
  if (hasSession) {
    return <ResumeScreen />; // "Продолжить / Начать заново"
  }
  return <StartScreen />; // "Начальный экран"
}
