import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { EnvParseConfig } from "@/util/env.schema";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getS3SignedUrlList(
  path: string,
  data: {
    audioUrl: string;
    recordId: string;
    userId: string;
    createdAt: Date;
    audioId: number;
    startSeconds: number;
    endSeconds: number;
  }[],
) {
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
      Key: `${path}/${audioUrl}`,
    });
    return getSignedUrl(s3, command, { expiresIn: 3600 });
  };

  const presignedUrls = await Promise.all(
    data.map((audio) => getPresignedUrl(audio.audioUrl)),
  );

  return presignedUrls;
}

export async function deleteS3ObjectItem(path: string) {
  try {
    const s3 = new S3Client({
      credentials: {
        accessKeyId: EnvParseConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: EnvParseConfig.AWS_SECRET_ACCESS_KEY,
      },
      region: EnvParseConfig.BUCKET_REGION,
    });

    const command = new DeleteObjectCommand({
      Bucket: EnvParseConfig.BUCKET_NAME,
      Key: path,
    });

    await s3.send(command);
  } catch (error) {
    throw error;
  }
}
export async function deleteS3ObjectList(path: string) {
  try {
    const s3 = new S3Client({
      credentials: {
        accessKeyId: EnvParseConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: EnvParseConfig.AWS_SECRET_ACCESS_KEY,
      },
      region: EnvParseConfig.BUCKET_REGION,
    });

    const listCommand = new ListObjectsV2Command({
      Bucket: EnvParseConfig.BUCKET_NAME,
      Prefix: `${path}/`,
    });

    let list = await s3.send(listCommand);

    if (list.KeyCount) {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: EnvParseConfig.BUCKET_NAME,
        Delete: {
          Objects: list?.Contents?.map((item) => ({ Key: item.Key })), // array of keys to be deleted
          Quiet: false, // provides info on successful deletes
        },
      });

      let deleted = await s3.send(deleteCommand); // delete the files

      if (deleted.Errors) {
        throw new Error("delete failed");
      }
    }
  } catch (error) {
    throw error;
  }
}

export async function getS3SignedItem(data: { audioUrl: string }) {
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
      Key: audioUrl,
    });
    return getSignedUrl(s3, command, { expiresIn: 3600 });
  };

  const presignedUrls = await getPresignedUrl(data.audioUrl);

  return presignedUrls;
}
