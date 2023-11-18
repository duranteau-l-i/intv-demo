import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../../domain/model/User';

class CreateUserDTO {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @MinLength(3)
  firstName: string;

  @IsString()
  @MinLength(3)
  lastName: string;

  @IsEmail()
  email: string;

  @IsArray()
  @MinLength(3)
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  role?: Role;
}

export default CreateUserDTO;
