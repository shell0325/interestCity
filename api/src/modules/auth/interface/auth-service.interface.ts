import { User } from 'src/database/entities/users.entity';

type PasswordOmitUser = Omit<User, 'password'>;

export interface IAuthService {
  validateUser(email: string, password: string): Promise<PasswordOmitUser>;
  login(user: PasswordOmitUser): Promise<{
    access_token: string;
    user: PasswordOmitUser;
  }>;
  getToken(user: PasswordOmitUser): Promise<{
    tokenVarify: PasswordOmitUser;
    token: string;
  }>;
}
