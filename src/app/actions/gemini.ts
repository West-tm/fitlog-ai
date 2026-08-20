import { User } from "@prisma/client";

import { toTokyoDateString } from "@/lib/date";
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

function formatProfile(profile: User | null) {
  if (!profile) return "プロフィールはありません";

  return `
    名前: ${profile.name ?? "未設定"}
    性別: ${profile.gender ?? "未設定"}
    身長: ${profile.heightCm ? `${profile.heightCm}cm` : "未設定"}
    生年月日: ${profile.birthDate ? toTokyoDateString(profile.birthDate) : "未設定"}
  `;
}

export async function geminiGenerateContent(
  promptContent: string,
  history: ChatHistory[] | null,
  messageContent: string,
  isUseGoogleSearch: boolean,
  healthLogs: HealthLogForGemini[],
  profile: User | null,
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
        #プロフィール
        ${formatProfile(profile)}
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
