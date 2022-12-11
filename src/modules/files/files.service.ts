import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { IFolderType } from '../../shared/interfaces/IFolderType';

@Injectable()
export class FilesService {
  private s3 = new S3({
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    region: this.configService.get('AWS_REGION'),
  });

  constructor(private configService: ConfigService) {}

  public async uploadFile(imageBuffer: Buffer, fileName: string, ContentType: string, folder?: IFolderType) {
    const bucketFolder = `${this.configService.get('AWS_PUBLIC_BUCKET_NAME')}${folder ? folder : ''}`;

    return await this.s3
      .upload({
        Bucket: bucketFolder,
        Body: imageBuffer,
        Key: `${uuid()}-${fileName}`,
        ACL: 'public-read',
        ContentType,
      })
      .promise();
  }

  public async deleteFile(key: string) {
    return await this.s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: key,
      })
      .promise();
  }
}
