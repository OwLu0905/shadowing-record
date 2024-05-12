"use server";
import * as z from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { audios, records } from "@/db/schema/schema";
import { recordUuidSchema } from "@/schema/item-params";
import { NewAudioSchema, NewRecordSchema } from "@/schema/records";
import {
  deleteS3ObjectItem,
  deleteS3ObjectList,
  getS3SignedUrlList,
} from "@/api/s3";
import { format } from "date-fns";

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

    const query = await db
      .select({
        month: sql<string>`DATE_TRUNC('month', ${records.createdAt})`.as(
          "month",
        ),

        recordId: records.recordId,
        id: records.recordId,
        title: records.title,
        thumbnailUrl: records.thumbnailUrl,
        createdAt: records.createdAt,
      })
      .from(records)
      .where(eq(records.userId, userId))
      .orderBy(
        desc(records.createdAt),
        sql<string>`DATE_TRUNC('month', ${records.createdAt})`,
      );

    const groupByMonth = query.reduce<
      {
        month: string;
        data: {
          month: string;
          recordId: string;
          title: string;
          thumbnailUrl: string | null;
          createdAt: Date;
        }[];
      }[]
    >((acc, current) => {
      const month = format(current.month, "yyyy-MM");

      const existingMonthIndex = acc.findIndex(
        (i) => format(i.month, "yyyy-MM") === month,
      );

      if (existingMonthIndex === -1) {
        acc.push({
          month: month,
          data: [current],
        });
        return acc;
      }

      acc[existingMonthIndex].data.push(current);

      return acc;
    }, []);

    return groupByMonth;
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

    const data = await db
      .select()
      .from(records)
      .where(eq(records.recordId, id))
      .orderBy(desc(records.createdAt));

    if (data.length === 0) {
      throw new Error("can't fint this record");
    }
    return data;
  } catch (err) {
    console.log(err, "cant get record");
  }
};
export const deleteaRecordById = async (recordId: string) => {
  try {
    const recordUuidValid = recordUuidSchema.safeParse(recordId);
    if (!recordUuidValid.success) {
      throw new Error("invalid audios data");
    }

    await db.delete(records).where(eq(records.recordId, recordId));

    await deleteS3ObjectList(recordId);

    revalidatePath(`records/${recordId}`);
  } catch (error) {
    console.log(error);
  }
};

// NOTE: Create
export const createAudio = async (data: z.infer<typeof NewAudioSchema>) => {
  try {
    const validSec = z.preprocess(
      (value) => (value === null ? NaN : Number(value)),
      z.number().refine((value) => !isNaN(value), {
        message: "Invalid number",
      }),
    );
    const startSchema = validSec.safeParse(data.startSeconds);
    const endSchema = validSec.safeParse(data.endSeconds);

    if (startSchema.success && endSchema.success) {
      await db.insert(audios).values({
        ...data,
        startSeconds: startSchema.data,
        endSeconds: endSchema.data,
      });
    } else {
      throw new Error("invalid start or end time");
    }
  } catch (error) {
    throw error;
  }
};

export const getAudiosById = async (recordId: string) => {
  try {
    const recordUuidValid = recordUuidSchema.safeParse(recordId);
    if (!recordUuidValid.success) {
      throw new Error("invalid audios data");
    }

    const data = await db
      .select()
      .from(audios)
      .where(eq(audios.recordId, recordId))
      .orderBy(desc(audios.createdAt));

    const presignedUrls = await getS3SignedUrlList(recordId, data);

    const newData = data.map((audio, index) => ({
      ...audio,
      audioUrl: presignedUrls[index],
    }));

    return newData;
  } catch (err) {
    console.log(err, "cant get audios");

    return null;
  }
};

export const deleteaAudioById = async (audioId: number) => {
  try {
    const deleteItem = await db
      .delete(audios)
      .where(eq(audios.audioId, audioId))
      .returning();

    const recordId = deleteItem[0].recordId;
    const deletePath = `${recordId}/${audioId}`;
    await deleteS3ObjectItem(deletePath);

    // revalidatePath(`records/${recordId}`);
  } catch (error) {
    console.log(error);
  }
};
