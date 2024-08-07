import { z } from "zod";

export const logInFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createEventFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  code: z.string(),
  startsNow: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string(),
});