import { TestSession } from "@/types/test";

export type Factor = "m" | "d" | "p" | "k" | "hy" | "e" | "s" | "h";

export type FactorSummary = {
  positive: Record<Factor, number>;
  negative: Record<Factor, number> };

export const factorOrder: Factor[] = ["m", "d", "p", "k", "hy", "e", "s", "h"];

export const factorMap: Record<number, Record<number, Factor>> = {
  1: {
    1: "k",
    2: "s",
    3: "p",
    4: "d",
    5: "h",
    6: "e",
    7: "m",
    8: "hy",
  },
  2: {
    1: "hy",
    2: "m",
    3: "e",
    4: "h",
    5: "d",
    6: "p",
    7: "s",
    8: "k",
  },
  3: {
    1: "h",
    2: "e",
    3: "s",
    4: "hy",
    5: "k",
    6: "d",
    7: "m",
    8: "p",
  },
  4: {
    1: "p",
    2: "hy",
    3: "d",
    4: "k",
    5: "m",
    6: "s",
    7: "e",
    8: "h",
  },
  5: {
    1: "e",
    2: "d",
    3: "hy",
    4: "p",
    5: "s",
    6: "k",
    7: "h",
    8: "m",
  },
  6: {
    1: "m",
    2: "h",
    3: "k",
    4: "s",
    5: "p",
    6: "hy",
    7: "d",
    8: "e",
  },
};

export const algorithmS: Record<string, string> = {
  "0_0": "0",
  "1_0": "0",
  "0_1": "0",
  "1_1": "0",

  "6_0": "+!!!",
  "5_0": "+!!",
  "5_1": "+!!",
  "4_0": "+!",
  "4_1": "+!",
  "3_0": "+",
  "3_1": "+",
  "2_0": "+",
  "2_1": "+",

  "0_6": "-!!!",
  "0_5": "-!!",
  "1_5": "-!!",
  "0_4": "-!",
  "1_4": "-!",
  "0_3": "-",
  "1_3": "-",
  "0_2": "-",
  "1_2": "-",

  "4_2": "±!",
  "2_4": "±!",
  "2_2": "±",
  "2_3": "±",
  "3_2": "±",
  "3_3": "±",
};

export function getFactorByImage(roundId: number, imageId: number) {
  const roundFactors = factorMap[roundId];

  if (!roundFactors) {
    console.warn(`Нет факторов для раунда ${roundId}`);
    return null;
  }

  if (!(imageId in roundFactors)) {
    console.warn(`Нет фактора для image ${imageId} в раунде ${roundId}`);
    return null;
  }

  return roundFactors[imageId];
}

export function buildFactorSummary(session: TestSession): FactorSummary {
  const positive: Record<Factor, number> = {
    m: 0,
    d: 0,
    p: 0,
    k: 0,
    hy: 0,
    e: 0,
    s: 0,
    h: 0,
  };

  const negative: Record<Factor, number> = {
    m: 0,
    d: 0,
    p: 0,
    k: 0,
    hy: 0,
    e: 0,
    s: 0,
    h: 0,
  };

  for (const round of session.answers) {
    for (const imageId of round.liked) {
      const factor = getFactorByImage(round.roundId, imageId);
      if (factor) {
        positive[factor] += 1;
      }
    }

    for (const imageId of round.disliked) {
      const factor = getFactorByImage(round.roundId, imageId);
      if (factor) {
        negative[factor] += 1;
      }
    }
  }

  return { positive, negative };
}

export function calculateSigns(summary: FactorSummary) {
   
  const signs = {
    m: "",
    d: "",
    p: "",
    k: "",
    hy: "",
    e: "",
    s: "",
    h: "",
  };
 
for (const factor of Object.keys(summary.positive) as Factor[]) {
  const pos = summary.positive[factor] || 0;
  const neg = summary.negative[factor] || 0;
  const key = `${pos}_${neg}`;

  if (algorithmS[key]) { // fallback если нет в таблице
  signs[factor] = `${factor}`+algorithmS[key];
    } else if (pos > neg) {
  signs[factor] = "+";
    } else if (neg > pos) {
  signs[factor] = "-";
    } else {
  signs[factor] = "±";
  }
  }

  return signs;
}
