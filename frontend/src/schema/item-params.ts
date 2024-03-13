import * as z from "zod";
import { validate } from "uuid";

export const recordUuidSchema = z.string().refine(validate, {
  message: "Invalid product ID",
});
