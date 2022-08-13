import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channels_Tags } from 'src/database/entities/channels_tags.entity';
import { Tag } from 'src/database/entities/tags.entity';
import { Repository } from 'typeorm';
import { ChannelTagsResponseDto } from './dto/channel_tags.response.dto';
import { registerTagRequestDto } from './dto/register-tag.request.dto';
import { TagsResponseDto } from './dto/tags.response.dto';
import { ITagService } from './interface/tag-service.interface';

@Injectable()
export class TagService implements ITagService {
  constructor(
    @InjectRepository(Tag)
    private readonly _tagRepository: Repository<Tag>,
    @InjectRepository(Channels_Tags)
    private readonly _channels_tagsRepository: Repository<Channels_Tags>,
  ) {}

  async getTag(): Promise<TagsResponseDto> {
    const tags = await this._tagRepository.find();
    if (!tags) throw new NotFoundException();
    return { tags };
  }

  async registerTag(tagData: registerTagRequestDto): Promise<ChannelTagsResponseDto> {
    const channel_tags: Channels_Tags[] = [];
    for (const tagName of tagData.name) {
      const tags = await this._tagRepository.find({
        where: {
          name: tagName,
        },
      });
      if (tags.length === 0) {
        const registerTag = await this._tagRepository.save({ name: tagName });
        const channel_tag = await this._channels_tagsRepository.save({
          tagId: registerTag.id,
          tagName: registerTag.name,
          channelId: tagData.channelId,
          genreId: tagData.genreId,
        });
        channel_tags.push(channel_tag);
      } else if (tags.length !== 0) {
        const channel_tag = await this._channels_tagsRepository.save({
          tagId: tags[0].id,
          tagName: tags[0].name,
          channelId: tagData.channelId,
          genreId: tagData.genreId,
        });
        channel_tags.push(channel_tag);
      }
    }
    return { channel_tags };
  }
}
