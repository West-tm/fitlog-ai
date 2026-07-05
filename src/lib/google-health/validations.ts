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
