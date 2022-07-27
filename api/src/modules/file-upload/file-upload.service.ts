import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { S3 } from 'aws-sdk';

const s3 = new S3();

@Injectable()
export class FileUploadService {
  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME!,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();
    return uploadResult;
  }
}
