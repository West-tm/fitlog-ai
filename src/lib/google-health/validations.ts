import { z } from "zod";

const civilDateTimeSchema = z.object({
  date: z.object({
    year: z.int(),
    month: z.int(),
    day: z.int(),
  }),
});

function dailyRollupSchema<T extends z.ZodRawShape>(value: T) {
  return z.object({
    rollupDataPoints: z
      .array(
        z.object({
          civilStartTime: civilDateTimeSchema,
          civilEndTime: civilDateTimeSchema,
          ...value,
        }),
      )
      .default([]),
  });
}

export const googleHealthWeightSchema = dailyRollupSchema({
  weight: z.object({ weightGramsAvg: z.int() }),
});
export const googleHealthBodyFatSchema = dailyRollupSchema({
  bodyFat: z.object({ bodyFatPercentageAvg: z.number() }),
});
export const googleHealthStepsSchema = dailyRollupSchema({
  steps: z.object({ countSum: z.coerce.number().int() }),
});
export const googleHealthCaloriesSchema = dailyRollupSchema({
  totalCalories: z.object({ kcalSum: z.number() }),
});
export type GoogleHealthWeight = z.infer<typeof googleHealthWeightSchema>;
export type GoogleHealthBodyFat = z.infer<typeof googleHealthBodyFatSchema>;
export type GoogleHealthSteps = z.infer<typeof googleHealthStepsSchema>;
export type GoogleHealthCalories = z.infer<typeof googleHealthCaloriesSchema>;

const toUtcDay = (dateString: string) => {
  const DAY_MS = 24 * 60 * 60 * 1000;

  const [year, month, day] = dateString.split("-").map(Number);

  return Date.UTC(year, month - 1, day) / DAY_MS;
};

export const googleHealthDataSyncFormSchema = z
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

    if (diffDays > 13) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "日付の間隔は14日以内にしてください",
      });
    }
  });

export type GoogleHealthDataSyncFormValues = z.infer<
  typeof googleHealthDataSyncFormSchema
>;
