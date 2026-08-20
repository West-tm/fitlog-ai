import { Gender } from "@prisma/client";
import { z } from "zod";

import { toTokyoDateString } from "../date";

export const profileFormSchema = z
  .object({
    name: z.string().min(1, "名前を入力してください"),
    gender: z.enum(Gender).optional(),
    heightCm: z.preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      z.coerce
        .number({ error: "身長を入力してください" })
        .min(100, "身長は100cm以上で入力してください")
        .max(250, "身長は250cm以下で入力してください"),
    ),
    birthDate: z
      .string()
      .min(1, "生年月日を入力してください")
      .pipe(z.iso.date()),
  })
  .refine((data) => data.birthDate <= toTokyoDateString(), {
    message: "生年月日は過去の日付を選択してください",
    path: ["birthDate"],
  });

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
