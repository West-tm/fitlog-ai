import { z } from "zod";

const civilDateTimeSchema = z.object({
  date: z.object({
    year: z.int(),
    month: z.int(),
    day: z.int(),
  }),
});

export const googleHealthWeightSchema = z.object({
  rollupDataPoints: z.array(
    z.object({
      civilStartTime: civilDateTimeSchema,
      civilEndTime: civilDateTimeSchema,
      weight: z.object({ weightGramsAvg: z.int() }),
    }),
  ),
});

export type GoogleHealthWeightLogs = z.infer<typeof googleHealthWeightSchema>;

const toUtcDay = (dateString: string) => {
  const DAY_MS = 24 * 60 * 60 * 1000;

  const [year, month, day] = dateString.split("-").map(Number);

  return Date.UTC(year, month - 1, day) / DAY_MS;
};

export const googleHealthWeightSyncFormSchema = z
  .object({
    startDate: z.iso.date("開始日を入力してください"),
    endDate: z.iso.date("終了日を入力してください"),
  })
  .superRefine((data, ctx) => {
    const startDate = toUtcDay(data.startDate);
    const endDate = toUtcDay(data.endDate);

    if (endDate < startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "終了日は開始日以降の日付を選択してください",
      });

      return;
    }

    const diffDays = endDate - startDate;

    if (diffDays > 90) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "日付の間隔は90日以内にしてください",
      });
    }
  });

export type GoogleHealthWeightSyncFormValues = z.infer<
  typeof googleHealthWeightSyncFormSchema
>;
