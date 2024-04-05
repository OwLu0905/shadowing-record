import * as z from "zod";
import { recordUuidSchema } from "./item-params";

export const NewRecordFormSchema = z.object({
  title: z.string().min(1, { message: "required" }),
  description: z.string(),
  shadowingUrl: z.string().min(1, { message: "required" }),
  shadowingType: z.string().min(1, { message: "required" }),
});

export const NewRecordSchema = z.object({
  userId: recordUuidSchema,
  title: z.string().min(1, { message: "required" }),
  description: z.string().min(1, { message: "required" }),
  thumbnailUrl: z.string(),
  shadowingUrl: z.string().min(1, { message: "required" }),
  shadowingType: z.number().min(1, { message: "required" }),
});

export const NewAudioSchema = z.object({
  userId: recordUuidSchema,
  recordId: recordUuidSchema,
  audioUrl: z.string().min(1),
  startSeconds: z.string(),
  endSeconds: z.string(),
});
