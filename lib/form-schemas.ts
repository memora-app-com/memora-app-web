import { addDays } from "date-fns";
import { z } from "zod";

export const LogInFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const SignUpFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  // confirmPassword: z.string(),
});

export const CreateEventFormSchema = z.object({
  code: z.string()
    .optional(),
  name: z.string()
    .optional(),
  description: z.string()
    .optional(),
  startsNow: z.boolean()
    .default(true),
  startDate: z.date()
    .optional(),
  endDate: z.date()
    .default(addDays(new Date(), 1)),
});

export const JoinEventFormSchema = z.object({
  code: z.string(),
});