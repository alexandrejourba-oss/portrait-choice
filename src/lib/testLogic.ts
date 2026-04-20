import { RoundAnswer, TestSession } from "@/types/test";
import { getFactorByImage } from "@/lib/factors";

export function createEmptySession(): TestSession {
  return {
    test: "portrait-choice",
    startedAt: new Date().toISOString(),
    currentRoundIndex: 0,
    stimulusSet: "",
    participantCode: "",
    participantNote: "",
        answers: []
  };
}

export function setStimulusSet(
  session: TestSession,
  set: string
): TestSession {
  return {
    ...session,
    stimulusSet: set, // ✅ просто строка
  };
}


export function upsertRoundAnswer(
  session: TestSession,
  answer: RoundAnswer
): TestSession {
  const existingIndex = session.answers.findIndex(
    (a) => a.roundId === answer.roundId
  );

  const answers = [...session.answers];

  if (existingIndex >= 0) {
    answers[existingIndex] = answer;
  } else {
    answers.push(answer);
  }

  return {
    ...session,
    answers,
  };
}

export function finalizeSession(session: TestSession): TestSession {
  return {
    ...session,
    completedAt: new Date().toISOString(),
  };
}

export function buildDetailedResult(session: TestSession) {
  return session.answers.map((round) => ({
    roundId: round.roundId,

    liked: round.liked.map((imageId) => {
      const position = imageId; // ✅ просто число

      return {
        imageId,
        position,
        factor: getFactorByImage(round.roundId, imageId),
      };
    }),

    disliked: round.disliked.map((imageId) => {
      const position = imageId; // ✅ просто число

      return {
        imageId,
        position,
        factor: getFactorByImage(round.roundId, imageId),
      };
    }),
  }));
}


/**
 * CSV не по факторам, а по выбору портретов.
 * Каждая строка = один выбранный портрет.
 */
export function portraitSelectionsToCsv(session: TestSession): string {
  const rows: string[] = [];

  rows.push(
    [
      "Серия",
      "Тип выбора",
      "Портрет",
      "Позиция",
      "Фактор",
      "ID изображения",
    ].join(";")
  );

  for (const round of session.answers) {
    for (const imageId of round.liked) {
      const factor = getFactorByImage(round.roundId, imageId);
      const position = imageId;

      rows.push(
        [
          round.roundId,
          "Положительный",
          `Портрет ${position}`,
          position,
          factor ?? "",
          imageId,
        ].join(";")
      );
    }

    for (const imageId of round.disliked) {
      const factor = getFactorByImage(round.roundId, imageId);
      const position = imageId;

      rows.push(
        [
          round.roundId,
          "Отрицательный",
          `Портрет ${position}`,
          position,
          factor ?? "",
          imageId,
        ].join(";")
      );
    }
  }

  return rows.join("\n");
}

export function updateParticipantMeta(
  session: TestSession,
  meta: {
    participantCode?: string;
    participantNote?: string;
  }
): TestSession {
  return {
    ...session,
    participantCode: meta.participantCode ?? session.participantCode,
    participantNote: meta.participantNote ?? session.participantNote,
  };
}