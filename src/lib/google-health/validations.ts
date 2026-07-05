import { z } from "zod";

const CivilDateTimeSchema = z.object({
  date: z.object({
    year: z.int(),
    month: z.int(),
    day: z.int(),
  }),
});

export const googleHealthWeightSchema = z.object({
  rollupDataPoints: z.array(
    z.object({
      civilStartTime: CivilDateTimeSchema,
      civilEndTime: CivilDateTimeSchema,
      weight: z.object({ weightGramsAvg: z.int() }),
    }),
  ),
});

export type googleHealthWeightLogs = z.infer<typeof googleHealthWeightSchema>;
