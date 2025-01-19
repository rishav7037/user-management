import { IsString, IsNotEmpty, MinLength, IsArray } from 'class-validator';
import { Role } from 'src/common/role.enum';

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
