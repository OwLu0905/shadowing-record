import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }).min(8, {
    message: "At least 8 characters",
  }),
});
