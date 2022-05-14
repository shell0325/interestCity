import { createUserRequestDto } from '../dto/create-user.request.dto';
import { UserResponseDto } from '../dto/user.response.dto';
import { UsersResponseDto } from '../dto/users.response.dto';

export interface IUserService {
  getUsers(): Promise<UsersResponseDto>;
  createUser(userData: createUserRequestDto): Promise<{ user: string } | UserResponseDto>;
  findUser(email: string): Promise<UserResponseDto>;
  getPasswordHash(password: string): string;
}
