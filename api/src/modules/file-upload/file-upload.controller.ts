import {
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../user/user.service';
import { FileUploadService } from './file-upload.service';

@Controller('file-upload')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly _userService: UserService,
  ) {}
  @Post()
  async create(@Req() request: any, @Res() response: any) {
    try {
      await this.fileUploadService.uploadPublicFile(request, response);
    } catch (error) {
      return response.status(500).json(`Failed to upload image file: ${error}`);
    }
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(@Req() request: any, @UploadedFile() file: Express.Multer.File) {
    return this._userService.addAvatar(file.buffer, file.originalname);
  }
}
