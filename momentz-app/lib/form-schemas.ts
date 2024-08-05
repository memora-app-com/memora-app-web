import { z } from "zod";

export const logInFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
