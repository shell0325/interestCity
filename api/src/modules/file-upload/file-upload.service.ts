import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { S3 } from 'aws-sdk';
import { IFileUploadService } from './interface/file-upload-service.interface';

const s3 = new S3();

@Injectable()
export class FileUploadService implements IFileUploadService {
  /**
   *ファイルをS3にアップロードする
   * @param dataBuffer アップロードするファイルのバッファーデータ
   * @param filename アップロードするファイルの名前
   * @returns アップロードしたファイルのデータ
   */
  async uploadPublicFile(dataBuffer: Buffer, filename: string): Promise<S3.ManagedUpload.SendData> {
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
