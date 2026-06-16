export const promptTemplates = [
  {
    id: "workout",
    title: "筋トレ重視フィードバック",
    content:
      "筋トレ内容を重視して、良かった点・改善点・次回の具体的なアクションを提案してください。",
  },
  {
    id: "recovery",
    title: "睡眠・回復重視",
    content:
      "睡眠・疲労・回復を重視して、無理のない改善アドバイスをしてください。",
  },
  {
    id: "bulk",
    title: "増量期モード",
    content:
      "増量期として、摂取カロリー・筋トレ強度・体重推移を前向きに分析してください。",
  },
  {
    id: "cut",
    title: "減量期モード",
    content:
      "減量期として、食事管理・運動量・継続しやすさを重視して分析してください。",
  },
] as const;

export type PromptTemplate = (typeof promptTemplates)[number];
