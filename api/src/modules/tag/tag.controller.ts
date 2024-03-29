import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommonResponse, OkResponse } from 'src/common/types/response';
import { registerTagRequestDto } from './dto/register-tag.request.dto';
import { TagsResponseDto } from './dto/tags.response.dto';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly _tagService: TagService) {}

  /**
   *全タグデータを取得する
   * @returns 全タグデータ
   */
  @Get()
  async getTag(): Promise<CommonResponse> {
    let tagsData: TagsResponseDto;

    tagsData = await this._tagService.getTag();

    return new OkResponse(tagsData);
  }

  /**
   *タグを登録する
   * @param tagData 登録するタグのデータ
   * @returns 登録したタグデータ
   */
  @Post()
  async registerTag(@Body() tagData: registerTagRequestDto) {
    const registerTag = await this._tagService.registerTag(tagData);
    return registerTag;
  }
}
