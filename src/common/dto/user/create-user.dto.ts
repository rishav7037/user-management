import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from './../../role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  role: Role;
}
