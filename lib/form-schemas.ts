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
  name: z.string().min(1, "Name cannot be empty"),
  code: z.string().optional(),
  description: z.string().optional(),
  startsNow: z.boolean().default(true),
  startDate: z.date().default(new Date()),
  endDate: z.date().default(addDays(new Date(), 30)),
});

export const JoinEventFormSchema = z.object({
  code: z.string().min(1, "Code cannot be empty"),
});