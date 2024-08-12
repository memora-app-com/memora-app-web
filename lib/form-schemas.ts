import { addDays } from "date-fns";
import { z } from "zod";

export const LogInFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const CreateEventFormSchema = z.object({
  name: z.string()
    .min(3, "Event name should have at least 3 characters")
    .max(50, "Event name should have at most 50 characters"),
  description: z.string().optional(),
  code: z.string()
    .min(4, "Code should have at least 4 characters")
    .max(10, "Code should have at most 10 characters"),
  startsNow: z.boolean().default(true),
  startDate: z.date().optional(),
  endDate: z.date().default(addDays(new Date(), 1)),
});

export const JoinEventFormSchema = z.object({
  code: z.string(),
});