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
  @Get()
  async getGenre(): Promise<CommonResponse> {
    let responseData: GenresResponseDto;

    responseData = await this._genreService.getGenre();

    return new OkResponse(responseData);
  }

  @Get('/find')
  async findGenre(@Body() userId: any) {
    const genreData = await this._genreService.findGenre(userId.userId);
    return genreData;
  }

  @Post()
  async createGenre(@Body() genres: createGenreRequestDto) {
    let responseData: GenreResponseDto;
    responseData = await this._genreService.createGenre(genres);

    return new CreatedResponse(responseData);
  }

  @Post('register')
  async registerGenre(@Body() genreData: registerGenreRequestDto) {
    const result = await this._genreService.registerGenre(genreData);
    return result;
  }
}
