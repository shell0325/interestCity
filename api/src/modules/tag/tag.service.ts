import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channels_Tags } from 'src/database/entities/channels_tags.entity';
import { Tag } from 'src/database/entities/tags.entity';
import { Repository } from 'typeorm';
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

  async registerTag(tagData: registerTagRequestDto): Promise<void> {
    tagData.name.forEach(async (element) => {
      const tags = await this._tagRepository.findOne({
        where: {
          name: element,
        },
      });
      if (!tags) {
        const tag = await this._tagRepository.save({ name: element });
        const channel_tag = await this._channels_tagsRepository.save({
          tagId: tag.id,
          channelId: tagData.channelId,
          genreId: tagData.genreId,
        });
        return { tag: tag, channel_tag: channel_tag };
      } else if (tags) {
        const channel_tag = await this._channels_tagsRepository.save({
          tagId: tags.id,
          channelId: tagData.channelId,
          genreId: tagData.genreId,
        });
        return channel_tag;
      }
    });
  }
}
