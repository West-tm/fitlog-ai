export type ChatHistory = {
  userText: string; // Message.content
  modelText: string; // Feedback.content
};

export type HealthLogForGemini = {
  date: string;
  weightKg?: number;
  bodyFatPercentage?: number;
  stepsCount?: number;
  totalCaloriesKcal?: number;
};
