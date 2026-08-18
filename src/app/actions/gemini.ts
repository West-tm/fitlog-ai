import { gemini } from "@/lib/gemini/gemini";
import { ChatHistory, HealthLogForGemini } from "@/lib/types/gemini";

const MAX_HISTORY_TURNS = 5;

type GeminiGenerateContentResult =
  | { ok: true; content: string }
  | { ok: false; error: string };

function formatHealthLogs(logs: HealthLogForGemini[]) {
  if (logs.length === 0) return "健康データはありません";

  return logs
    .map((log) => {
      const parts = [
        log.weightKg != null ? `${log.weightKg}kg` : null,
        log.bodyFatPercentage != null
          ? `体脂肪 ${log.bodyFatPercentage}%`
          : null,
        log.stepsCount != null ? `${log.stepsCount}歩` : null,
        log.totalCaloriesKcal != null
          ? `消費 ${log.totalCaloriesKcal}kcal`
          : null,
      ].filter(Boolean);

      return `${log.date}: ${parts.join(" / ")}`;
    })
    .join("\n");
}

export async function geminiGenerateContent(
  promptContent: string,
  history: ChatHistory[] | null,
  messageContent: string,
  isUseGoogleSearch: boolean,
  healthLogs: HealthLogForGemini[],
): Promise<GeminiGenerateContentResult> {
  const config = isUseGoogleSearch
    ? { tools: [{ googleSearch: {} }] }
    : undefined;

  const healthLogsString = formatHealthLogs(healthLogs);

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
        #健康データ
        ${healthLogsString}
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
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: "AI回答の作成に失敗しました。時間をおいて再度お試しください。",
    };
  }
}
