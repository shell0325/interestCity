import { registerTagRequestDto } from "../dto/register_tag.request.dto";
import { TagsResponseDto } from "../dto/tags.response.dto";

export interface ITagService {
  getTag(): Promise<TagsResponseDto>;
  registerTag(tagData: registerTagRequestDto): Promise<void>;
}
