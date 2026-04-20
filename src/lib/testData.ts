import { testConfig } from "@/config/testConfig";

export function generateTestData(stimulusSet: string) {
  return Array.from({ length: testConfig.rounds }).map((_, roundIndex) => {
    const roundId = roundIndex + 1;

    return {
      id: roundId,
      images: Array.from({ length: testConfig.imagesPerRound }).map(
        (_, i) => {
          const imageId = i + 1;

          return {
            id: imageId, // ✅ теперь number
            src: `/${stimulusSet}/round${roundId}/${imageId}.jpg`, // ✅ сразу готовый путь
            alt: `Раунд ${roundId}, портрет ${imageId}`,
          };
        }
      ),
    };
  });
}
