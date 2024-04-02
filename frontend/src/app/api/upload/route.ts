import { NextRequest } from "next/server";
import {
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

import { v4 as uuid } from "uuid";

import { EnvParseConfig } from "@/util/env.schema";
import { auth } from "@/lib/auth";
import { recordUuidSchema } from "@/schema/item-params";
import { createAudio } from "@/db/record";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const user = await auth();

  if (!user || !user.user || !user.user.id) {
    return new Response("unauthorization", { status: 401 });
  }

  try {
    const data = formData.get("file") as File;
    const recordId = formData.get("recordId") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;

    const recordIdValid = recordUuidSchema.safeParse(recordId);
    if (!recordIdValid.success) {
      return new Response("invalid record id", { status: 400 });
    }

    const s3 = new S3Client({
      credentials: {
        accessKeyId: EnvParseConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: EnvParseConfig.AWS_SECRET_ACCESS_KEY,
      },
      region: EnvParseConfig.BUCKET_REGION,
    });

    const fileType = data.type;
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const currentTimestamp = new Date();
    const formattedTimestamp = currentTimestamp
      .toISOString()
      .replace(/[-:.]/g, "")
      .slice(0, 15);

    const saveUuid = uuid();
    const filename = `${formattedTimestamp}_${saveUuid}`;
    const params: PutObjectCommandInput = {
      Bucket: EnvParseConfig.BUCKET_NAME,
      Key: `${recordId}/${filename}`,
      Body: buffer,
      ContentType: fileType,
    };

    const userId = user?.user?.id;

    const command = new PutObjectCommand(params);
    await s3.send(command);

    await createAudio({
      userId: userId,
      recordId: recordIdValid.data,
      audioUrl: `${filename}` as string,
      startSeconds: startTime,
      endSeconds: endTime,
    });

    return Response.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.log(error);
    return new Response("error", { status: 400 });
  }
}
