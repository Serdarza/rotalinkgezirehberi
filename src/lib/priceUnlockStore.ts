import { facilityMatchKey } from "@/lib/searchNormalize";

/** Flutter PriceUnlockStore web karşılığı — oturum içi haklar. */

const CREDITS_KEY = "rotalink_price_unlock_credits";
const UNLOCKED_KEY = "rotalink_price_unlocked_keys";

export const CREDITS_PER_REWARD = 5;

function canUseStorage() {
  return typeof window !== "undefined";
}

function readCredits(): number {
  if (!canUseStorage()) return 0;
  try {
    const n = Number(sessionStorage.getItem(CREDITS_KEY) ?? "0");
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

function writeCredits(n: number) {
  if (!canUseStorage()) return;
  try {
    sessionStorage.setItem(CREDITS_KEY, String(Math.max(0, n)));
  } catch {
    // ignore
  }
}

function readUnlocked(): Set<string> {
  if (!canUseStorage()) return new Set();
  try {
    const raw = sessionStorage.getItem(UNLOCKED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.map(String));
  } catch {
    return new Set();
  }
}

function writeUnlocked(set: Set<string>) {
  if (!canUseStorage()) return;
  try {
    sessionStorage.setItem(UNLOCKED_KEY, JSON.stringify([...set]));
  } catch {
    // ignore
  }
}

export function getPriceUnlockCredits(): number {
  return readCredits();
}

export function isFacilityPriceUnlocked(il: string, isim: string): boolean {
  return readUnlocked().has(facilityMatchKey(il, isim));
}

export function unlockFacilityWithCredit(il: string, isim: string): boolean {
  const key = facilityMatchKey(il, isim);
  const unlocked = readUnlocked();
  if (unlocked.has(key)) return true;
  const credits = readCredits();
  if (credits <= 0) return false;
  writeCredits(credits - 1);
  unlocked.add(key);
  writeUnlocked(unlocked);
  return true;
}

export function grantRewardCredits() {
  writeCredits(readCredits() + CREDITS_PER_REWARD);
}

/** Reklam sonrası +5 hak ve bu tesisi aç. */
export function grantRewardAndUnlock(il: string, isim: string): boolean {
  grantRewardCredits();
  return unlockFacilityWithCredit(il, isim);
}
