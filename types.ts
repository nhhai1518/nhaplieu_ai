
export interface EducationEntry {
  id: string;
  order: number;
  fullName: string;
  unit: string;
  phoneNumber: string;
  timestamp: string;
}

export interface AppSettings {
  googleSheetUrl: string;
  webhookUrl: string;
}

export interface GeminiAnalysisResponse {
  isValid: boolean;
  suggestions: string[];
  normalizedName: string;
}
