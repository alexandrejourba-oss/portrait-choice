import { TestSession } from "@/types/test";

const STORAGE_KEY = "portrait-choice-session";

export function loadSession(): TestSession | null {
  
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TestSession;
  } catch {
    return null;
  }
}

export function saveSession(session: TestSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}