export type PortraitImage = {
  id: string;
  src: string;
  alt?: string;
};

export type TestRound = {
  id: number;
  images: PortraitImage[];
};

export type RoundAnswer = {
  roundId: number;
  liked: number[];
  disliked: number[];
};

export type StimulusSetConfig = {
  id: string;
  label: string;
  folder: string;
};

export type TestConfig = {
  rounds: number;
  imagesPerRound: number;
  stimulusSets: StimulusSetConfig[];
};

export type TestSession = {
  id: string;
  test: string;
  startedAt: string;
  completedAt?: string;
  currentRoundIndex: number;
  stimulusSet: string;
  participantCode?: string;
  participantNote?: string;
  answers: RoundAnswer[];
};

export type StepMode = "liked" | "disliked";
