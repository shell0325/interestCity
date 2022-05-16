import { createGenreRequestDto } from "../dto/create-genre.request.dto";
import { GenreResponseDto } from "../dto/genre.response.dto";
import { GenresResponseDto } from "../dto/genres.response.dto";
import { registerGenreRequestDto } from "../dto/register-genre.request.dto";
import { UsersGenresResponseDto } from "../dto/users-genres.response.dto";

export interface IGenreService {
  getGenre(): Promise<GenresResponseDto>;
  findGenre(userId: number): Promise<UsersGenresResponseDto>;
  createGenre(genreData: createGenreRequestDto): Promise<GenreResponseDto>;
  registerGenre(registerData: registerGenreRequestDto): Promise<void>;
}
