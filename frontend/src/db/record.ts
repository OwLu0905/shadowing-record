"use server";
import * as z from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { audios, records } from "@/db/schema/schema";
import { recordUuidSchema } from "@/schema/item-params";
import { NewAudioSchema, NewRecordSchema } from "@/schema/records";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { EnvParseConfig } from "@/util/env.schema";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

    const s3 = new S3Client({
      credentials: {
        accessKeyId: EnvParseConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: EnvParseConfig.AWS_SECRET_ACCESS_KEY,
      },
      region: EnvParseConfig.BUCKET_REGION,
    });

    const getPresignedUrl = async (audioUrl: string) => {
      const command = new GetObjectCommand({
        Bucket: EnvParseConfig.BUCKET_NAME,
        Key: `${recordId}/${audioUrl}`,
      });
      return getSignedUrl(s3, command, { expiresIn: 3600 });
    };

    const presignedUrls = await Promise.all(
      data.map((audio) => getPresignedUrl(audio.audioUrl)),
    );

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
