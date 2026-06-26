import { z } from "zod";

export const googleHealthCallbackSchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
  scope: z.string().min(1).optional(),
});
