export type PresetType = 'thai_student' | 'thai_uniform' | 'thai_rodor' | 'job_app' | 'passport';

export type Gender = 'male' | 'female' | 'unspecified';

export interface PromptState {
  preset: PresetType;
  gender: Gender;
  ageImpression: string;
  uniformType: string;
  backgroundType: string;
  framingType: string;
  cropRatio: string;
  expression: string;
  skinCorrectionLevel: string;
  hairStylePreset: string;
  hairNeatnessLevel: string;
  hairlineCleanup: boolean;
  preserveHairDirection: boolean;
  strictThaiMilitaryHaircut: boolean;
  hairCleanupNote: string;
  operatorNote: string;
  strictIdentity: boolean;
  preserveInsignia: boolean;
  showUpperBody: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  preset: string;
  prompt: string;
  negativePrompt: string;
}
