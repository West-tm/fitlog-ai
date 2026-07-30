import { gemini } from "@/lib/gemini/gemini";

type GeminiGenerateContentResult =
  | { ok: true; content: string }
  | { ok: false; error: string };

export async function geminiGenerateContent(
  promptContent: string,
  messageContent: string,
  isUseGoogleSearch: boolean,
  bodyLogs: { date: string; weightKg: number }[],
): Promise<GeminiGenerateContentResult> {
  const config = isUseGoogleSearch
    ? { tools: [{ googleSearch: {} }] }
    : undefined;

  const bodyLogsString =
    bodyLogs.length > 0
      ? bodyLogs.map((log) => `${log.date}: ${log.weightKg}kg`).join("\n")
      : "体重データはありません";

  try {
    const result = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        #指示
        ${promptContent}
        #メッセージ
        ${messageContent}
        #体重データ
        ${bodyLogsString}
        `.trim(),
      config,
    });

    const feedbackContent = result.text?.trim();

    if (!feedbackContent) {
      return { ok: false, error: "AIから回答を取得できませんでした。" };
    }

    return { ok: true, content: feedbackContent };
  } catch {
    return {
      ok: false,
      error: "AI回答の作成に失敗しました。時間をおいて再度お試しください。",
    };
  }
}
