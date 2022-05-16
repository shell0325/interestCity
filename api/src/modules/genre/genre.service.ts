import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from 'src/database/entities/genres.entity';
import { Users_Genres } from 'src/database/entities/users_genres.entity';
import { Repository } from 'typeorm';
import { createGenreRequestDto } from './dto/create-genre.request.dto';
import { GenreResponseDto } from './dto/genre.response.dto';
import { GenresResponseDto } from './dto/genres.response.dto';
import { registerGenreRequestDto } from './dto/register-genre.request.dto';
import { UsersGenresResponseDto } from './dto/users-genres.response.dto';
import { IGenreService } from './interface/genre-service.interface';

@Injectable()
export class GenreService implements IGenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly _genreRepository: Repository<Genre>,
    @InjectRepository(Users_Genres)
    private readonly _users_genresRepository: Repository<Users_Genres>,
  ) {}

  async getGenre(): Promise<GenresResponseDto> {
    const genres = await this._genreRepository.find();
    return { genres };
  }

  async findGenre(userId: number): Promise<UsersGenresResponseDto> {
    const usersGenres = await this._users_genresRepository.find({
      where: {
        userId: userId,
      },
      relations: ['genre'],
    });
    usersGenres.sort((a, b) => a.id - b.id);
    return { usersGenres };
  }

  async createGenre(genreData: createGenreRequestDto): Promise<GenreResponseDto> {
    const genre = await this._genreRepository.save(genreData);
    return { genre };
  }

  async registerGenre(registerData: registerGenreRequestDto): Promise<void> {
    const genreDelete = await this._users_genresRepository.delete({
      userId: registerData.userId,
    });
    const genreData = await this._users_genresRepository.find({
      where: { userId: registerData.userId },
    });
    if (genreData.length !== 0) {
      throw new NotFoundException();
    }
    registerData.genre.forEach(async (element) => {
      const users_genreData = {
        userId: registerData.userId,
        genreId: element.id,
      };
      const users_genre = await this._users_genresRepository.save(users_genreData);
      return users_genre;
    });
  }
}
