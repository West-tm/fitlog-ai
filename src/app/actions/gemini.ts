import { gemini } from "@/lib/gemini/gemini";
import { ChatHistory } from "@/lib/types/gemini";

const MAX_HISTORY_TURNS = 5;

type GeminiGenerateContentResult =
  | { ok: true; content: string }
  | { ok: false; error: string };

export async function geminiGenerateContent(
  promptContent: string,
  history: ChatHistory[] | null,
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

  // 古い履歴は捨てて、直近の履歴をプロンプトに載せる
  const recentHistory = history?.length
    ? history
        .slice(-MAX_HISTORY_TURNS)
        .map(
          (turn) => `- ユーザー: ${turn.userText}\n- モデル: ${turn.modelText}`,
        )
        .join("\n")
    : "なし";

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
        #チャット履歴
        ${recentHistory}
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
