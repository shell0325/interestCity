import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/users.entity';
import { UserService } from '../user/user.service';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [FileUploadController],
  providers: [FileUploadService, UserService],
  exports: [FileUploadModule],
})
export class FileUploadModule {}
