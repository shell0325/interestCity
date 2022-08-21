import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommonResponse, CreatedResponse, OkResponse } from 'src/common/types/response';
import { createGenreRequestDto } from './dto/create-genre.request.dto';
import { GenreResponseDto } from './dto/genre.response.dto';
import { GenresResponseDto } from './dto/genres.response.dto';
import { registerGenreRequestDto } from './dto/register-genre.request.dto';
import { GenreService } from './genre.service';

@Controller('genre')
export class GenreController {
  constructor(private readonly _genreService: GenreService) {}

  /**
   *全ジャンルデータを取得する
   * @returns 全ジャンルデータ
   */
  @Get()
  async getGenre(): Promise<CommonResponse> {
    let responseData: GenresResponseDto;

    responseData = await this._genreService.getGenre();

    return new OkResponse(responseData);
  }

  /**
   *ユーザーが登録済みのジャンルデータを取得する
   * @param userId ユーザーID
   * @returns ユーザーが登録済みのジャンルデータ
   */
  @Get('/find')
  async findGenre(@Body() userId: any) {
    const genreData = await this._genreService.findGenre(userId.userId);
    return genreData;
  }

  /**
   *ジャンルを作成する
   * @param genres 作成するジャンルのデータ
   * @returns 作成したジャンルデータ
   */
  @Post()
  async createGenre(@Body() genres: createGenreRequestDto) {
    let responseData: GenreResponseDto;
    responseData = await this._genreService.createGenre(genres);

    return new CreatedResponse(responseData);
  }

  /**
   *ジャンルを登録する
   * @param genreData 登録するジャンルデータ
   * @returns 登録したジャンルデータ
   */
  @Post('register')
  async registerGenre(@Body() genreData: registerGenreRequestDto) {
    const result = await this._genreService.registerGenre(genreData);
    return result;
  }
}
