import { z } from "zod";

export const LogInFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const CreateEventFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  code: z.string(),
  startsNow: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string(),
});

export const JoinEventFormSchema = z.object({
  code: z.string(),
});