import { AWSError, S3 } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { certificationUserRequestDto } from '../dto/certification-user.request.dto';
import { createUserRequestDto } from '../dto/create-user.request.dto';
import { editUserDataRequestDto } from '../dto/edit-user-data.request.dto';
import { editUserProfileRequestDto } from '../dto/edit-user-profile.request.dto';
import { sendEmailRequestDto } from '../dto/send-email.request.dto';
import { UserResponseDto } from '../dto/user.response.dto';
import { UsersResponseDto } from '../dto/users.response.dto';

export interface IUserService {
  getUsers(): Promise<UsersResponseDto>;
  createUser(userData: createUserRequestDto): Promise<{ user: string } | UserResponseDto>;
  getCertificationUser(email: string): Promise<UserResponseDto>;
  certificationUser(userData: certificationUserRequestDto): Promise<UserResponseDto>;
  findCertificationUser(id: number): Promise<UsersResponseDto>;
  getPasswordHash(password: string): string;
  editUserProfile(editUserData: editUserDataRequestDto): Promise<UserResponseDto>;
  findUser(email: string): Promise<UserResponseDto>;
  sendEmail(userData: sendEmailRequestDto): Promise<String>;
  editUser(registerProfileImageData: editUserProfileRequestDto): Promise<UserResponseDto>;
  deleteProfileImage(
    email: string,
  ): Promise<UsersResponseDto | PromiseResult<S3.DeleteObjectOutput, AWSError>>;
  addAvatar(imageBuffer: Buffer, filename: string): Promise<S3.ManagedUpload.SendData>;
}
