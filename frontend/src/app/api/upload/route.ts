import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

import { EnvParseConfig } from "@/util/env.schema";

import { NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  try {
    const data = formData.get("image") as File;

    const s3 = new S3Client({
      credentials: {
        accessKeyId: EnvParseConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: EnvParseConfig.AWS_SECRET_ACCESS_KEY,
      },
      region: EnvParseConfig.BUCKET_REGION,
    });

    const fileType = data.type;
    const filename = data.name;
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const params: PutObjectCommandInput = {
      Bucket: EnvParseConfig.BUCKET_NAME,
      Key: `images/${filename}`, // Include the filename in the key
      Body: buffer,
      ContentType: fileType,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    return Response.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.log(error);
    return new Response("error", { status: 400 });
  }
}
