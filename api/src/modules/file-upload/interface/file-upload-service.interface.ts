import { S3 } from 'aws-sdk';

export interface IFileUploadService {
  uploadPublicFile(dataBuffer: Buffer, filename: string): Promise<S3.ManagedUpload.SendData>;
}
