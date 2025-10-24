import AWS from "aws-sdk";
import stream from "stream";
import { S3_SIGNED_URL_EXPIRATION_TIME } from "../../../config/global";

type S3UploadConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
  bucketName: string;
};

type S3UploadStream = {
  writeStream: stream.PassThrough;
  promise: Promise<AWS.S3.ManagedUpload.SendData>;
};

export class AWSS3Uploader {
  private s3: AWS.S3;
  public config: S3UploadConfig;

  constructor(config: S3UploadConfig) {
    AWS.config = new AWS.Config();
    AWS.config.update({
      region: config.region || "ap-south-1",
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    });
    this.s3 = new AWS.S3();
    this.config = config;
  }

  createUploadStream(key: string): S3UploadStream {
    const pass = new stream.PassThrough();
    return {
      writeStream: pass,
      promise: this.s3
        .upload({
          Bucket: this.config.bucketName,
          Key: key,
          Body: pass,
          ACL: "public-read"
        })
        .promise(),
    };
  }

  createDestinationFilePath(
    folder: string,
    filename: string,
    extension: string
  ): string {
    return `${folder}/${filename}.${extension}`;
  }

  async deleteFilesFromBucket(files: string[]) {
    const s3 = new AWS.S3();
    const deleteParams = {
      Bucket: this.config.bucketName,
      Delete: { Objects: [] },
    };

    if (files && files.length && files.length > 0) {
      files.forEach((file) => {
        deleteParams.Delete.Objects.push({
          Key: `${file}`,
        });
      });
    }

    return s3.deleteObjects(deleteParams).promise();
  }

  async getPresignedUrl(
    key: string,
    expireSeconds: number = S3_SIGNED_URL_EXPIRATION_TIME
  ) {
    const s3 = new AWS.S3();
    if (!key) return Promise.resolve(null);
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Expires: expireSeconds
    };
    return new Promise((resolve, reject) => {
      s3.getSignedUrl("getObject", params, (err, url) => {
        if (err) return reject(err);
        resolve(url);
      });
    });
  }
}

export const s3Helper = new AWSS3Uploader({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucketName: process.env.AWS_S3_BUCKET_NAME,
});
