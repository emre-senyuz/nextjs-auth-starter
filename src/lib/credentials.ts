import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password.").max(72, "Use at most 72 characters."),
});
