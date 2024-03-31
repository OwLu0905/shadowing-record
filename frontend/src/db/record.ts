"use server";
import * as z from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { audios, records } from "@/db/schema/schema";
import { recordUuidSchema } from "@/schema/item-params";
import { NewAudioSchema, NewRecordSchema } from "@/schema/records";
import { throws } from "assert";

// NOTE: Create
export const createRecord = async (data: z.infer<typeof NewRecordSchema>) => {
  let recordId: string | undefined = undefined;
  try {
    const result = await db
      .insert(records)
      .values(data)
      .returning({ recordId: records.recordId });

    recordId = result[0].recordId;
  } catch (error) {
    throw error;
  }

  if (recordId) {
    revalidatePath("/records");
    redirect(`/records/${recordId}`);
  }
};

export const getRecordByUserId = async (userId: string) => {
  try {
    const recordUuidValid = recordUuidSchema.safeParse(userId);
    if (!recordUuidValid.success) {
      throw new Error("invalid record");
    }

    return await db
      .select()
      .from(records)
      .where(eq(records.userId, userId))
      .orderBy(desc(records.createdAt));
  } catch (err) {
    console.log(err, "cant get record");

    return null;
  }
};

export const getRecordById = async (id: string) => {
  try {
    const recordUuidValid = recordUuidSchema.safeParse(id);
    if (!recordUuidValid.success) {
      throw new Error("invalid record");
    }

    return await db
      .select()
      .from(records)
      .where(eq(records.recordId, id))
      .orderBy(desc(records.createdAt));
  } catch (err) {
    console.log(err, "cant get record");

    return null;
  }
};

// NOTE: Create
export const createAudio = async (data: z.infer<typeof NewAudioSchema>) => {
  let recordId: string | undefined = undefined;
  try {
    const result = await db
      .insert(records)
      .values(data)
      .returning({ recordId: records.recordId });

    recordId = result[0].recordId;
  } catch (error) {
    throw error;
  }

  if (recordId) {
    revalidatePath("/records");
    redirect(`/records/${recordId}`);
  }
};

export const getAudiosById = async (recordId: string) => {
  try {
    const recordUuidValid = recordUuidSchema.safeParse(recordId);
    if (!recordUuidValid.success) {
      throw new Error("invalid audios data");
    }

    return await db
      .select()
      .from(audios)
      .where(eq(audios.recordId, recordId))
      .orderBy(desc(audios.createdAt));
  } catch (err) {
    console.log(err, "cant get audios");

    return null;
  }
};
